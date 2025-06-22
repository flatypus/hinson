import { Directory, useFS, File } from "@components/shared/file-structure";
import { useEffect, useRef } from "react";
import { useSessionStorage } from "usehooks-ts";
import useItermStore, { TerminalLine } from "@stores/iterm.store";
import useWindowsStore from "@stores/windows.store";

const error_text = (path: string) => `bash: ${path}: No such file or directory`;

const evaluatePath = (data: Directory, path: string, pre: boolean) => {
  let splitPath = path.split("/").filter(Boolean);
  splitPath = pre ? splitPath.slice(0, -1) : splitPath;
  const evaluate = data.evaluate_path(splitPath);
  if (!evaluate?.folder) {
    return { error: true };
  }
  return { folder: evaluate.folder, path: evaluate.path };
};

const cd = (data: Directory, newLocation: string) => {
  const { error, path } = evaluatePath(data, newLocation, false);
  if (error || !path) return error_text("cd");
  const fpath = path
    .join("/")
    .replace("Users/hinson", "~")
    .split("/")
    .filter(Boolean);
  useItermStore.setState({ location: fpath });
  return "";
};

const touch = (data: Directory, newFile: string) => {
  const { error, folder } = evaluatePath(data, newFile, true);
  if (error || !folder) return error_text("touch");
  const file = newFile.split("/").filter(Boolean).pop();
  if (!file) return error_text("touch");
  if (folder.children.find((child) => child.name === file)) return "";
  folder.children.push(new File({ name: file, parent: folder }));
  return "";
};

const mkdir = (data: Directory, newFolder: string) => {
  const { error, folder } = evaluatePath(data, newFolder, true);
  if (error || !folder) return error_text("mkdir");
  const newFolderName = newFolder.split("/").filter(Boolean).pop();
  if (!newFolderName) return error_text("mkdir");
  if (folder.children.find((child) => child.name === newFolderName)) {
    return `mkdir: ${newFolderName}: File exists`;
  }
  folder.children.push(new Directory({ name: newFolderName, parent: folder }));
  return "";
};

const neofetch = () => {
  const { width, height } = useWindowsStore.getState().getWindowSize();
  const neofetch_start_date = new Date(2006, 11, 27);
  const neofetch_current_date = new Date();
  const neofetch_uptime_minutes = Math.floor(
    (neofetch_current_date.getTime() - neofetch_start_date.getTime()) / 60000,
  );
  const years = Math.floor(neofetch_uptime_minutes / 525600);
  const days = (neofetch_uptime_minutes % 525600) / 1440;
  const hours = (neofetch_uptime_minutes % 1440) / 60;
  const minutes = neofetch_uptime_minutes % 60;
  return [
    "                     'c.          flatypus@flatyPro",
    "                  ,xNMM.          -----------------------",
    "                .OMMMMo           OS: macOS 14.2.1 23C71 arm64",
    "                OMMM0,            Host: Mac14,9",
    "      .;loddo:' loolloddol;.      Kernel: 23.2.0",
    `    cKMMMMMMMMMMNWMMMMMMMMMM0:    Uptime: ${years} years ${days.toFixed()} days ${hours.toFixed()} hours ${minutes.toFixed()} minutes`,
    "  .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Packages: 235 (brew)",
    "  XMMMMMMMMMMMMMMMMMMMMMMMX.      Shell: zsh 5.9",
    ` ;MMMMMMMMMMMMMMMMMMMMMMMM:       Resolution: ${width}x${height}`,
    ":MMMMMMMMMMMMMMMMMMMMMMMM:        DE: Aqua",
    ".MMMMMMMMMMMMMMMMMMMMMMMMX.       WM: Quartz Compositor",
    " kMMMMMMMMMMMMMMMMMMMMMMMMWd.     WM Theme: Pink (Dark)",
    " .XMMMMMMMMMMMMMMMMMMMMMMMMMMk    Terminal: iTerm2",
    "  .XMMMMMMMMMMMMMMMMMMMMMMMMK.    Terminal Font: MesloLGMNFM-Regular 12",
    "    kMMMMMMMMMMMMMMMMMMMMMMd      CPU: Apple M2 Pro",
    "     ;KMMMMMMMWXXWMMMMMMMk.       GPU: Apple M2 Pro",
    "       .cooc,.    .,coo:.         Memory: 3006MiB / 16384MiB",
    "",
    "Type `help` for a list of commands.",
  ];
};

