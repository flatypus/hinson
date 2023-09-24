import {
  AppsIcon,
  FileDirectoryIcon,
  HomeIcon,
  MailIcon,
  RocketIcon,
} from "@primer/octicons-react";
import type { IconProps } from "@primer/octicons-react";
import type { FunctionComponent } from "react";

export type Icon = FunctionComponent<IconProps>;

export class FSNode {
  name: string;
  icon: Icon;
  constructor({
    name,
    icon = FileDirectoryIcon,
  }: {
    name: string;
    icon?: Icon;
  }) {
    this.name = name;
    this.icon = icon;
  }
}

export class Directory extends FSNode {
  children: FSNode[];
  constructor({
    name,
    icon = FileDirectoryIcon,
    children = [],
  }: {
    name: string;
    icon?: Icon;
    children?: FSNode[];
  }) {
    super({ name, icon });
    this.children = children;
  }

  traverse(path: string[]): FSNode | null {
    if (path.length === 0) {
      return this;
    }

    const [next, ...rest] = path;
    const node = this.children.find((value) => value.name === next);

    if (node instanceof Directory) {
      return node.traverse(rest);
    }
    return null;
  }
}

export class File extends FSNode {
  content?: JSX.Element;
  constructor({
    name,
    icon = FileDirectoryIcon,
    content,
  }: {
    name: string;
    icon?: Icon;
    content?: JSX.Element;
  }) {
    super({ name, icon });
    this.content = content;
  }
}

export const fileStructure = new Directory({
  name: "~",
  children: [
    new Directory({
      name: "hinson",
      children: [
        new Directory({
          name: "AboutMe",
          icon: HomeIcon,
          children: [
            new File({ name: "Welcome!.md", content: <div /> }),
            new File({ name: "AboutMe.md", content: <div /> }),
          ],
        }),
        new Directory({
          name: "Projects",
          icon: RocketIcon,
          children: [
            new File({ name: "EduBeyond.md", content: <div /> }),
            new File({ name: "YouTube.md", content: <div /> }),
          ],
        }),
        new File({ name: "ContactMe", icon: MailIcon, content: <div /> }),
        new Directory({
          name: "Applications",
          icon: AppsIcon,
          children: [
            new File({ name: "Finder.md", content: <div /> }),
            new File({ name: "Arc.md", content: <div /> }),
            new File({ name: "Discord.md", content: <div /> }),
            new File({ name: "Code.md", content: <div /> }),
            new File({ name: "iTerm.md", content: <div /> }),
            new File({ name: "Notion.md", content: <div /> }),
          ],
        }),
      ],
    }),
  ],
});
