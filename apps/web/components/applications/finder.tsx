import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import Image from "next/image";
import useSettingsStore from "@app/stores/settings.store";
import { Directory, fileStructure } from "@app/stores/file-structure";

export default function Finder(): JSX.Element {
  const { themeColor } = useSettingsStore();
  const [visitedHistory, setVisitedHistory] = useState<string[][]>([[]]);
  const [fileStructureState, setFileStructureState] = useState<number>(0);

  const favorites = useMemo(() => {
    const node = fileStructure.traverse(["hinson"]);
    if (node instanceof Directory) {
      return node.children;
    }
    return null;
  }, []);

  return (
    <div className="flex h-full w-full flex-row font-sf">
      <div className="h-full bg-[#15024165] p-4 text-left">
        <h1 className="text-sm font-semibold text-[#67697d]">Favorites</h1>
        <ul>
          <li className="text-sm font-thin text-white">
            {favorites?.map((value) => {
              return (
                <button
                  className="flex flex-row items-center"
                  key={value.name}
                  onClick={() => {
                    setVisitedHistory([
                      ...visitedHistory,
                      ["hinson", value.name],
                    ]);
                    setFileStructureState(visitedHistory.length);
                  }}
                  type="button"
                >
                  <value.icon
                    className="mr-1 inline-block h-[14px] w-[14px]"
                    fill={themeColor}
                  />
                  {value.name}
                </button>
              );
            })}
          </li>
        </ul>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex flex-row items-center gap-4 border-b-[1px] border-black bg-[#38393c] px-3 py-1">
          <button
            className="grid place-items-center"
            onClick={() => {
              if (fileStructureState === 0) return;
              setFileStructureState(fileStructureState - 1);
            }}
            type="button"
          >
            <ChevronLeftIcon className="h-4 w-4 text-[#b7b8bb]" />
          </button>
          <button
            className="grid place-items-center"
            onClick={() => {
              if (fileStructureState >= visitedHistory.length - 1) return;
              setFileStructureState(fileStructureState + 1);
            }}
            type="button"
          >
            <ChevronRightIcon className="h-4 w-4 text-[#b7b8bb]" />
          </button>
          <h1 className="font-sf text-sm font-semibold text-white">
            {
              visitedHistory[fileStructureState][
                visitedHistory[fileStructureState].length - 1
              ]
            }
            &nbsp;
          </h1>
        </header>
        <div className="flex-1 border-b-[1px] border-[#444548] bg-[#232529]" />
        <div className="bg-[#222326]">
          <ul className="flex flex-row items-center gap-1 px-2 py-1 text-[#9b9c9d]">
            {visitedHistory[fileStructureState].map((file) => {
              return (
                <>
                  <Image
                    alt="folder"
                    className="text-[#b7b8bb]"
                    height={16}
                    src="/icons/folder.png"
                    width={16}
                  />
                  <h1 className="text-sm text-[#9c9c9e]">{file}</h1>
                  {visitedHistory[fileStructureState][
                    visitedHistory[fileStructureState].length - 1
                  ] !== file && <ChevronRightIcon className="h-3 w-3" />}
                </>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
