import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "github-markdown-css";

const Components = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  img: (props: any) => {
    let { src } = props;
    src = src.startsWith("/") ? `${src}` : src;

    return (
      <div className="grid w-full place-items-center pb-4 lg:px-20 lg:pb-6 lg:pt-3">
        <img src={src} className="max-h-[300px] rounded-sm lg:max-h-[400px]" />
      </div>
    );
  },
};

export default function MarkdownPage({ path }: { path: string }) {
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
    <div className="markdown-body font-inter grid h-full w-full place-items-center overflow-scroll bg-markdown-github-black p-4 text-left text-white lg:p-10">
      <div className="max-w-[calc(100vw-50px)] rounded-lg border-[#3d444d] px-2 text-sm lg:max-w-[800px] lg:border lg:px-6 lg:text-base">
        {!loading && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={Components}
          >
            {file}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
