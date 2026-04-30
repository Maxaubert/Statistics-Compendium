import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";
import type { GlossaryTerm } from "@/data/schema";

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
      return "/";
  }
}

interface ModalProps {
  term: GlossaryTerm;
  onClose: () => void;
}

function GlossaryModal({ term, onClose }: ModalProps) {
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
      aria-label={`Detaljer for termen ${term.term_no}`}
    >
      <button
        type="button"
        aria-label="Lukk"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50"
      />
      <div className="relative max-h-full w-full max-w-[640px] overflow-y-auto rounded-xl border border-line bg-card p-7 shadow-2xl">
        <button
          type="button"
          aria-label="Lukk"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink"
        >
          <X size={18} />
        </button>
        <h2 className="m-0 border-b border-line pb-3 font-serif text-[28px] font-semibold text-ink">
          {term.term_no}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink">
          {term.short_def}
        </p>
        {term.long_def && (
          <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ink-2">
            {term.long_def}
          </p>
        )}
        {term.see_also && term.see_also.length > 0 && (
          <div className="mt-5 border-t border-line pt-3 text-[13px] text-ink-3">
            Se også:{" "}
            {term.see_also.map((r, i) => (
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
      {open && <GlossaryModal term={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
