import { clsx } from "clsx";
import { AlertTriangle, Calculator } from "lucide-react";
import { renderInlineCode } from "./inline-code";

export interface StepCase {
  when: string;
  then: string;
}

export interface StepTable {
  headers: string[];
  rows: string[][];
  margin_col?: boolean;
  margin_row?: boolean;
}

export type StepItem =
  | string
  | {
      text: string;
      conditional?: boolean;
      example?: boolean;
      formula?: string | string[];
      cases?: StepCase[];
      table?: StepTable;
    };

function normalize(item: StepItem): {
  text: string;
  conditional: boolean;
  example: boolean;
  formulas: string[];
  cases?: StepCase[];
  table?: StepTable;
} {
  if (typeof item === "string")
    return { text: item, conditional: false, example: false, formulas: [] };
  const rawFormula = item.formula;
  const formulas =
    rawFormula === undefined
      ? []
      : Array.isArray(rawFormula)
        ? rawFormula
        : [rawFormula];
  return {
    text: item.text,
    conditional: !!item.conditional,
    example: !!item.example,
    formulas,
    cases: item.cases,
    table: item.table,
  };
}

/**
 * Step-by-step list rendered as a vertical timeline: indigo rail with
 * numbered node circles, each step its own bordered card hanging off
 * the rail. Conditional ("Pass på") steps are indented further right
 * with a dashed connector and a warning-triangle node, so the eye can
 * distinguish "always-do-this" steps from "watch-out" notes.
 */
