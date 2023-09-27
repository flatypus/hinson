import Image from "next/image";

export function IconFromPath({
  path,
  alt,
}: {
  path: string;
  alt: string;
}): JSX.Element {
  return <Image alt={alt} height={64} src={path} width={64} />;
}

export function MarkdownIcon(): JSX.Element {
  return <IconFromPath alt="markdown_icon" path="/icons/markdown.png" />;
}

export function FileDirectoryIcon(): JSX.Element {
  return <IconFromPath alt="folder_icon" path="/icons/folder.png" />;
}
