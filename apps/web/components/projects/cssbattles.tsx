import React, { useRef, useEffect } from "react";

function Battle({
  content,
  title,
}: {
  content: string;
  title: string;
}): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    const doc = iframeRef.current.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
  }, [content]);

  return <iframe className="h-[500px] w-full" ref={iframeRef} title={title} />;
}

export default function CSSBattles(): JSX.Element {
  return (
    <div className="markdown-body h-full w-full overflow-y-scroll bg-transparent">
      <Battle
        content="<p><a></p><style>html{background:#504B72}p{margin:50px;margin-left:92px;width:200px;height:200px;background:#FFFBCC;border-radius:100%;}a{position:absolute;background:#504B72;width:100px;height:100px;left:150px;top:100px;transform:rotate(45deg);}</style>"
        title="November 4th, 2023"
      />
      <Battle
        content="<a><i></p></p></i><b></a><style>html{background:#8C80BB}p{margin:0px;width:100px;height:100px;background:#FCDFEB;border-top-left-radius:100%;border-bottom-right-radius:20px;}p:nth-child(2){transform:scaleX(-1);margin-left:30px}a{display:flex;flex-direction:column;place-items:center;}i{margin-top:62px;display:flex;}b{margin:10px;background:#FCDFEB;width:50px;height:50px;border-radius:100%}</style>"
        title="November 3rd, 2023"
      />
    </div>
  );
}
