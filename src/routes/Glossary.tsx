import { useState } from "react";
import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";

export function Glossary() {
  const data = loadAllContent();
  const [query, setQuery] = useState("");
  const filtered = data.glossary
    .filter((t) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        t.term_no.toLowerCase().includes(q) ||
        t.short_def.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.term_no.localeCompare(b.term_no, "nb"));

  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[820px] bg-card px-12 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Ordliste
        </h1>
        <p className="mb-6 font-serif italic text-ink-3">
          Norske statistiske termer i klartekst — for når du gjenkjenner ordet
          fra eksamen og må finne ut hva det betyr.
        </p>
        <input
          type="search"
          placeholder="Søk i termene..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 w-full rounded-md border border-line bg-paper-2 px-4 py-2 text-[14px]"
        />
        <dl className="m-0 space-y-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border border-line bg-paper-2 px-5 py-4"
            >
              <dt className="font-serif text-[18px] font-semibold text-ink">
                {t.term_no}
              </dt>
              <dd className="m-0 mt-1 text-[14px] text-ink-2">
                {t.short_def}
              </dd>
              {t.long_def && (
                <dd className="m-0 mt-2 whitespace-pre-line text-[13px] text-ink-3">
                  {t.long_def}
                </dd>
              )}
              {t.see_also && t.see_also.length > 0 && (
                <dd className="m-0 mt-2 text-[12px] text-ink-3">
                  Se også:{" "}
                  {t.see_also.map((r, i) => {
                    const path =
                      r.kind === "entry"
                        ? `/entry/${r.id}`
                        : r.kind === "concept"
                          ? `/concept/${r.id}`
                          : r.kind === "table"
                            ? `/table/${r.id}`
                            : `/ordliste#${r.id}`;
                    return (
                      <span key={r.id}>
                        {i > 0 && ", "}
                        <Link to={path} className="text-primary-2 underline">
                          {r.id}
                        </Link>
                      </span>
                    );
                  })}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
