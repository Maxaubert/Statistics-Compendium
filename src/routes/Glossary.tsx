import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import {
  GlossaryPopupProvider,
  useGlossaryPopup,
} from "@/components/detail/GlossaryPopup";
import { loadAllContent } from "@/data/loadContent";
import { buildSearchIndex, searchEntries } from "@/data/search";

const CROSS_HIT_CAP = 16;

export function Glossary() {
  const data = loadAllContent();
  return (
    <GlossaryPopupProvider glossary={data.glossary}>
      <GlossaryInner />
    </GlossaryPopupProvider>
  );
}

function GlossaryInner() {
  const data = loadAllContent();
  const popup = useGlossaryPopup();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      data.glossary
        .filter((t) => {
          if (!query.trim()) return true;
          const q = query.toLowerCase();
          return (
            t.term_no.toLowerCase().includes(q) ||
            t.short_def.toLowerCase().includes(q)
          );
        })
        .sort((a, b) => a.term_no.localeCompare(b.term_no, "nb")),
    [data.glossary, query],
  );

  const entryFuse = useMemo(
    () => buildSearchIndex(data.entries),
    [data.entries],
  );
  const crossEntryHits = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return searchEntries(entryFuse, q).slice(0, CROSS_HIT_CAP).map((h) => h.item);
  }, [query, entryFuse]);

  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="bg-card px-12 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Ordliste
        </h1>
        <p className="mb-5 font-serif italic text-ink-3">
          Klikk en term for å se definisjonen. Søk for å filtrere.
        </p>
        <input
          type="search"
          placeholder="Søk i termene..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 w-full rounded-md border border-line bg-paper-2 px-4 py-2 text-[14px] text-ink"
        />
        <ul className="m-0 grid list-none grid-cols-1 gap-1.5 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((t) => (
            <li
              key={t.id}
              onClick={() => popup?.openTerm(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  popup?.openTerm(t.id);
                }
              }}
              aria-label={`Vis definisjon av ${t.term_no}`}
              className="group cursor-pointer rounded-md border border-line bg-card px-3.5 py-2 hover:border-primary-2"
            >
              <div className="truncate text-center font-serif text-[14px] font-medium text-ink group-hover:text-primary-2">
                {t.term_no}
              </div>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="mt-8 text-center text-ink-3">Ingen treff for "{query}".</p>
        )}

        {crossEntryHits.length > 0 && (
          <section className="mt-8 rounded-xl border border-dashed border-line bg-paper-2/50 px-4 py-4">
            <h3 className="mb-3 flex items-baseline gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              <span>Formler og konsepter som også matcher</span>
              <span className="rounded-full bg-primary-2/15 px-1.5 py-px text-[10px] tracking-normal text-primary-2">
                {crossEntryHits.length}
              </span>
            </h3>
            <ul className="m-0 grid list-none grid-cols-1 gap-1.5 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {crossEntryHits.map((e) => (
                <li key={e.id} className="m-0">
                  <Link
                    to={`/entry/${e.id}`}
                    className="group block rounded-md border border-line bg-card px-3.5 py-2 no-underline hover:border-primary-2"
                  >
                    <div className="truncate text-center font-serif text-[14px] font-medium text-ink group-hover:text-primary-2">
                      {e.name_no}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