const history = () => {
  const { commandHistory } = useItermStore.getState();
  const list = [];
  for (let i = 1; i <= commandHistory.length; i++) {
    if (i >= 1000) break;
    const spaces = 4 - Math.floor(Math.log10(i));
    list.push(`${" ".repeat(spaces)}${i}  ${commandHistory[i - 1]}`);
  }
  return list;
};

const help = () => {
  return [
    "GNU bash, version 3.2.57(1)-release (arm64-apple-darwin23)",
    "These shell commands are defined internally.  Type `help' to see this list.",
    "",
    "A star (*) next to a name means that the command is disabled.",
    "",
    " cd                                 Change the working directory",
    " clear                              Clear the terminal screen",
    " date                               Show the current date and time",
    " help                               Show this help message",
    " history                            Show command history",
    " ls                                 List directory contents",
    " neofetch                           Show system information",
    " pwd                                Print current/working directory",
    "",
    "You can use the arrow keys to navigate command history, ctrl/shift + scroll to change font size, and tab to autocomplete.",
  ];
};

function evaluate(command: string, data: Directory): string | string[] | null {
  const { location } = useItermStore.getState();
  if (!command) return "";

  const [name, ...parts] = command.split(" ");
  const params = parts.join(" ");

  switch (name) {
    case "ls":
      return data.children.map((child) => child.name).join("   ");
    case "pwd":
      return location.join("/");
    case "cd":
      return cd(data, params);
    case "date":
      return new Date().toString();
    case "mkdir":
      return mkdir(data, params);
    case "neofetch":
      return neofetch();
    case "clear":
      return null;
    case "history":
      return history();
    case "help":
      return help();
    case "touch":
      return touch(data, params);
    default:
      return `bash: ${command}: command not found`;
  }
}

