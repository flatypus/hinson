import { useRef } from "react";

export default function Input({
  shortenedName,
  currentURL,
}: {
  shortenedName: string;
  currentURL: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <input
      className="w-full rounded-lg border-none bg-black/5 p-2 text-black/50 outline-none hover:bg-black/10"
      defaultValue={shortenedName}
      onBlur={(event) => {
        event.preventDefault();
        if (!inputRef.current) return;
        inputRef.current.value = shortenedName;
      }}
      onFocus={(event) => {
        event.preventDefault();
        if (!inputRef.current) return;
        inputRef.current.value = currentURL;
        inputRef.current.select();
      }}
      onKeyDown={(event) => {
        const search = event.currentTarget.value;
        if (event.key === "Enter" && search) {
          if (search.startsWith("http")) {
            window.open(event.currentTarget.value, "_blank");
          } else {
            window.open(`https://www.google.com/search?q=${search}`);
          }
        }
      }}
      ref={inputRef}
      type="text"
    />
  );
}
