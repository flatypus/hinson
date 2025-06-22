import { AppsIcon, FileDirectoryIcon, HomeIcon } from "@primer/octicons-react";
import { createStore } from "state-pool";
import { fileSystemData } from "./root-content";
import { IconFromPath, MarkdownIcon } from "@components/image_icons/";
import { useEffect, useRef, useState, type FunctionComponent } from "react";
import Arc from "@components/applications/arc/arc";
import MarkdownPage from "@components/applications/markdown-page/markdown-page";
import type { IconProps } from "@primer/octicons-react";
import Welcome from "@components/applications/welcome/welcome";

export type Icon = FunctionComponent<IconProps>;

export type FileSystemStructure = {
  name: string;
  alias?: string;
  view?: "list" | "grid";
  icon?: Icon | string;
  type: "directory" | "file";
  content?: React.ReactNode; // Only for files
  children?: FileSystemStructure[]; // Only for directories
};

export abstract class FSNode {
  name: string;
  alias?: string;
  icon: Icon;
  parent: Directory | null;
  abstract type: "file" | "directory";
  constructor({
    name,
    alias,
    icon,
    parent,
  }: {
    name: string;
    alias?: string;
    icon: Icon | string;
    parent: Directory | null;
  }) {
    this.name = name;
    this.alias = alias;
    this.icon =
      typeof icon === "string"
        ? ({ size }: { size?: string | number }) =>
            IconFromPath({ path: icon, alt: name, size: size })
        : icon;
    this.parent = parent;
  }

  get_path = (): string[] => {
    if (!this.parent) return [this.name];
    return [...this.parent.get_path(), this.name];
  };

  find_root = (): Directory => {
    return this.parent
      ? this.parent.find_root()
      : (this as unknown as Directory);
  };
}

export class Directory extends FSNode {
  children: FSNode[];
  type: "directory";
  view: "list" | "grid";
  constructor({
    name,
    alias,
    view,
    icon = FileDirectoryIcon,
    parent,
    children = [],
  }: {
    name: string;
    alias?: string;
    view?: "list" | "grid";
    icon?: Icon | string;
    parent: Directory | null;
    children?: FSNode[];
  }) {
    super({ name, alias, icon, parent });
    this.children = children;
    this.type = "directory";
    this.view = view ?? "grid";
  }

  traverse(path: string[]): FSNode | null {
    if (path.length === 0) return this;

    const [next, ...rest] = path;
    if (!next) return this.traverse(rest);

    if (next === "/") return this.find_root().traverse(rest);
    if (next === "~") {
      return this.find_root().traverse(["Users", "hinson", ...rest]);
    }

    const node = this.children.find(
      (value) => value.name.toLowerCase() === next.toLowerCase(),
    );

    if (!node) return null;
    if (node.type === "directory") return (node as Directory).traverse(rest);
    if (node.type === "file") return node;

    return null;
  }

