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
        <ul className="m-0 grid list-none grid-cols-1 gap-1.5 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((t) => (
            <li
              key={t.id}
              onClick={() => setOpenId(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenId(t.id);
                }
              }}
              aria-label={`Vis definisjon av ${t.term_no}`}
              className="group cursor-pointer rounded-md border border-line bg-card px-3.5 py-2 hover:border-primary-2"
            >
              <div className="truncate font-serif text-[14px] font-medium text-ink group-hover:text-primary-2">
                {t.term_no}
              </div>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="mt-8 text-center text-ink-3">Ingen treff for "{query}".</p>
        )}
      </main>
      {open && <GlossaryPopup term={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
