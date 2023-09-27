import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPage(): JSX.Element {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {`# Hinson's Blog`}
    </ReactMarkdown>
  );
}
