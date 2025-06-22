import { useState, useMemo, useEffect } from "react";

const BREAKPOINT = 1200;

export function useMobile() {
  const [dims, setDims] = useState({
    width: BREAKPOINT,
    height: 0,
    x: 0,
    y: 0,
  });
  const small = useMemo(() => dims.width < BREAKPOINT, [dims.width]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
        x: window.screenX,
        y: window.screenY,
      };
      setDims(newDimensions);
    });

    setDims({
      width: window.innerWidth,
      height: window.innerHeight,
      x: window.screenX,
      y: window.screenY,
    });
  }, []);

  return small;
}
