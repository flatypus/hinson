import { useMemo, useRef, useState } from "react";
import type { FSNode } from "@components/shared/file-structure";
import { Directory, fileStructure } from "@components/shared/file-structure";

type History = string | JSX.Element;

const useHistory = (
  defaultHistory: History[],
): {
  addLine: (line: History) => void;
  history: History[];
  setHistory: (history: History[]) => void;
} => {
  const [history, setHistory] = useState<History[]>(defaultHistory);
  const addLine = (line: History): void => {
    setHistory((h) => [...h, line]);
  };
  return {
    addLine,
    history,
    setHistory,
  };
};

function evaluate(
  command: string,
  data: FSNode | null,
  location: string[],
  setLocation: React.Dispatch<React.SetStateAction<string[]>>,
): string {
  if (!data || !(data instanceof Directory)) {
    return "";
  }

  if (!command) return "";

  const commandParts = command.split(" ");
  const commandName = commandParts[0];

  switch (commandName) {
    case "ls":
      return data.children.map((child) => child.name).join("   ");
    case "pwd":
      return location.join("/");
    case "cd":
      // eslint-disable-next-line no-case-declarations -- this is fine
      const newLocation = commandParts[1];
      if (newLocation === "..") {
        setLocation((l) => l.slice(0, -1));
        return "";
      }
      if (newLocation === "/") {
        setLocation([]);
        return "";
      }
      if (newLocation === ".") {
        return "";
      }
      if (data.children.find((child) => child.name === newLocation)) {
        setLocation((l) => [...l, newLocation]);
        return "";
      }
      return `bash: cd: ${newLocation}: No such file or directory`;

    default:
      return `bash: ${command}: command not found`;
  }
}

function Cli({ addLine }: { addLine: (line: History) => void }): JSX.Element {
  const [location, setLocation] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const data = useMemo(() => fileStructure.traverse(location), [location]);
  const path = useMemo(() => ["~", ...location].join("/"), [location]);

  const onEnter = (): void => {
    const ref = textareaRef.current;
    if (!ref) return;
    const text = ref.value.trim();
    const result = evaluate(text, data, location, setLocation);
    ref.value = "";
    addLine(
      <>
        {path}
        <br />
        <div className="flex flex-row gap-x-2">
          <span>{">"}</span>
          <span>{text}</span>
        </div>
        <div>{result}</div>
        <br />
      </>,
    );
  };

  return (
    <div className="flex h-full flex-col text-white">
      {path}
      <span className="flex h-full flex-row gap-x-2">
        <span>{">"}</span>
        <textarea
          className="h-full w-full border-none bg-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter();
            }
          }}
          ref={textareaRef}
        />
      </span>
    </div>
  );
}

export default function Iterm(): JSX.Element {
  const { history, addLine } = useHistory([
    "bash",
    "flatypus@flatyPro ~ % bash",
    "",
    <>&nbsp;</>,
    "The default interactive shell is now zsh.",
    "To update your account to use zsh, please run `chsh -s /bin/zsh`.",
    "For more details, please visit https://support.apple.com/kb/HT208050.",
  ]);

  return (
    <div className="h-full w-full overflow-scroll bg-slate-950 p-2 text-left font-mono text-xs">
      {history.map((line, index) => {
        return (
          <div className="text-white" key={index}>
            {line}
          </div>
        );
      })}
      <Cli addLine={addLine} />
    </div>
  );
}
