import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPage(): JSX.Element {
  return (
    <div className="font-inter bg-markdown-github-black h-full w-full text-white">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {`# Hinson's Blog`}
      </ReactMarkdown>
    </div>
  );
}
