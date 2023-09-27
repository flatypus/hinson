import { useMemo } from "react";
import useFinderStore from "@stores/finder.store";
import { Directory, fileStructure } from "@stores/file-structure";
import { FileDirectoryIcon, IconFromPath } from "@components/image_icons";

export default function Files(): JSX.Element {
  const { visitedHistory, goToDirectory, fileStructureState } =
    useFinderStore();

  const files = useMemo(() => {
    const node = fileStructure.traverse(visitedHistory[fileStructureState]);
    if (node instanceof Directory) {
      return node.children;
    }
    return null;
  }, [fileStructureState, visitedHistory]);

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
                }
              }}
              type="button"
            >
              {typeof value.icon === "string" && (
                <IconFromPath alt={value.name} path={value.icon} />
              )}
              {value instanceof Directory ? (
                <FileDirectoryIcon />
              ) : (
                typeof value.icon === "function" && <value.icon />
              )}
              <p className="text-xs text-[#9b9c9d]">{value.name}</p>
            </button>
          );
        })}
      </ul>
    </div>
  );
}
