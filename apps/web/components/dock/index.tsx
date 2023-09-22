import Image from "next/image";
import apps from "./apps.json";

// type Apps = typeof apps;

const ICON_SIZE = 48;

export default function Dock(): JSX.Element {
  return (
    <div className="bg-apple-blur backdrop-blur-apple-blur fixed bottom-2 left-1/2 flex -translate-x-1/2 transform flex-row rounded-lg border-[0.25px] border-[#00000047]">
      {apps.map((app) => (
        <button key={app.name} type="button">
          <Image
            alt={app.name}
            height={ICON_SIZE}
            src={`/icons/${app.icon}`}
            width={ICON_SIZE}
          />
        </button>
      ))}
    </div>
  );
}
