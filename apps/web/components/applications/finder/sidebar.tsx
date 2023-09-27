import { useMemo } from "react";
import { fileStructure, Directory } from "@components/shared/file-structure";
import useFinderStore from "@stores/finder.store";
import useSettingsStore from "@stores/settings.store";

export default function Sidebar(): JSX.Element {
  const { themeColor } = useSettingsStore();
  const { visitedHistory, goToDirectory } = useFinderStore();

  const favorites = useMemo(() => {
    const node = fileStructure.traverse(["hinson"]);
    if (node instanceof Directory) {
      return node.children;
    }
    return null;
  }, []);

  return (
    <div className="h-full bg-[#15024165] p-2 text-left">
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
                  goToDirectory(["hinson", value.name]);
                }}
                style={{
                  backgroundColor:
                    visitedHistory[visitedHistory.length - 1].toString() ===
                    ["hinson", value.name].toString()
                      ? "#FFFFFF11"
                      : "#FFFFFF00",
                }}
                type="button"
              >
                <value.icon
                  className="mr-2 inline-block h-[14px] w-[14px]"
                  fill={themeColor}
                />
                {value.name}
              </button>
            );
          })}
        </li>
      </ul>
    </div>
  );
}