export function StepByStep({ steps }: { steps: StepItem[] }) {
  const numbers = computeStepNumbers(steps);
  return (
    <ol className="relative m-0 mt-2 flex list-none flex-col gap-4 p-0 pl-14">
      <span
        aria-hidden
        className="absolute left-[18px] top-4 bottom-4 w-[2px] bg-primary-2/30"
      />
      {steps.map((raw, i) => {
        const { text, conditional, example, formulas, cases, table } = normalize(raw);
        const stepNo = numbers[i];
        const codeTheme = conditional ? "warn" : example ? "example" : "step";

        const badgeClasses = example
          ? "bg-emerald-100 text-emerald-700"
          : conditional
          ? "bg-amber-100 text-amber-700"
          : "bg-primary-2 text-white";

        const badgeContent = example ? (
          <Calculator size={14} strokeWidth={2.5} />
        ) : conditional ? (
          <AlertTriangle size={14} strokeWidth={2.5} />
        ) : (
          stepNo
        );

        const connectorClasses = example
          ? "-left-[20px] w-[52px] border-dashed border-emerald-500/70"
          : conditional
          ? "-left-[20px] w-[52px] border-dashed border-amber-500/70"
          : "-left-[20px] w-8 border-primary-2/30";

        const cardClasses = example
          ? "ml-8 border border-emerald-300/70 bg-emerald-50/70"
          : conditional
          ? "ml-8 border border-amber-300/70 bg-amber-50/70"
          : "border border-line bg-primary-soft/50";

        const labelClasses = example
          ? "text-emerald-700"
          : conditional
          ? "text-amber-700"
          : "text-primary-2/80";

        const labelText = example
          ? "Eksempel"
          : conditional
          ? "Pass på"
          : `Steg ${stepNo}`;

        const textInkClass = example || conditional ? "text-ink-2" : "text-ink";

        const insetBoxClasses = example
          ? "border border-emerald-400/40 bg-emerald-100/50"
          : conditional
          ? "border border-amber-400/40 bg-amber-100/50"
          : "border border-primary-2/20 bg-primary-soft";

        const casesDividerClass = example
          ? "divide-emerald-400/30"
          : conditional
          ? "divide-amber-400/30"
          : "divide-primary-2/15";

        return (
          <li key={i} className="relative">
            <span
              className={clsx(
                "absolute -left-[46px] top-4 flex h-8 w-8 items-center justify-center rounded-full font-mono text-[13px] font-semibold ring-4 ring-card",
                badgeClasses,
              )}
            >
              {badgeContent}
            </span>
            <span
              aria-hidden
              className={clsx("absolute top-7 h-px border-t", connectorClasses)}
            />
            <div className={clsx("glass-light-card rounded-lg px-5 py-4", cardClasses)}>
              <div
                className={clsx(
                  "mb-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em]",
                  labelClasses,
                )}
              >
                {labelText}
              </div>
              <div className={clsx("font-serif text-[14.5px] leading-relaxed", textInkClass)}>
                {renderInlineCode(text, codeTheme)}
              </div>
              {table && (
                <StepTableView table={table} example={example} conditional={conditional} />
              )}
              {formulas.map((f, fi) => (
                <div
                  key={fi}
                  className={clsx(
                    "mt-3 whitespace-pre-line rounded-md px-4 py-2.5 font-mono text-[14px] leading-relaxed text-ink",
                    insetBoxClasses,
                  )}
                  style={{
                    overflowX: "auto",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                  }}
                >
                  {renderInlineCode(f, codeTheme)}
                </div>
              ))}
              {cases && cases.length > 0 && (
                <div
                  className={clsx(
                    "mt-3 overflow-hidden rounded-md",
                    insetBoxClasses,
                  )}
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)" }}
                >
                  <ul
                    className={clsx(
                      "m-0 list-none p-0 font-serif text-[13.5px] divide-y",
                      casesDividerClass,
                    )}
                  >
                    {cases.map((c, ci) => (
                      <li
                        key={ci}
                        className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4"
                      >
                        <span className="flex-1 text-ink">
                          {renderInlineCode(c.when, codeTheme)}
                        </span>
                        <span className="hidden text-ink-3 sm:inline">→</span>
                        <span className="flex-1 text-ink-2">
                          {renderInlineCode(c.then, codeTheme)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Step number per row, skipping conditional ("Pass på") and example rows so they do not consume a count. */
function computeStepNumbers(steps: StepItem[]): (number | null)[] {
  let n = 0;
  return steps.map((s) => {
    const norm = normalize(s);
    return norm.conditional || norm.example ? null : ++n;
  });
}

/**
 * Lightweight table renderer for step-cards. Uses the surrounding step
 * theme (emerald for example, amber for conditional, indigo otherwise)
 * so the table reads as part of the step rather than a foreign block.
 */
function StepTableView({
  table,
  example,
  conditional,
}: {
  table: StepTable;
  example: boolean;
  conditional: boolean;
}) {
  const lastCol = table.headers.length - 1;
  const lastRow = table.rows.length - 1;
  const headerBg = example
    ? "bg-emerald-200/50 text-emerald-900"
    : conditional
      ? "bg-amber-200/50 text-amber-900"
      : "bg-primary-2/15 text-primary-2";
  const marginCellTint = example
    ? "bg-emerald-300/40 text-emerald-900"
    : conditional
      ? "bg-amber-300/40 text-amber-900"
      : "bg-primary-2/20 text-primary-2";
  const firstColTint = example
    ? "bg-emerald-200/30 text-emerald-900"
    : conditional
      ? "bg-amber-200/30 text-amber-900"
      : "bg-primary-2/10 text-primary-2";
  const borderColor = example
    ? "border-emerald-400/40"
    : conditional
      ? "border-amber-400/40"
      : "border-primary-2/20";
  return (
    <div className={clsx("mt-3 overflow-x-auto rounded-md border", borderColor)}>
      <table className="w-full border-collapse font-mono text-[13px]">
        <thead>
          <tr>
            {table.headers.map((h, hi) => {
              const isMarg = !!table.margin_col && hi === lastCol;
              return (
                <th
                  key={hi}
                  className={clsx(
                    "px-3.5 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide",
                    "border-b",
                    hi !== lastCol && "border-r",
                    borderColor,
                    isMarg ? marginCellTint : headerBg,
                  )}
                >
                  {h}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => {
            const isMargRow = !!table.margin_row && ri === lastRow;
            return (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const isFirst = ci === 0;
                  const isMargCol = !!table.margin_col && ci === lastCol;
                  const tint = isMargRow || isMargCol;
                  const Cell = isFirst ? "th" : "td";
                  return (
                    <Cell
                      key={ci}
                      className={clsx(
                        "px-3.5 py-1.5 text-center",
                        ri !== lastRow && "border-b",
                        ci !== lastCol && "border-r",
                        borderColor,
                        tint
                          ? clsx(marginCellTint, "font-semibold")
                          : isFirst
                            ? clsx(firstColTint, "font-semibold text-[11px] uppercase tracking-wide")
                            : "bg-card text-ink",
                      )}
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
