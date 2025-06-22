import { useFS, Directory } from "@components/shared/file-structure";
import { useMemo } from "react";
import useFinderStore from "@stores/finder.store";
import useSettingsStore from "@stores/settings.store";

export default function Sidebar() {
  const { themeColor } = useSettingsStore();
  const { visitedHistory, goToDirectory } = useFinderStore();
  const fs = useFS();

  const favorites = useMemo(() => {
    const node = fs.traverse(["~"]);
    if (node?.type === "directory") {
      return (node as Directory).children;
    }
    return null;
  }, [fs]);

  return (
    <div className="h-full bg-[#14101dc5] p-2 text-left">
      <h1 className="mb-1 ml-1 text-xs font-semibold text-[#67697d]">
        Favorites
      </h1>
      <ul>
        <li className="text-xs font-thin text-white">
          {favorites?.map((value) => {
            return (
              <button
                className="flex w-full flex-row items-center rounded-md px-2 py-1"
                key={value.name}
                onClick={() => {
                  goToDirectory(["/", "Users", "hinson", value.name]);
                }}
                style={{
                  backgroundColor:
                    visitedHistory[visitedHistory.length - 1].toString() ===
                    ["~", value.name].toString()
                      ? "#FFFFFF11"
                      : "#FFFFFF00",
                }}
                type="button"
              >
                <div
                  style={{ width: "14px", height: "14px" }}
                  className="mr-2 "
                >
                  <value.icon
                    className="inline-block h-[14px] w-[14px]"
                    fill={themeColor}
                  />
                </div>
                {value.name}
              </button>
            );
          })}
        </li>
      </ul>
    </div>
  );
}
