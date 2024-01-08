import Tippy from "@tippyjs/react";

export default function Tip({
  name,
  children,
}: {
  name: string;
  children: JSX.Element;
}): JSX.Element {
  return (
    <Tippy
      animation="scale"
      content={
        <span className="rounded-md bg-white bg-opacity-50 p-[4px] text-[8px]">
          {name}
        </span>
      }
      offset={[0, -4]}
    >
      {children}
    </Tippy>
  );
}
