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
      // Normalize doubled backslashes that occur when LaTeX is passed as a
      // JSX string attribute (e.g. latex="\\frac{...}") so that validation
      // sees single-backslash commands as intended.
      const toValidate = latex.replace(/\\\\/g, "\\");
      katex.renderToString(toValidate, {
        throwOnError: true,
        strict: "error",
      });
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
