import Image from "next/image";
import type { Tab } from "@lib/types";
import Welcome from "../welcome/welcome";

const API_KEY = "AIzaSyBFCu6VTIRYxRkmpyxW_vq9bf9FeR9GpIU";

const GMAP_LOCATIONS = [
  `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=43.4609019,-123.3621908&zoom=9&maptype=satellite`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=51.3234367,-116.1822205&heading=220&pitch=10&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=34.9670327,135.785515&heading=0&pitch=10&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=35.1690891,136.8805778&heading=200&pitch=10&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=35.7042862,139.7952404&heading=70&pitch=0&fov=100`,
];

const GMAPS_MEANINGS = [
  "Land Checkerboarding in the Pacific Northwest",
  "Moraine Lake, Canada - A trip with my parents",
  "Fushimi Inari Shrine, Japan",
  "The One Day We Took The 新幹線 From Tokyo-Nagoya For A 7/11 Run",
  "View of Skytree from Asakusa - Japan 2023",
];

export default function Pinned({
  setSelectedTab,
  setTabs,
  tabs,
}: {
  setSelectedTab: (index: number) => void;
  setTabs: (tabs: Tab[]) => void;
  tabs: Tab[];
}): JSX.Element {
  const pinned = [
    {
      icon: "flatypus",
    },
    {
      icon: "gmail",
      url: "https://mail.google.com",
    },
    {
      icon: "gcal",
      url: "https://calendar.google.com",
    },
    {
      icon: "crd",
      url: "https://remotedesktop.google.com",
    },
    {
      icon: "github",
      url: "https://github.com/flatypus",
    },
    {
      icon: "music",
      url: "https://music.youtube.com",
    },
    {
      icon: "maps",
      size: 10,
    },

    {
      icon: "youtube",
      url: "https://youtube.com/flatypus",
    },
    {
      icon: "deepl",
      url: "https://deepl.com",
      size: 12,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {pinned.map(({ icon, url, size }) => {
        const Icon = (
          <Image
            alt={icon}
            className={icon === "flatypus" ? "rounded-full" : ""}
            height={size ?? 16}
            src={`/icons/${icon}.png`}
            width={size ?? 16}
          />
        );

        const className = `grid h-full w-full place-items-center rounded-lg bg-black bg-opacity-5 p-2 hover:bg-opacity-10`;

        if (icon === "maps" || icon === "flatypus") {
          let tab: Tab;
          if (icon === "flatypus") {
            tab = {
              name: "Hinson's Personal Site",
              element: Welcome,
              url: "https://flatypus.me",
              icon: "/images/flatypus.png",
            };
          } else {
            const random = Math.floor(Math.random() * GMAP_LOCATIONS.length);
            tab = {
              name: GMAPS_MEANINGS[random],
              url: GMAP_LOCATIONS[random],
              icon: "/icons/maps.png",
            };
          }

          return (
            <button
              className={className}
              key={url}
              onClick={() => {
                setTabs([...tabs, tab]);
                setSelectedTab(tabs.length);
              }}
              type="button"
            >
              {Icon}
            </button>
          );
        }

        return (
          <a
            className={className}
            href={url}
            key={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {Icon}
          </a>
        );
      })}
    </div>
  );
}
