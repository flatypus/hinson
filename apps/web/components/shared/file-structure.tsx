import {
  AppsIcon,
  FileDirectoryIcon,
  HomeIcon,
  MailIcon,
  RocketIcon,
} from "@primer/octicons-react";
import type { FunctionComponent } from "react";
import type { IconProps } from "@primer/octicons-react";
import { IconFromPath, MarkdownIcon } from "@components/image_icons/";
import Arc from "@components/applications/arc/arc";
import MarkdownPage from "@components/applications/markdown-page/markdown-page";

export type Icon = FunctionComponent<IconProps>;

export class FSNode {
  name: string;
  icon: Icon;
  constructor({
    name,
    icon = FileDirectoryIcon,
  }: {
    name: string;
    icon?: Icon | string;
  }) {
    this.name = name;
    this.icon =
      typeof icon === "string"
        ? () => IconFromPath({ path: icon, alt: name })
        : icon;
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
    icon?: Icon | string;
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
    const node = this.children.find(
      (value) => value.name.toLowerCase() === next.toLowerCase(),
    );

    if (node instanceof Directory) {
      return node.traverse(rest);
    }

    if (node instanceof File) {
      return node;
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
    icon?: Icon | string;
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
          name: "Welcome",
          icon: HomeIcon,
          children: [
            new File({
              name: "Welcome!.md",
              icon: MarkdownIcon,
              content: <MarkdownPage path="/markdown/Welcome!.md" />,
            }),
            new File({
              name: "AboutMe.md",
              icon: MarkdownIcon,
              content: <MarkdownPage path="/markdown/About.md" />,
            }),
            new File({
              name: "Credits.md",
              icon: MarkdownIcon,
              content: <MarkdownPage path="/markdown/Credits.md" />,
            }),
          ],
        }),
        new Directory({
          name: "Projects",
          icon: RocketIcon,
          children: [
            new File({
              name: "EduBeyond.md",
              icon: MarkdownIcon,
              content: <MarkdownPage path="/markdown/InProgress.md" />,
            }),
            new File({
              name: "YouTube.md",
              icon: MarkdownIcon,
              content: <MarkdownPage path="/markdown/InProgress.md" />,
            }),
          ],
        }),
        new Directory({
          name: "ContactMe",
          icon: MailIcon,
          children: [
            new File({
              name: "ContactMe.md",
              icon: MarkdownIcon,
              content: <MarkdownPage path="/markdown/InProgress.md" />,
            }),
          ],
        }),
        new Directory({
          name: "Applications",
          icon: AppsIcon,
          children: [
            new File({
              name: "Arc",
              icon: "/icons/arc.png",
              content: <Arc />,
            }),
            new File({
              name: "Discord",
              icon: "/icons/discord.png",
              content: <MarkdownPage path="/markdown/InProgress.md" />,
            }),
            new File({
              name: "Code",
              icon: "/icons/vscode.png",
              content: <MarkdownPage path="/markdown/InProgress.md" />,
            }),
            new File({
              name: "iTerm",
              icon: "/icons/iterm.png",
              content: <MarkdownPage path="/markdown/InProgress.md" />,
            }),
            new File({
              name: "Notion",
              icon: "/icons/notion.png",
              content: <MarkdownPage path="/markdown/InProgress.md" />,
            }),
          ],
        }),
      ],
    }),
  ],
});
