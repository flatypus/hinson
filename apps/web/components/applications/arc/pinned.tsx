import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { WindowContext } from "@stores/window.context";

export default function Pinned(): JSX.Element {
  const { subscribe } = useContext(WindowContext);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const { width: lastWidth } = subscribe({
      breakpoint: { width: 1200 },
      callback: (window) => {
        setWidth(window.width);
      },
    });
    setWidth(lastWidth);
  }, [subscribe]);

  const pinned = [
    {
      icon: "notion.png",
      url: "https://notion.so",
    },
    {
      icon: "gmail.png",
      url: "https://mail.google.com",
    },
    {
      icon: "gcal.png",
      url: "https://calendar.google.com",
    },
    {
      icon: "crd.png",
      url: "https://remotedesktop.google.com",
    },
    {
      icon: "github.png",
      url: "https://github.com/flatypus",
    },
    {
      icon: "music.png",
      url: "https://music.youtube.com",
    },
    {
      icon: "maps.png",
      url: "https://maps.google.com",
      size: 10,
    },

    {
      icon: "youtube.png",
      url: "https://youtube.com/flatypus",
    },
    {
      icon: "deepl.png",
      url: "https://deepl.com",
      size: 12,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {pinned.map(({ icon, url, size }) => (
        <a
          className="grid h-full w-full place-items-center rounded-lg bg-black bg-opacity-5 p-2 hover:bg-opacity-10"
          href={url}
          key={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt={url}
            height={(size ?? 16) * (width < 800 ? 1 : 1.25)}
            src={`/icons/${icon}`}
            width={(size ?? 16) * (width < 800 ? 1 : 1.25)}
          />
        </a>
      ))}
    </div>
  );
}
