import { Directory, File, useFS } from "@components/shared/file-structure";
import { FileDirectoryIcon } from "@components/image_icons";
import { useMemo, useState } from "react";
import type { FSNode, Icon } from "@components/shared/file-structure";
import useFinderStore from "@stores/finder.store";
import useWindowsStore from "@stores/windows.store";

export default function Files() {
  const [view, setView] = useState<"list" | "grid">("grid");
  const { addWindow } = useWindowsStore();
  const { visitedHistory, goToDirectory, fileStructureState } =
    useFinderStore();

  const fs = useFS();

  const files = useMemo(() => {
    const node = fs.traverse(visitedHistory[fileStructureState]);
    if (node?.type === "directory") {
      setView((node as Directory).view ?? "grid");
      return (node as Directory).children;
    }
    return null;
  }, [fileStructureState, visitedHistory, fs]);

  const handleOpenFile = ({
    name,
    icon,
    component,
  }: {
    name: string;
    icon: Icon | string;
    component: React.ReactNode;
  }): void => {
    addWindow({
      name,
      icon,
      component,
    });
  };

  const open = (value: FSNode) => {
    if (value.type === "directory") {
      goToDirectory([...visitedHistory[fileStructureState], value.name]);
    } else if (value.type === "file") {
      const { content } = value as File;
      if (!content) return;
      handleOpenFile({
        name: value.name,
        icon: value.icon,
        component: content,
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-scroll border-b-[1px] border-[#444548] bg-[#232529]">
      {view === "grid" ? (
        // wrap around when overflow
        <ul className="flex flex-wrap gap-4 p-4">
          {files?.map((value) => {
            return (
              <button
                className="flex w-[75px] flex-col items-center justify-center"
                key={value.name}
                onClick={() => open(value)}
                type="button"
              >
                {value.type === "directory" ? (
                  <FileDirectoryIcon />
                ) : (
                  <value.icon size={48} />
                )}
                <p className="w-full truncate whitespace-nowrap text-xs text-[#9b9c9d]">
                  {value?.alias ?? value.name}
                </p>
              </button>
            );
          })}
        </ul>
      ) : (
        <ul className="flex flex-col">
          {files?.map((value) => {
            return (
              <li
                key={value.name}
                className="px-4 text-xs odd:bg-[#ffffff11] lg:px-8 lg:py-1 lg:text-base"
              >
                <button
                  onClick={() => open(value)}
                  type="button"
                  className="flex items-center gap-2"
                >
                  {value.type === "directory" ? (
                    <FileDirectoryIcon size={36} />
                  ) : (
                    <value.icon size={36} />
                  )}
                  <p className="truncate whitespace-nowrap text-[#9b9c9d]">
                    {value?.alias ?? value.name}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
