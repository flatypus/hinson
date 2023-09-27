import Arc from "@components/applications/arc/arc";
import ComingSoon from "@components/applications/coming_soon/coming-soon";
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
    component: ComingSoon,
  },
  {
    name: "Arc",
    icon: "arc.png",
    component: Arc,
  },
  {
    name: "Discord",
    icon: "discord.png",
    component: ComingSoon,
  },
  {
    name: "Code",
    icon: "vscode.png",
    component: ComingSoon,
  },
  {
    name: "iTerm",
    icon: "iterm.png",
    component: ComingSoon,
  },
  {
    name: "Notion",
    icon: "notion.png",
    component: ComingSoon,
  },
];
