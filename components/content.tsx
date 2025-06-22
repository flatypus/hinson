"use client";

import { File, useFS } from "@components/shared/file-structure";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Drag from "./drag";
import useSettingsStore from "@stores/settings.store";
import useWindowsStore from "@stores/windows.store";
import Window from "./window/window";

export default function Content({ path }: { path: string[] | undefined }) {
  const { windows, setGetWindowSize, addWindow } = useWindowsStore();
  const { setIsTouchDevice, isTouchDevice } = useSettingsStore();
  const router = useRouter();
  const fs = useFS();

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, [setIsTouchDevice]);

  useEffect(() => {
    let file;

    const fallback = () => {
      file = fs.traverse(["~", "Applications", "Arc"]);
      router.push("/");
    };

    if (path && path.length > 0) {
      const checkPaths = (_path: string[]): boolean => {
        const possibleFile = fs.traverse(_path);
        return Boolean(possibleFile && possibleFile.type === "file");
      };

      for (const checkPath of [
        path,
        ["~", ...path],
        ["~", "Applications", ...path],
      ]) {
        if (checkPaths(checkPath)) {
          file = fs.traverse(checkPath);
          break;
        }
      }

      if (!file) fallback();
    } else {
      fallback();
    }

    const getWindowSize = (): {
      width: number;
      height: number;
    } => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    setGetWindowSize(getWindowSize);

    windows.forEach((app) => {
      app.injectGetSize(getWindowSize);
      app.hide(false);
    });

    if (file?.type !== "file" || !(file as File).content) return;

    addWindow({
      name: file.name,
      icon: file.icon,
      component: (file as File).content,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addWindow, path, setGetWindowSize, windows, fs]);

  return (
    <div className="flex-1">
      {windows.map((app) => {
        if (isTouchDevice && !app.active) {
          return null;
        }
        if (app.mode !== "minimized" && app.mode !== "closed") {
          return <Window app={app} key={app.name} />;
        }
        return null;
      })}
      <Drag />
    </div>
  );
}
