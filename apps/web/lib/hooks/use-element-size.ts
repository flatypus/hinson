import { useState, useRef, useEffect } from "react";

export default function useElementSize<T extends HTMLElement>(): {
  width: number;
  height: number;
  elementReference: React.RefObject<T>;
} {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const elementReference = useRef<T>(null);

  useEffect(() => {
    const handleResize = (): void => {
      if (elementReference.current) {
        setSize({
          width: elementReference.current.clientWidth,
          height: elementReference.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { width: size.width, height: size.height, elementReference };
}
