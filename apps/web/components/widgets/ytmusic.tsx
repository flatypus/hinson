import { useEffect, useState } from "react";
import { config } from "dotenv";
import Image from "next/image";

config();
// eslint-disable-next-line @typescript-eslint/dot-notation -- This is fine
const PATH = process.env["NEXT_PUBLIC_YTMUSIC_PATH"];

interface Play {
  title: string;
  artist: string;
  thumbnail: string;
  duration_s: number;
  started: number;
  url: string;
}

function formatSeconds(seconds: number): string {
  // (h)h:(m)m:ss
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const h = hours > 0 ? `${hours}:` : "";
  const m = minutes > 0 ? `${minutes}:` : "0:";
  const s = secs < 10 ? `0${secs}` : secs;
  return `${h}${m}${s}`;
}

export default function Playing(): JSX.Element {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Play | null>(null);
  const [time, setTime] = useState<number>(Date.now() / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now() / 1000);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchPlaying = (): void => {
    void fetch(`${PATH}/last`)
      .then((res) => res.json())
      .then((data: string) => JSON.parse(data) as Play)
      .then((data: Play) => {
        if (data.started + data.duration_s < time) {
          setCurrentlyPlaying(null);
          return;
        }
        setCurrentlyPlaying(data);
      });
  };

  useEffect(() => {
    fetchPlaying();
    const interval = setInterval(fetchPlaying, 5000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- This is fine
  }, [time]);

  return (
    <div className="flex h-[80px] w-full flex-row items-center overflow-hidden rounded-lg bg-white bg-opacity-80 p-2 text-[8px] shadow-lg">
      <Image
        alt={currentlyPlaying?.title ?? ""}
        className="mr-2 h-full rounded-md"
        height={64}
        src={currentlyPlaying?.thumbnail ?? ""}
        width={64}
      />
      <div className="flex h-full w-full flex-col place-items-center justify-center">
        <a
          className="line-clamp-2 max-w-[90%] font-semibold text-black hover:underline"
          href={currentlyPlaying?.url}
          rel="noreferrer"
          target="_blank"
        >
          <span className="whitespace-nowrap font-normal text-black">
            Hinson is now listening to:&nbsp;
          </span>
          {currentlyPlaying?.artist} - {currentlyPlaying?.title}
        </a>
        <div className="mt-1 h-[2px] w-full rounded-lg bg-gray-400">
          <div
            className="relative h-full rounded-lg bg-gray-800"
            style={{
              width: `${Math.min(
                100,
                (100 * (time - (currentlyPlaying?.started ?? 0))) /
                  (currentlyPlaying?.duration_s ?? 1),
              )}%`,
            }}
          >
            <div className="absolute -top-[1px] right-0 h-1 w-1 rounded-full bg-black" />
          </div>
        </div>
        <div className="flex w-full justify-between text-[6px] text-gray-700">
          <div>
            {formatSeconds(
              Math.min(
                currentlyPlaying?.duration_s ?? 0,
                time - (currentlyPlaying?.started ?? 0),
              ),
            )}
          </div>
          <div>{formatSeconds(currentlyPlaying?.duration_s ?? 0)}</div>
        </div>
      </div>
    </div>
  );
}
