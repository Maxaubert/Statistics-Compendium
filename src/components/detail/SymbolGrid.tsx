import { renderInlineCode } from "./inline-code";

interface SymbolItem {
  sym: string;
  means: string;
}

export function SymbolGrid({ symbols }: { symbols: SymbolItem[] }) {
  return (
    <div
      className="grid gap-y-2.5 gap-x-5 rounded-lg border border-line bg-paper-2 px-5 py-4"
      style={{ gridTemplateColumns: "90px 1fr" }}
    >
      {symbols.map((s, i) => (
        <div key={i} className="contents">
          <span className="text-center font-math text-[22px] font-medium leading-tight text-primary">
            {renderInlineCode(s.sym, "light")}
          </span>
          <span className="self-center text-[14px] leading-snug text-ink-2">
            {renderInlineCode(s.means, "light")}
          </span>
        </div>
      ))}
    </div>
  );
}
