import { useMemo } from "react";
import useFinderStore from "@stores/finder.store";
import type { Icon } from "@stores/file-structure";
import { Directory, File, fileStructure } from "@stores/file-structure";
import useWindowsStore from "@stores/windows.store";
import { FileDirectoryIcon } from "@components/image_icons";

export default function Files(): JSX.Element {
  const { addWindow } = useWindowsStore();
  const { visitedHistory, goToDirectory, fileStructureState } =
    useFinderStore();

  const files = useMemo(() => {
    const node = fileStructure.traverse(visitedHistory[fileStructureState]);
    if (node instanceof Directory) {
      return node.children;
    }
    return null;
  }, [fileStructureState, visitedHistory]);

  const handleOpenFile = ({
    name,
    icon,
    component,
  }: {
    name: string;
    icon: Icon | string;
    component: JSX.Element | (() => JSX.Element);
  }): void => {
    addWindow({
      name,
      icon,
      component,
    });
  };

  return (
    <div className="flex-1 border-b-[1px] border-[#444548] bg-[#232529]">
      {/* wrap around when overflow */}
      <ul className="flex flex-wrap gap-4 p-4">
        {files?.map((value) => {
          return (
            <button
              className="flex flex-col items-center justify-center"
              key={value.name}
              onClick={() => {
                if (value instanceof Directory) {
                  goToDirectory([
                    ...visitedHistory[fileStructureState],
                    value.name,
                  ]);
                } else if (value instanceof File) {
                  if (!value.content) return;
                  handleOpenFile({
                    name: value.name,
                    icon: value.icon,
                    component: value.content,
                  });
                }
              }}
              type="button"
            >
              {value instanceof Directory ? (
                <FileDirectoryIcon />
              ) : (
                <value.icon />
              )}
              <p className="text-xs text-[#9b9c9d]">{value.name}</p>
            </button>
          );
        })}
      </ul>
    </div>
  );
}
