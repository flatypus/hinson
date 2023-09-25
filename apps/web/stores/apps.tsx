import Arc from "@components/applications/arc/arc";
import Finder from "@components/applications/finder/finder";

export const apps = [
  {
    name: "Finder",
    icon: "finder.png",
    component: Finder,
  },
  {
    name: "Launchpad",
    icon: "launchpad.png",
    component: <div />,
  },
  {
    name: "Arc",
    icon: "arc.png",
    component: Arc,
  },
  {
    name: "Discord",
    icon: "discord.png",
    component: <div />,
  },
  {
    name: "Code",
    icon: "vscode.png",
    component: <div />,
  },
  {
    name: "iTerm",
    icon: "iterm.png",
    component: <div />,
  },
  {
    name: "Notion",
    icon: "notion.png",
    component: <div />,
  },
];
