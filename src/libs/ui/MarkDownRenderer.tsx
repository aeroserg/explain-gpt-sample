import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import classNames from "classnames";

interface MarkDownRendererProps {
  content: string;
}

export const MarkDownRenderer = ({ content }: MarkDownRendererProps) => {
  const [isCopyng, setIsCopying] = useState(false);

  useEffect(() => {
    if (isCopyng) {
      setTimeout(() => setIsCopying(false), 2000);
    }
  }, [isCopyng]);

  return (
    <div className="markdown-container flex flex-col gap-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <Prism style={oneDark} language={match[1]} PreTag="div">
                {String(children).replace(/\n$/, "")}
              </Prism>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          p({ children, className }) {
            return (
              <p
                className={classNames(className, "text-[14px] lg:leading-relaxed leading-tight")}
              >
                {children}
              </p>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
