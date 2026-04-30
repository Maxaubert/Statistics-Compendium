import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { Math } from "@/components/primitives/Math";
import { loadAllContent } from "@/data/loadContent";

export function Cheatsheet() {
  const data = loadAllContent();
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[1100px] bg-card px-10 py-8">
        <header className="mb-6 flex items-baseline justify-between border-b-2 border-paper-2 pb-4">
          <h1 className="m-0 font-serif text-[32px] font-semibold text-ink">
            Cheat-sheet
          </h1>
          <span className="text-[12px] text-ink-3">
            {data.entries.length} formler · skriv ut med Ctrl/Cmd+P
          </span>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.entries.map((e) => (
            <Link
              key={e.id}
              to={`/entry/${e.id}`}
              className="rounded-lg border border-line bg-paper-2 px-4 py-3 no-underline hover:border-primary-2"
            >
              <div className="font-serif text-[15px] font-semibold text-ink">
                {e.name_no}
              </div>
              <div className="my-1.5 text-[13px] italic text-ink-3">
                {e.tagline}
              </div>
              <div className="mt-2 overflow-x-auto rounded bg-card px-2 py-1.5 text-[13px] text-ink">
                <Math latex={e.formula_latex} />
              </div>
              {e.symbols && e.symbols.length > 0 && (
                <div className="mt-2 text-[11px] font-mono text-ink-3">
                  {e.symbols
                    .slice(0, 4)
                    .map((s) => s.sym)
                    .join(" · ")}
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