function Cli({
  scrollReference,
  inputReference,
}: {
  scrollReference: React.RefObject<HTMLDivElement | null>;
  inputReference: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const {
    addCommand,
    clearHistory,
    addLine,
    location,
    tabFilterType,
    getPreface,
  } = useItermStore();
  const folder = useFS(location);
  const [helped, setHelped] = useSessionStorage("seen-history-help", false);

  useEffect(() => {
    const value = inputReference.current?.value || "";
    inputReference.current?.focus();
    inputReference.current?.setSelectionRange(value.length, value.length);
    setHelped(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helped]);

  if (!folder || !(folder.type === "directory")) return <></>;

  const scroll = () =>
    setTimeout(() => {
      if (!scrollReference.current) return;
      scrollReference.current.scrollTop = scrollReference.current.scrollHeight;
    }, 10);

  const onEnter = (): void => {
    const inputRef = inputReference.current;
    if (!inputRef) return;
    const text = inputRef.value.trim();

    if (text) addCommand(text);

    const { location: oldLocation } = useItermStore.getState();
    const result = evaluate(text, folder);
    inputRef.value = "";

    if (result == null) {
      clearHistory();
      return;
    }

    addLine(text, result, oldLocation);
    scroll();
  };

  const onTab = () => {
    const inputRef = inputReference.current;
    if (!inputRef) return;

    const split = inputRef.value.split(" ");
    const commands = split.slice(0, -1);

    const tentativePath = (split.at(-1)?.trim() ?? "").split("/");
    const existingPath = tentativePath.slice(0, -1);
    const inProgressPath = tentativePath.at(-1) ?? "";

    const evaluate = folder.evaluate_path(existingPath);
    if (!evaluate) return;

    const { folder: cursorFolder } = evaluate;
    if (!cursorFolder) return;
    const items = cursorFolder.children
      .filter(
        (child) =>
          (tabFilterType === "folder") === (child.type === "directory"),
      )
      .map((child) => child.name)
      .filter((name) => name.startsWith(inProgressPath))
      .map((child) => `${child}${tabFilterType === "folder" ? "/" : ""}`);

    if (inProgressPath === ".") items.concat(["./", "../"]);
    if (inProgressPath === "..") items.push("../");

    if (items.length === 0) return;
    if (items.length === 1) {
      const newPath = [...existingPath, items[0]].join("/");
      inputRef.value = [...commands, newPath].join(" ");
    } else {
      addLine("", items.join("   "));
    }
    scroll();
  };

  const onArrowUp = () => {
    useItermStore.setState(({ historyCursor, commandHistory }) => {
      if (historyCursor > 0 && historyCursor === commandHistory.length - 1) {
        return {};
      }
      const current = inputReference.current;
      if (!current) return {};
      const testText =
        commandHistory[commandHistory.length - historyCursor - 1];

      if (!inputReference.current) return {};
      if (historyCursor === 0 && current?.value !== testText) {
        inputReference.current.value = testText;
        return {};
      }
      inputReference.current.value =
        commandHistory[commandHistory.length - historyCursor - 2];
      return { historyCursor: historyCursor + 1 };
    });
  };

  const onArrowDown = () => {
    useItermStore.setState(({ historyCursor, commandHistory }) => {
      if (historyCursor === 0) return {};
      if (!inputReference.current) return {};
      inputReference.current.value =
        commandHistory[commandHistory.length - historyCursor];
      return { historyCursor: historyCursor - 1 };
    });
  };

  return (
    <div className="flex flex-col text-white">
      <span className="flex h-full flex-row gap-x-2">
        <span>{getPreface()}</span>
        <textarea
          ref={inputReference}
          className="h-full w-full border-none bg-transparent outline-none"
          defaultValue={helped ? "" : "help"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter();
            } else if (e.key === "Tab") {
              e.preventDefault();
              onTab();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              onArrowDown();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              onArrowUp();
            } else {
              useItermStore.setState({ historyCursor: 0 });
            }
          }}
        />
      </span>
    </div>
  );
}

export default function Iterm() {
  const scrollReference = useRef<HTMLDivElement | null>(null);
  const inputReference = useRef<HTMLTextAreaElement | null>(null);
  const { history, fontSize } = useItermStore();

  useEffect(() => {
    useItermStore.setState({
      history: [
        "bash",
        "flatypus@flatyPro ~ % bash",
        "",
        "The default interactive shell is now zsh.",
        "To update your account to use zsh, please run `chsh -s /bin/zsh`.",
        "For more details, please visit https://support.apple.com/kb/HT208050.",
        "",
        "flatypus@flatyPro ~ % neofetch",
        "",
        ...neofetch(),
        "",
      ],
    });
  }, []);

  return (
    <div
      ref={scrollReference}
      className="h-full w-full overflow-scroll bg-slate-950 p-2 text-left font-mono"
      style={{ fontSize }}
      onClick={() => inputReference.current?.focus()}
      onWheel={(e) => {
        e.preventDefault();
        if (!e.ctrlKey && !e.shiftKey) return;
        useItermStore.setState(({ fontSize }) => ({
          fontSize: Math.max(4, fontSize + (e.deltaY > 0 ? -1 : 1)),
        }));
      }}
    >
      {history.map((line, index) => {
        return (
          <div className="text-white" key={index}>
            {typeof line === "string" ? (
              <TerminalLine text={line} />
            ) : (
              <div>{line}</div>
            )}
          </div>
        );
      })}
      <Cli scrollReference={scrollReference} inputReference={inputReference} />
    </div>
  );
}
