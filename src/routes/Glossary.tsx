import { useMemo, useState } from "react";
import { Banner } from "@/components/shell/Banner";
import { GlossaryPopup } from "@/components/detail/GlossaryPopup";
import { loadAllContent } from "@/data/loadContent";

export function Glossary() {
  const data = loadAllContent();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

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

  const open = openId ? data.glossary.find((t) => t.id === openId) ?? null : null;

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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setOpenId(t.id)}
              aria-label={`Vis definisjon av ${t.term_no}`}
              className="group flex min-h-[110px] items-center justify-center rounded-xl border border-line bg-paper-2 px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-primary-3 hover:bg-card hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-3"
            >
              <span className="font-serif text-[18px] font-semibold leading-tight text-ink group-hover:text-primary">
                {t.term_no}
              </span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-8 text-center text-ink-3">Ingen treff for "{query}".</p>
        )}
      </main>
      {open && <GlossaryPopup term={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
