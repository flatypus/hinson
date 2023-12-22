/* eslint-disable jsx-a11y/no-static-element-interactions -- This is a custom component */

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export default function Slider({
  one,
  componentA,
  componentB,
}: {
  one: boolean;
  componentA: ReactNode;
  componentB: ReactNode;
}): JSX.Element {
  const [proportion, setProportion] = useState(0.2);
  const [dragging, setDragging] = useState(false);
  const [boundingBox, setBoundingBox] = useState<DOMRect | null>(null);
  const [delayedOne, setDelayedOne] = useState(one);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setDelayedOne(one);
    }, 500);
  }, [one]);

  useEffect(() => {
    if (containerRef.current === null) return;
    setBoundingBox(containerRef.current.getBoundingClientRect());
  }, [containerRef]);

  return (
    <div
      className={`relative flex h-full w-full flex-row overflow-hidden p-2 text-black transition-all duration-300 ${
        one ? "gap-0" : ""
      }`}
      onMouseMove={(e) => {
        if (dragging && boundingBox !== null) {
          const x = e.clientX - boundingBox.left;
          const newProportion = x / boundingBox.width;
          if (newProportion < 0.15 || newProportion > 0.4) return;
          setProportion(x / boundingBox.width);
        }
      }}
      ref={containerRef}
    >
      <div
        className={`overflow-hidden ${
          delayedOne ? "transition-all duration-500" : "transition-none"
        }`}
        style={one ? { width: 0 } : { width: `${proportion * 100}%` }}
      >
        {componentA}
      </div>
      <div
        className="group relative z-[100] cursor-col-resize bg-transparent"
        onMouseDown={() => {
          if (containerRef.current === null) return;
          setBoundingBox(containerRef.current.getBoundingClientRect());
          setDragging(true);
        }}
        onMouseUp={() => {
          setDragging(false);
        }}
      >
        {!one ? (
          <div className="h-full w-[4px] p-1">
            {dragging ? (
              <div className="absolute h-full translate-x-[-50%] bg-white opacity-0 group-hover:w-[800px]" />
            ) : null}
          </div>
        ) : null}
      </div>
      <div
        className="overflow-hidden"
        style={
          // the 122 is a temporary solution to an animation bug
          one ? { width: "100%" } : { width: `${(1 - proportion) * 122}%` }
        }
      >
        {componentB}
      </div>
    </div>
  );
}
