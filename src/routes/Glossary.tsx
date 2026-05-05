import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { Modal } from "@/components/shell/Modal";
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
  return (
    <Modal ariaLabel={`Detaljer for termen ${term.term_no}`} onClose={onClose}>
      <header
        className="border-b px-7 py-5"
        style={{ borderColor: "var(--color-calc-border)" }}
      >
        <div
          className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--color-calc-label)" }}
        >
          Term
        </div>
        <h2 className="m-0 mt-0.5 font-serif text-[28px] font-semibold text-white">
          {term.term_no}
        </h2>
      </header>

      <section className="px-7 pt-5">
        <p
          className="m-0 text-[15px] leading-relaxed"
          style={{ color: "var(--color-calc-text)" }}
        >
          {term.short_def}
        </p>
      </section>

      {term.long_def && (
        <section className="px-7 pt-4">
          <p
            className="m-0 whitespace-pre-line text-[14px] leading-relaxed"
            style={{ color: "var(--color-calc-text)", opacity: 0.85 }}
          >
            {term.long_def}
          </p>
        </section>
      )}

      <div className="px-7 pb-7 pt-5">
        {term.see_also && term.see_also.length > 0 && (
          <div
            className="border-t pt-4 text-[13px]"
            style={{
              borderColor: "var(--color-calc-divider)",
              color: "var(--color-calc-text)",
            }}
          >
            <span
              className="mr-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-calc-label)" }}
            >
              Se også
            </span>
            {term.see_also.map((r, i) => (
              <span key={`${r.kind}-${r.id}`}>
                {i > 0 && ", "}
                <Link
                  to={relatedRefPath(r.kind, r.id)}
                  className="underline hover:no-underline"
                  style={{ color: "var(--color-calc-lookup-border)" }}
                  onClick={onClose}
                >
                  {r.id}
                </Link>
              </span>
            ))}
          </div>
        )}
      </div>
    </Modal>
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
