import { BookOpen } from "lucide-react";
import { TableLookupCallout } from "./TableLookupCallout";
import type { z } from "zod";
import type { DetailedSolutionSchema } from "@/data/schema";

type DS = z.infer<typeof DetailedSolutionSchema>;

export function DetailedSolution({ solution }: { solution: DS }) {
  return (
    <div className="mb-4">
      <div className="rounded-t-lg border border-b-0 border-line bg-paper-2 px-5 py-3">
        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          <BookOpen size={11} className="text-primary-2" />
          {solution.source}
        </div>
        <p className="m-0 font-serif text-[14px] italic leading-snug text-ink-2 before:text-ink-4 before:content-['«_'] after:text-ink-4 after:content-['_»']">
          {solution.question}
        </p>
      </div>
      <div
        className="relative overflow-x-auto rounded-b-lg border border-t-0 px-7 py-5 font-mono text-[14px] leading-relaxed"
        style={{
          background: "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
          borderColor: "var(--color-calc-border)",
          color: "var(--color-calc-text)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-px -top-px h-[90px] w-[90px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(34, 211, 238, 0.08) 0%, transparent 70%)",
          }}
        />
        {solution.sections.map((sec, si) => (
          <div key={si}>
            <div
              className="mb-1.5 mt-4 font-mono text-[10.5px] font-semibold uppercase tracking-widest first:mt-0"
              style={{ color: "var(--color-calc-label)" }}
            >
              {sec.label}
            </div>
            {sec.lines.map((line, li) => {
              if ("text" in line) {
                return (
                  <div key={li} className="whitespace-pre py-px">
                    {line.text}
                  </div>
                );
              }
              if ("comment" in line) {
                return (
                  <div key={li} className="whitespace-pre py-px">
                    <span
                      className="ml-3 italic"
                      style={{ color: "var(--color-calc-comment)" }}
                    >
                      # {line.comment}
                    </span>
                  </div>
                );
              }
              if ("indent" in line) {
                return (
                  <div key={li} className="whitespace-pre py-px pl-6">
                    {line.indent}
                  </div>
                );
              }
              if ("table_lookup" in line) {
                return (
                  <TableLookupCallout
                    key={li}
                    reference={line.table_lookup.ref}
                    text={line.table_lookup.text}
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
        <hr
          className="my-3 border-0"
          style={{ height: 1, background: "var(--color-calc-divider)" }}
        />
        <div
          className="mb-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-calc-label)" }}
        >
          Resultat
        </div>
        <span
          className="block text-[20px] font-bold tracking-wide"
          style={{ color: "var(--color-calc-result)" }}
        >
          {solution.result}
        </span>
      </div>
    </div>
  );
}
