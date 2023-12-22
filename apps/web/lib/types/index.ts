export type WindowMode =
  | "fullscreen"
  | "windowed"
  | "minimized"
  | "closed"
  | "hiding";

export interface Tab {
  icon: string;
  name: string;
  url: string;
  element?: () => JSX.Element;
}
