import type { WindowMode } from "@lib/types";
import type { Icon } from "../../components/shared/file-structure";

interface WindowConstructor {
  name: string;
  icon: Icon | string;
  component: JSX.Element;
  getWindows: () => Window[];
  refreshWindows: () => void;
  active?: boolean;
  mode?: WindowMode;
  docked?: boolean;
}

export class Window {
  name: string;
  icon: Icon | string;
  active: boolean;
  mode: WindowMode;
  component: JSX.Element;
  width = 0;
  height = 0;
  x = 0;
  y = 0;
  docked: boolean;

  private defaultFps = 180;
  private defaultTime = 200;
  private getWindows: () => Window[];
  private refreshWindows: () => void;
  private getWindowSize = (): { width: number; height: number } => {
    return { width: 0, height: 0 };
  };

  constructor({
    name,
    icon,
    component,
    getWindows,
    refreshWindows,
    active = false,
    mode = "closed",
    docked = false,
  }: WindowConstructor) {
    this.name = name;
    this.icon = icon;
    this.active = active;
    this.mode = mode;
    this.component = component;
    this.refreshWindows = refreshWindows;
    this.docked = docked;
    this.getWindows = () => {
      const allWindows = getWindows();
      return allWindows.filter((window) => window.name !== this.name);
    };
  }

  private setMode(mode: WindowMode): void {
    this.mode = mode;
  }

  private setActive(active: boolean): void {
    this.active = active;
  }

  private animate(target: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }): void {
    const fps = this.defaultFps;
    const time = this.defaultTime;
    const frames = fps * (time / 1000);
    const start = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };

    let frame = 0;
    const animateFrame = (): void => {
      const ease = (t: number): number => {
        return (-Math.cos(Math.PI * t) + 1) / 2;
      };

      if (target.x !== undefined) {
        this.x = start.x + (target.x - start.x) * ease(frame / frames);
      }

      if (target.y !== undefined) {
        this.y = start.y + (target.y - start.y) * ease(frame / frames);
      }

      if (target.width !== undefined) {
        this.width =
          start.width + (target.width - start.width) * ease(frame / frames);
      }

      if (target.height !== undefined) {
        this.height =
          start.height + (target.height - start.height) * ease(frame / frames);
      }

      this.refreshWindows();
      frame++;
      if (frame < frames) {
        requestAnimationFrame(animateFrame);
      }
    };
    requestAnimationFrame(animateFrame);
  }

  private randomWindowTransform(): void {
    const { width: innerWidth, height: innerHeight } = this.getWindowSize();

    const newWidth = (innerWidth * 3) / 4;
    const newHeight = (innerHeight * 3) / 4;

    this.setTransform(
      Math.floor(Math.random() * (innerWidth - newWidth)),
      Math.floor(Math.random() * (innerHeight - newHeight)),
      newWidth,
      newHeight,
    );
  }

  injectGetSize(getWindowSize: () => { width: number; height: number }): void {
    this.getWindowSize = getWindowSize;
  }

  setTransform(
    x: number,
    y: number,
    width: number,
    height: number,
    animate = true,
  ): void {
    if (width < 0 || height < 0) {
      throw new Error(
        "Invalid input: width and height should be positive numbers.",
      );
    }
    if (animate) {
      this.animate({ x, y, width, height });
    } else {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.refreshWindows();
    }
  }

  hide(animate = true): void {
    if (animate) this.setMode("hiding");
    const { width: innerWidth, height: innerHeight } = this.getWindowSize();
    this.setTransform(innerWidth / 2 - 100, innerHeight - 60, 0, 0, animate);
  }

  fullscreen(): void {
    this.setMode("fullscreen");
    this.setActiveWindow();
    const { width: innerWidth, height: innerHeight } = this.getWindowSize();
    this.setTransform(0, 0, innerWidth, innerHeight);
  }

  minimize(): void {
    this.hide();
    this.focusAnotherWindow();
    setTimeout(() => {
      this.setMode("minimized");
    }, 200);
  }

  close(): void {
    this.hide();
    this.focusAnotherWindow();
    setTimeout(() => {
      this.setMode("closed");
    }, 200);
  }

  window(): void {
    this.setMode("windowed");
    this.setActiveWindow();
    this.randomWindowTransform();
  }

  setActiveWindow(): void {
    const otherWindows = this.getWindows();
    otherWindows.forEach((window) => {
      window.setActive(false);
    });
    this.setActive(true);
    this.refreshWindows();
  }

  focusAnotherWindow(): void {
    const otherWindows = this.getWindows();
    const activeWindows = otherWindows.filter(
      (window) => window.mode !== "closed" && window.mode !== "minimized",
    );
    if (activeWindows.length > 0) {
      activeWindows[0].setActive(true);
    }
    this.refreshWindows();
  }
}
