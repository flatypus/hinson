import { useEffect, useState } from "react";
import { config } from "dotenv";
import Image from "next/image";

config();
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
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const h = hours > 0 ? `${hours}:` : "";
  const m = minutes > 0 ? `${minutes}:` : "0:";
  const s = secs < 10 ? `0${secs}` : secs;
  return `${h}${m}${s}`;
}

export default function Playing() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Play | null>(null);
  const [time, setTime] = useState<number>(Date.now() / 1000);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now() / 1000), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${PATH}/live`);
    eventSource.onmessage = (event) => {
      const data: Play = JSON.parse(event.data);
      if (!data || data.started + data.duration_s < time) {
        setCurrentlyPlaying(null);
        return;
      }
      setCurrentlyPlaying(data);
    };
    return () => eventSource.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentlyPlaying) {
    return (
      <div className="flex h-[32px] w-full flex-row place-items-center items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg bg-white/80 p-2 text-[12px] shadow-lg">
        <Image alt="Music" height={16} src="/icons/music.png" width={16} />
        <p className="max-w-[90%] truncate text-black text-opacity-40">
          Hinson isn&apos;t listening to anything right now.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[80px] w-full flex-row items-center overflow-hidden rounded-lg bg-white/80 p-2 text-[8px] shadow-lg">
      <Image
        alt={currentlyPlaying.title}
        className="mr-2 h-full rounded-md"
        height={64}
        src={currentlyPlaying.thumbnail}
        width={64}
      />
      <div className="flex h-full w-full flex-col place-items-center justify-center">
        <a
          className="line-clamp-2 max-w-[90%] font-semibold text-black hover:underline"
          href={currentlyPlaying.url}
          rel="noreferrer"
          target="_blank"
        >
          <span className="whitespace-nowrap font-normal text-black">
            Hinson is now listening to:&nbsp;
          </span>
          {currentlyPlaying.artist} - {currentlyPlaying.title}
        </a>
        <div className="mt-1 h-[2px] w-full rounded-lg bg-gray-400">
          <div
            className="relative h-full rounded-lg bg-gray-800"
            style={{
              width: `${Math.min(
                100,
                (100 * (time - currentlyPlaying.started)) /
                  currentlyPlaying.duration_s,
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
                currentlyPlaying.duration_s,
                time - currentlyPlaying.started,
              ),
            )}
          </div>
          <div>{formatSeconds(currentlyPlaying.duration_s)}</div>
        </div>
      </div>
    </div>
  );
}
