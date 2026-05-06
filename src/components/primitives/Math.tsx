import { useMemo } from "react";
import katex from "katex";

interface Props {
  latex: string;
  display?: boolean;
  fallback?: string;
}

export function Math({ latex, display = false, fallback }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        strict: "warn",
      });
    } catch {
      return null;
    }
  }, [latex, display]);

  if (html === null) {
    return <span>{fallback ?? latex}</span>;
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
