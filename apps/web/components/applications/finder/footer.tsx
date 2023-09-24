import { ChevronRightIcon } from "@primer/octicons-react";
import Image from "next/image";
import useFinderStore from "@stores/finder.store";

export default function Footer(): JSX.Element {
  const { visitedHistory, fileStructureState, goToDirectory } =
    useFinderStore();
  return (
    <div className="bg-[#222326]">
      <ul className="flex flex-row items-center gap-1 px-2 py-1 text-[#9b9c9d]">
        {visitedHistory[fileStructureState].map((file, index) => {
          return (
            <button
              className="flex flex-row items-center gap-1"
              key={file}
              onClick={() => {
                goToDirectory(
                  visitedHistory[fileStructureState].slice(0, index + 1),
                );
              }}
              type="button"
            >
              <Image
                alt="folder"
                className="text-[#b7b8bb]"
                height={12}
                src="/icons/folder.png"
                width={12}
              />
              <h1 className="text-xs text-[#9c9c9e]">{file}</h1>
              {visitedHistory[fileStructureState][
                visitedHistory[fileStructureState].length - 1
              ] !== file && <ChevronRightIcon className="h-3 w-3" />}
            </button>
          );
        })}
      </ul>
    </div>
  );
}
