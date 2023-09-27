import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css";

export default function MarkdownPage({ path }: { path: string }): JSX.Element {
  const [file, setFile] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(path)
      .then(async (res) => {
        const text = await res.text();
        setFile(text);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [path]);

  return (
    <div className="markdown-body bg-markdown-github-black font-inter h-full w-full overflow-scroll p-10 text-left text-white">
      {!loading && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{file}</ReactMarkdown>
      )}
    </div>
  );
}
