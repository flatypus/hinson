import Image from "next/image";

export function IconFromPath({
  path,
  alt,
  size,
}: {
  path: string;
  alt: string;
  size?: string | number;
}) {
  const fixedSize = size ? parseInt(size.toString()) : 48;

  return (
    <Image
      alt={alt}
      className="rounded-lg"
      height={fixedSize}
      src={path}
      width={fixedSize}
    />
  );
}

export function MarkdownIcon({ size }: { size?: string | number }) {
  return (
    <IconFromPath alt="markdown_icon" path="/icons/markdown.png" size={size} />
  );
}

export function FileDirectoryIcon({ size }: { size?: string | number }) {
  return (
    <IconFromPath alt="folder_icon" path="/icons/folder.png" size={size} />
  );
}
