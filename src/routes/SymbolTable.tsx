import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";
import type { Entry, SymbolEntry } from "@/data/schema";

// Aggregate curated symbols + a fallback built from entry.symbols[].
// Curated wins; fallback fills gaps so the grid stays comprehensive.
function aggregateSymbols(): SymbolEntry[] {
  const data = loadAllContent();

  // Index curated by sym so we can de-duplicate against the fallback.
  const curatedBySym = new Map<string, SymbolEntry>();
  for (const s of data.symbols) {
    curatedBySym.set(s.sym, s);
  }

  // Build fallbacks from entries
  const fallbackMap = new Map<string, { meanings: Map<string, Entry[]> }>();
  for (const entry of data.entries) {
    for (const s of entry.symbols ?? []) {
      if (curatedBySym.has(s.sym)) continue; // curated already covers this
      const slot = fallbackMap.get(s.sym) ?? { meanings: new Map() };
      const list = slot.meanings.get(s.means) ?? [];
      list.push(entry);
      slot.meanings.set(s.means, list);
      fallbackMap.set(s.sym, slot);
    }
  }

  const fallbacks: SymbolEntry[] = Array.from(fallbackMap.entries()).map(
    ([sym, { meanings }]) => {
      const meaningArr = Array.from(meanings.entries());
      const id = `auto-${sym}`;
      return {
        id,
        sym,
        short_def: meaningArr.map(([m]) => m).join(" / "),
        contexts: [
          {
            usage: "Brukt i oppføringer",
            detail: meaningArr
              .map(([m, es]) => `${m} (i ${es.map((e) => e.name_no).join(", ")})`)
              .join("; "),
            entry_refs: meaningArr.flatMap(([, es]) => es.map((e) => e.id)),
          },
        ],
      };
    },
  );

  const all = [...data.symbols, ...fallbacks];
  return all.sort((a, b) => a.sym.localeCompare(b.sym, "nb"));
}

function lookupEntryName(id: string): string | null {
  const data = loadAllContent();
  return data.entries.find((e) => e.id === id)?.name_no ?? null;
}

function relatedRefPath(kind: string, id: string): string {
  switch (kind) {
    case "entry":
      return `/entry/${id}`;
    case "concept":
      return `/concept/${id}`;
    case "table":
      return `/table/${id}`;
    case "pattern":
      return `/monstre/${id}`;
    case "glossary":
      return `/ordliste#${id}`;
    default:
      return `/`;
  }
}

interface ModalProps {
  symbol: SymbolEntry;
  onClose: () => void;
}

function SymbolModal({ symbol, onClose }: ModalProps) {
  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Detaljer for symbolet ${symbol.sym}`}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Lukk"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50"
      />
      {/* dialog */}
      <div className="relative max-h-full w-full max-w-[640px] overflow-y-auto rounded-xl border border-line bg-card p-7 shadow-2xl">
        <button
          type="button"
          aria-label="Lukk"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink"
        >
          <X size={18} />
        </button>
        <div className="flex items-baseline gap-4 border-b border-line pb-4">
          <span className="font-math text-[56px] font-medium leading-none text-primary">
            {symbol.sym}
          </span>
          <span className="font-serif text-[15px] italic text-ink-3">
            {symbol.short_def}
          </span>
        </div>

        <div className="mt-5 space-y-5">
          {symbol.contexts.map((ctx, i) => (
            <section key={i}>
              <h3 className="m-0 mb-1 font-serif text-[16px] font-semibold text-ink">
                {ctx.usage}
              </h3>
              <p className="m-0 whitespace-pre-line text-[14px] leading-relaxed text-ink-2">
                {ctx.detail}
              </p>
              {ctx.entry_refs && ctx.entry_refs.length > 0 && (
                <div className="mt-2 text-[12.5px] text-ink-3">
                  Brukt i:{" "}
                  {ctx.entry_refs.map((ref, j) => {
                    const name = lookupEntryName(ref);
                    if (!name) return null;
                    return (
                      <span key={ref}>
                        {j > 0 && ", "}
                        <Link
                          to={`/entry/${ref}`}
                          className="text-primary-2 underline"
                          onClick={onClose}
                        >
                          {name}
                        </Link>
                      </span>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>

        {symbol.see_also && symbol.see_also.length > 0 && (
          <div className="mt-6 border-t border-line pt-4 text-[12.5px] text-ink-3">
            Se også:{" "}
            {symbol.see_also.map((r, i) => (
              <span key={`${r.kind}-${r.id}`}>
                {i > 0 && ", "}
                <Link
                  to={relatedRefPath(r.kind, r.id)}
                  className="text-primary-2 underline"
                  onClick={onClose}
                >
                  {r.id}
                </Link>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SymbolTable() {
  const symbols = useMemo(() => aggregateSymbols(), []);
  const [openId, setOpenId] = useState<string | null>(null);

  const open = openId ? symbols.find((s) => s.id === openId) ?? null : null;

  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="bg-card px-12 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Symboler
        </h1>
        <p className="mb-8 font-serif italic text-ink-3">
          Klikk et symbol for å se hva det betyr i ulike sammenhenger. Mange
          symboler har flere betydninger — for eksempel betyr α både
          signifikansnivå og konstantledd, og β både stigningstall og
          sannsynligheten for type-2-feil.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {symbols.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpenId(s.id)}
              aria-label={`Vis detaljer for ${s.sym}`}
              className="group flex min-h-[120px] items-center justify-center rounded-xl border border-line bg-paper-2 p-4 text-center transition hover:-translate-y-0.5 hover:border-primary-3 hover:bg-card hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-3"
            >
              <span className="font-math whitespace-nowrap text-[40px] font-medium leading-none text-primary group-hover:text-primary-2">
                {s.sym}
              </span>
            </button>
          ))}
        </div>
      </main>
      {open && <SymbolModal symbol={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