  evaluate_path = (path: string[]) => {
    let newPath = this.get_path();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let location: Directory | null = this;
    for (const choice of path) {
      if (choice === ".") {
        continue;
      } else if (choice === "..") {
        newPath = newPath.slice(0, -1);
        location = location?.parent ?? null;
      } else if (choice === "~") {
        const rootNode = this.find_root().traverse(["Users", "hinson"]);
        if (rootNode) {
          newPath = rootNode.get_path();
          location = rootNode as Directory;
        } else {
          return null;
        }
      } else {
        if (!location) return null;
        if (location.type === "directory") {
          const tentativeLocation: Directory | undefined =
            location.children.find(
              (child) => child.name === choice,
            ) as Directory;

          if (tentativeLocation?.type === "directory") {
            location = tentativeLocation;
            newPath.push(choice);
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    }
    const folder = location as Directory;
    return { folder, path: newPath };
  };
}

export class File extends FSNode {
  content?: React.ReactNode;
  type: "file";
  constructor({
    name,
    alias,
    icon = "/icons/file.png",
    parent,
    content,
  }: {
    name: string;
    alias?: string;
    icon?: Icon | string;
    parent: Directory | null;
    content?: React.ReactNode;
  }) {
    super({ name, alias, icon, parent });
    this.content = content;
    this.type = "file";
  }
}

export const ChasmMarkdown = () => <MarkdownPage path="/markdown/chasm.md" />;

const buildTree = (
  structure: FileSystemStructure,
  parent: Directory | null = null,
): FSNode => {
  if (structure.type === "directory") {
    const directory = new Directory({
      name: structure.name,
      alias: structure.alias,
      view: structure.view,
      icon: structure.icon,
      parent,
      children: [],
    });

    // Recursively build children and link them to the directory
    if (structure.children) {
      directory.children = structure.children.map((child) =>
        buildTree(child, directory),
      );
    }

    return directory;
  } else if (structure.type === "file") {
    return new File({
      name: structure.name,
      alias: structure.alias,
      icon: structure.icon,
      parent,
      content: structure.content,
    });
  } else {
    throw new Error(`Invalid node type: ${structure.type}`);
  }
};

const homeData: FileSystemStructure = {
  name: "hinson",
  type: "directory",
  children: [
    {
      name: "Welcome",
      type: "directory",
      icon: HomeIcon,
      children: [
        {
          name: "Welcome!",
          type: "file",
          icon: "/icons/profile.png",
          content: <Welcome />,
        },
        {
          name: "ContactMe.md",
          type: "file",
          icon: MarkdownIcon,
          content: <MarkdownPage path="/markdown/ContactMe.md" />,
        },
        {
          name: "Credits.md",
          type: "file",
          icon: MarkdownIcon,
          content: <MarkdownPage path="/markdown/Credits.md" />,
        },
      ],
    },
    {
      name: "Writing",
      type: "directory",
      view: "list",
      children: [
        {
          name: "cs106a.md",
          alias: "Hacking Stanford's CS106A.md",
          type: "file",
          icon: MarkdownIcon,
          content: <MarkdownPage path="/markdown/cs106a.md" />,
        },
      ],
    },
    {
      name: "Applications",
      type: "directory",
      icon: AppsIcon,
      children: [
        {
          name: "Arc",
          type: "file",
          icon: "/icons/arc.png",
          content: <Arc />,
        },
        {
          name: "Discord",
          type: "file",
          icon: "/icons/discord.png",
          // content: <MarkdownPage path="/markdown/InProgress.md" />,
        },
        {
          name: "Code",
          type: "file",
          icon: "/icons/vscode.png",
          // content: <MarkdownPage path="/markdown/InProgress.md" />,
        },
        {
          name: "iTerm",
          type: "file",
          icon: "/icons/iterm.png",
        },
        {
          name: "Notion",
          type: "file",
          icon: "/icons/notion.png",
          // content: <MarkdownPage path="/markdown/InProgress.md" />,
        },
      ],
    },
  ],
};

fileSystemData.children
  ?.find((folder) => folder.name === "Users")
  ?.children?.push(homeData);

const root = buildTree(fileSystemData);
export const fs_store = createStore({ fs: root });

export const getFileStructure = (): Directory =>
  fs_store.getState("fs").getValue() as Directory;

export const fsSubscribe = (fn: (fs: Directory) => void) => {
  return fs_store.subscribe((key) => {
    if (key === "fs") fn(getFileStructure());
  });
};

export const useFS = (path?: string[]): Directory => {
  const [fs, setFs] = useState(() => {
    const initialFs = getFileStructure().traverse(path ?? []);
    return initialFs && initialFs.type === "directory"
      ? initialFs
      : getFileStructure();
  });

  const unsubRef = useRef<() => void | undefined>(undefined);

  useEffect(() => {
    // Traverse to the new path
    const newFs = getFileStructure().traverse(path ?? []);
    if (newFs?.type === "directory") setFs(newFs as Directory);
    unsubRef.current?.(); // Unsubscribe from previous path
    // Subscribe to new path
    unsubRef.current = fsSubscribe((newFs: Directory) => {
      const folder = path ? newFs.traverse(path) : newFs;
      if (folder?.type === "directory") {
        setFs(folder as Directory);
      }
    });
    return () => unsubRef.current?.(); // Cleanup
  }, [path]);

  return fs as Directory;
};
