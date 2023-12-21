import type { Icon } from "@components/shared/file-structure";
import type { WindowMode } from "@lib/types";

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
  }): () => void {
    const fps = this.defaultFps;
    const time = this.defaultTime;
    const frames = fps * (time / 1000);

    const start = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };

    const requiredTarget = {
      x: target.x ?? this.x,
      y: target.y ?? this.y,
      width: target.width ?? this.width,
      height: target.height ?? this.height,
    };

    const toCancel: number[] = [];

    const values: { x: number; y: number; width: number; height: number }[] =
      [];

    for (let frame = 0; frame < frames; frame++) {
      const ease = (-Math.cos(Math.PI * (frame / frames)) + 1) / 2;
      values.push({
        x: start.x + (requiredTarget.x - start.x) * ease,
        y: start.y + (requiredTarget.y - start.y) * ease,
        width: start.width + (requiredTarget.width - start.width) * ease,
        height: start.height + (requiredTarget.height - start.height) * ease,
      });
    }

    let frame = 0;

    const animateFrame = (): void => {
      this.x = values[frame].x;
      this.y = values[frame].y;
      this.width = values[frame].width;
      this.height = values[frame].height;
      frame += 1;
      this.refreshWindows();

      if (frame < frames) {
        toCancel.push(requestAnimationFrame(animateFrame));
      }
    };

    toCancel.push(requestAnimationFrame(animateFrame));

    return () => {
      toCancel.forEach((cancelHandle) => {
        cancelAnimationFrame(cancelHandle);
      });
    };
  }

  private randomWindowTransform(): void {
    const { width: innerWidth, height: innerHeight } = this.getWindowSize();

    const newWidth = (innerWidth * 5) / 6;
    const newHeight = (innerHeight * 5) / 6;

    let x;
    if (innerWidth - newWidth < 60) {
      x = (innerWidth - newWidth) / 2;
    } else {
      x = Math.random() * (innerWidth - newWidth - 60) + 30;
    }

    let y;
    if (innerHeight - newHeight < 60) {
      y = (innerHeight - newHeight) / 2;
    } else {
      y = Math.random() * (innerHeight - newHeight - 60) + 30;
    }

    this.setTransform(x, y, newWidth, newHeight);
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
