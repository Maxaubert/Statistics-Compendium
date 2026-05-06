import { BookOpen } from "lucide-react";
import { TableLookupCallout } from "./TableLookupCallout";
import { renderInlineCode } from "./inline-code";
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
          {renderInlineCode(solution.question, "light")}
        </p>
      </div>
      <div
        className="relative rounded-b-lg border border-t-0 px-7 py-5 font-mono text-[14px] leading-relaxed"
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
                  <div key={li} className="whitespace-pre-wrap break-words py-px">
                    {renderInlineCode(line.text, "dark")}
                  </div>
                );
              }
              if ("comment" in line) {
                return (
                  <div key={li} className="whitespace-pre-wrap break-words py-px">
                    <span
                      className="ml-3 italic"
                      style={{ color: "var(--color-calc-comment)" }}
                    >
                      # {renderInlineCode(line.comment, "dark")}
                    </span>
                  </div>
                );
              }
              if ("indent" in line) {
                return (
                  <div key={li} className="whitespace-pre-wrap break-words py-px pl-6">
                    {renderInlineCode(line.indent, "dark")}
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
              if ("tip" in line) {
                return (
                  <div
                    key={li}
                    className="my-2 flex gap-2.5 rounded-md border-l-2 px-3 py-2 text-[13.5px] leading-relaxed"
                    style={{
                      borderColor: "var(--color-cyan-2)",
                      background: "rgba(34, 211, 238, 0.08)",
                      color: "var(--color-calc-text)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="select-none font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em]"
                      style={{ color: "var(--color-cyan-2)" }}
                    >
                      Tips
                    </span>
                    <span className="font-serif italic">
                      {renderInlineCode(line.tip, "dark")}
                    </span>
                  </div>
                );
              }
              if ("step_trail" in line) {
                return (
                  <div key={li} className="mb-3 flex flex-wrap gap-1.5">
                    {line.step_trail.steps.map((s, i) => {
                      const isCurrent = !s.done;
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded font-mono text-[10.5px] px-2 py-0.5"
                          style={
                            isCurrent
                              ? {
                                  background: "rgba(34, 211, 238, 0.18)",
                                  color: "var(--color-calc-result)",
                                  fontWeight: 600,
                                }
                              : {
                                  background: "rgba(99, 102, 241, 0.18)",
                                  color: "var(--color-calc-label)",
                                }
                          }
                        >
                          {s.done && (
                            <span
                              aria-hidden
                              style={{ color: "var(--color-cyan-2)" }}
                            >
                              ✓
                            </span>
                          )}
                          {s.label}
                        </span>
                      );
                    })}
                  </div>
                );
              }
              if ("table" in line) {
                const t = line.table;
                const lastColIdx = t.headers.length - 1;
                const lastRowIdx = t.rows.length - 1;
                return (
                  <div
                    key={li}
                    className="my-2 overflow-hidden rounded-md"
                    style={{ background: "rgba(0, 0, 0, 0.18)" }}
                  >
                    <table
                      className="font-mono text-[13px]"
                      style={{
                        borderCollapse: "collapse",
                        color: "var(--color-calc-text)",
                        width: "auto",
                      }}
                    >
                      <thead>
                        <tr>
                          {t.headers.map((h, hi) => {
                            const isLast = hi === lastColIdx;
                            const isCorner = hi === 0;
                            const tintMarg = t.margin_col && isLast;
                            return (
                              <th
                                key={hi}
                                style={{
                                  padding: "7px 14px",
                                  textAlign: "center",
                                  borderBottom: "1px solid var(--color-calc-divider)",
                                  borderRight:
                                    hi === lastColIdx
                                      ? "none"
                                      : "1px solid var(--color-calc-divider)",
                                  background: tintMarg
                                    ? "rgba(34, 211, 238, 0.08)"
                                    : "rgba(99, 102, 241, 0.16)",
                                  color: tintMarg
                                    ? "var(--color-calc-result)"
                                    : isCorner
                                      ? "var(--color-calc-label)"
                                      : "var(--color-calc-label)",
                                  fontWeight: 600,
                                  fontSize: "11.5px",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {h}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {t.rows.map((row, ri) => {
                          const isMargRow = t.margin_row && ri === lastRowIdx;
                          return (
                            <tr key={ri}>
                              {row.map((cell, ci) => {
                                const isFirstCell = ci === 0;
                                const isLastCol = ci === lastColIdx;
                                const isMargCol = t.margin_col && isLastCol;
                                const tintMarg = isMargRow || isMargCol;
                                const isHeaderCell = isFirstCell;
                                const cellBg = tintMarg
                                  ? "rgba(34, 211, 238, 0.08)"
                                  : isHeaderCell
                                    ? "rgba(99, 102, 241, 0.10)"
                                    : "transparent";
                                const cellColor = tintMarg
                                  ? "var(--color-calc-result)"
                                  : isHeaderCell
                                    ? "var(--color-calc-label)"
                                    : "var(--color-calc-text)";
                                const Cell = isHeaderCell ? "th" : "td";
                                return (
                                  <Cell
                                    key={ci}
                                    style={{
                                      padding: "7px 14px",
                                      textAlign: "center",
                                      borderBottom:
                                        ri === lastRowIdx
                                          ? "none"
                                          : "1px solid var(--color-calc-divider)",
                                      borderRight:
                                        ci === lastColIdx
                                          ? "none"
                                          : "1px solid var(--color-calc-divider)",
                                      background: cellBg,
                                      color: cellColor,
                                      fontWeight:
                                        tintMarg || isHeaderCell ? 600 : 400,
                                      fontSize: isHeaderCell ? "11.5px" : "13px",
                                    }}
                                  >
                                    {cell}
                                  </Cell>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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
          className="block break-words text-[15px] font-semibold"
          style={{ color: "var(--color-calc-text)" }}
        >
          {renderInlineCode(solution.result, "dark")}
        </span>
      </div>
    </div>
  );
}
