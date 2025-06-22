interface NewTab {
  name: string;
  icon?: string;
  url?: string;
  element: () => React.ReactNode;
  onClick?: () => void;
}

export function createTab({
  name,
  element,
  url = "",
  icon = "/images/flatypus.png",
  onClick,
}: NewTab) {
  return {
    name: name,
    element: element,
    url: `https://flatypus.me${url}`,
    icon: icon,
    key: new Date().getTime().toString(),
    onClick,
  };
}
