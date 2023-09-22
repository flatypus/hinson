"use client";

import type { CSSProperties } from "react";
import React, { useEffect, useMemo, useState } from "react";

const HOUR = 60 * 60 * 1000;
const WALLPAPERS = {
  night: "/wallpapers/night.jpg",
  sunrise: "/wallpapers/sunrise.jpg",
  day: "/wallpapers/day.jpg",
  sunset: "/wallpapers/sunrise.jpg",
};

const wallpaperByHour = (hour: number): string => {
  if (hour >= 9 && hour < 18) return WALLPAPERS.day;
  if (hour < 6 || hour >= 21) return WALLPAPERS.night;
  return WALLPAPERS.sunrise;
};

interface BackgroundProps {
  children: React.ReactNode;
}

export default function Background({ children }: BackgroundProps): JSX.Element {
  const [wallpaper, setWallpaper] = useState(WALLPAPERS.day);

  const style: CSSProperties = useMemo(
    () => ({
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${wallpaper})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: -1,
    }),
    [wallpaper],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setWallpaper(wallpaperByHour(hour));
    }, HOUR);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div style={style}>{children}</div>;
}
