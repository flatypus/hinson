import { ChevronLeftIcon, ChevronRightIcon } from "@primer/octicons-react";
import useFinderStore from "@stores/finder.store";

export default function Header(): JSX.Element {
  const { visitedHistory, fileStructureState, goBack, goForward } =
    useFinderStore();
  return (
    <header className="flex flex-row items-center gap-4 border-b-[1px] border-black bg-[#38393c] px-3 py-1">
      <button
        className="grid place-items-center"
        onClick={goBack}
        type="button"
      >
        <ChevronLeftIcon className="h-4 w-4 text-[#b7b8bb]" />
      </button>
      <button
        className="grid place-items-center"
        onClick={goForward}
        type="button"
      >
        <ChevronRightIcon className="h-4 w-4 text-[#b7b8bb]" />
      </button>
      <h1 className="font-sf text-sm font-semibold text-white">
        {
          visitedHistory[fileStructureState][
            visitedHistory[fileStructureState]?.length - 1
          ]
        }
        &nbsp;
      </h1>
    </header>
  );
}
