import "tippy.js/animations/scale.css";
import Image from "next/image";
import Tip from "@components/tip";
import type { Tab } from "@lib/types";
import Welcome from "../welcome/welcome";

const API_KEY = "AIzaSyBFCu6VTIRYxRkmpyxW_vq9bf9FeR9GpIU";

const GMAP_LOCATIONS = [
  `https://www.google.com/maps/embed/v1/view?key=${API_KEY}&center=43.4609019,-123.3621908&zoom=9&maptype=satellite`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=51.3234367,-116.1822205&heading=220&pitch=10&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=34.9670327,135.785515&heading=0&pitch=10&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=35.1690891,136.8805778&heading=200&pitch=10&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=35.7042862,139.7952404&heading=70&pitch=0&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=49.2793936,-123.1167462&heading=75&pitch=20&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=51.4788251,-112.7902766&heading=0&pitch=-20&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=-6.1719404,106.912235&heading=65&pitch=14&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=25.048856,121.7873947&heading=334.54&pitch=10&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=25.0430079,121.7768444&heading=44.09&pitch=10&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=34.6887875,135.5248521&heading=150&pitch=0&fov=100`,
  `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=-6.7266351,106.9555225&heading=20.82&pitch=10&fov=100`,
];

const GMAPS_MEANINGS = [
  "Land Checkerboarding in the Pacific Northwest",
  "Moraine Lake, Canada - A trip with my parents",
  "Fushimi Inari Shrine, Japan",
  "The One Day We Took The 新幹線 From Tokyo-Nagoya For A 7/11 Run",
  "View of Skytree from Asakusa - Japan 2023",
  "Vancouver Public Library, Central Branch - host to countless study sessions",
  "The Royal Tyrell Museum, Drumheller, Alberta",
  "Tangan Pengharapan, the Indonesian Charity we partnered with last summer",
  "Shifen Waterfall, Taiwan - A trip with my parents",
  "Shifen Old Street, Taiwan - A trip with my parents",
  "Exploring the beautiful Osaka Castle - Japan 2023",
  "Taman Safari, Bogor, Indonesia - A beautiful day off from work last summer",
];

const pinned = [
  {
    icon: "flatypus",
    tip: "Hinson's Personal Site",
  },
  {
    icon: "gmail",
    url: "https://mail.google.com",
    tip: "Gmail",
  },
  {
    icon: "gcal",
    url: "https://calendar.google.com",
    tip: "Google Calendar",
  },
  {
    icon: "crd",
    url: "https://remotedesktop.google.com",
    tip: "Chrome Remote Desktop",
  },
  {
    icon: "github",
    url: "https://github.com/flatypus",
    tip: "Github",
  },
  {
    icon: "music",
    url: "https://music.youtube.com/playlist?list=PLlIRkM5RM1uowMk4yjLfARG0mT5kzuYhp&si=k1NaXK-PkLuKvO8F",
    tip: "My Music Playlist",
  },
  {
    icon: "maps",
    size: 10,
    tip: "Memorable Locations",
  },

  {
    icon: "youtube",
    url: "https://youtube.com/flatypus",
    tip: "Youtube",
  },
  {
    icon: "deepl",
    url: "https://www.deepl.com/en/translator#ja/en/Hi!%0A%0A%E3%82%AB%E3%83%8A%E3%83%80%E3%81%A7%E3%81%AF%E3%83%95%E3%83%A9%E3%83%B3%E3%82%B9%E8%AA%9E%E3%81%A8%E8%8B%B1%E8%AA%9E%E3%82%92%E5%AD%A6%E3%82%93%E3%81%A0%E3%81%8C%E3%80%81%E3%81%AA%E3%81%9C%E3%81%9D%E3%82%8C%E3%81%8C%E5%BF%85%E8%A6%81%E3%81%AA%E3%81%AE%E3%81%8B%E7%90%86%E8%A7%A3%E3%81%A7%E3%81%8D%E3%81%AA%E3%81%8B%E3%81%A3%E3%81%9F%E3%80%82%E3%81%A7%E3%82%82%E3%80%81%E5%8E%BB%E5%B9%B4%E3%81%AE%E5%A4%8F%E3%80%81%E3%82%A4%E3%83%B3%E3%83%89%E3%83%8D%E3%82%B7%E3%82%A2%E3%81%AB%E8%A1%8C%E3%81%A3%E3%81%9F%E6%99%82%E3%80%81%E3%81%82%E3%82%8B%E3%81%93%E3%81%A8%E3%81%AB%E6%B0%97%E3%81%A5%E3%81%84%E3%81%9F%E3%80%82%0A%0AIl%20y%20a%20une%20certaine%20connexion%20que%20l'on%20%C3%A9tablit%20avec%20quelqu'un%20quand%20on%20peux%20parle%20sa%20langue.%20Assis%20%C3%A0%20l'a%C3%A9roport%20avec%20Agus%2C%20notre%20chauffeur%2C%20Google%20traduisant%20dans%20les%20deux%20sens%2C%20j'en%20ai%20appris%20plus%20sur%20lui%20que%20sur%20tout%20le%20voyage.%0A%0AWhen%20I%20came%20back%2C%20I%20started%20to%20notice%20it%20more%20and%20more%2C%20speaking%20some%20subtle%20Cantonese%20to%20random%20bakery%20owners%20along%20Victoria%20Street.%20I%20grew%20up%20learning%20Cantonese%20and%20never%20appreciated%20it%20much%2C%20but%20now%20I%20do.%0A%0A%E6%88%91%E8%AE%A4%E4%B8%BA%EF%BC%8C%E5%A6%82%E6%9E%9C%E4%BD%A0%E8%83%BD%E8%AF%B4%E9%82%A3%E4%B8%AA%E4%BA%BA%E7%9A%84%E8%AF%AD%E8%A8%80%EF%BC%8C%E9%82%A3%E7%9C%9F%E7%9A%84%E5%BE%88%E6%9C%89%E5%8A%9B%E9%87%8F%EF%BC%8C%E4%B9%9F%E5%BE%88%E6%9C%89%E4%BA%BA%E6%83%85%E5%91%B3%EF%BC%9B%E4%BB%A5%E5%90%8E%EF%BC%8C%E6%88%91%E4%B8%80%E5%AE%9A%E4%BC%9A%E5%8A%AA%E5%8A%9B%E5%AD%A6%E4%B9%A0%E6%B3%95%E8%AF%AD%E3%80%81%E6%97%A5%E8%AF%AD%E3%80%81%E6%99%AE%E9%80%9A%E8%AF%9D%E5%92%8C%E8%BF%9B%E6%AD%A5%E6%88%91%E7%9A%84%E5%B9%BF%E4%B8%9C%E8%AF%9D.%0A",
    size: 12,
    tip: "DeepL",
  },
];

interface WrappedIconProps {
  icon: string;
  tip: string;
  url?: string;
  size?: number;
  setSelectedTab: (index: number) => void;
  setTabs: (tabs: Tab[]) => void;
  tabs: Tab[];
}

function WrappedIcon({
  icon,
  tip,
  url,
  size,
  setSelectedTab,
  setTabs,
  tabs,
}: WrappedIconProps): JSX.Element {
  const key = (new Date().getTime() + Math.random() + icon).toString();
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

  let tab: Tab;

  switch (icon) {
    case "maps":
    case "flatypus":
      if (icon === "flatypus") {
        tab = {
          name: "Hinson's Personal Site",
          element: Welcome,
          url: "https://flatypus.me",
          icon: "/images/flatypus.png",
          key,
        };
      } else {
        const random = Math.floor(Math.random() * GMAP_LOCATIONS.length);
        tab = {
          name: GMAPS_MEANINGS[random],
          url: GMAP_LOCATIONS[random],
          icon: "/icons/maps.png",
          key,
        };
      }

      return (
        <Tip key={url} name={tip}>
          <button
            className={className}
            onClick={() => {
              setTabs([...tabs, tab]);
              setSelectedTab(tabs.length);
            }}
            type="button"
          >
            {Icon}
          </button>
        </Tip>
      );
    default:
      return (
        <Tip key={url} name={tip}>
          <a
            className={className}
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {Icon}
          </a>
        </Tip>
      );
  }
}

export default function Pinned({
  setSelectedTab,
  setTabs,
  tabs,
}: {
  setSelectedTab: (index: number) => void;
  setTabs: (tabs: Tab[]) => void;
  tabs: Tab[];
}): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2">
      {pinned.map(({ icon, url, size, tip }) => (
        <WrappedIcon
          icon={icon}
          key={icon}
          setSelectedTab={setSelectedTab}
          setTabs={setTabs}
          size={size}
          tabs={tabs}
          tip={tip}
          url={url}
        />
      ))}
    </div>
  );
}
