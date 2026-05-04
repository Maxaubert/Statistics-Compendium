import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Banner } from "@/components/shell/Banner";
import { TabBar } from "@/components/shell/TabBar";
import { SearchBox } from "@/components/list/SearchBox";
import { FilterSidebar } from "@/components/list/FilterSidebar";
import { ActiveFilterPills } from "@/components/list/ActiveFilterPills";
import { EntryTable } from "@/components/list/EntryTable";
import { TableCard } from "@/components/tables/TableCard";
import { loadAllContent } from "@/data/loadContent";
import {
  buildConceptSearchIndex,
  buildSearchIndex,
} from "@/data/search";
import { useFilteredContent } from "@/hooks/useFilteredContent";

const CROSS_HIT_CAP = 8;

export function ListView() {
  const data = loadAllContent();
  const navigate = useNavigate();
  const [tab, setTab] = useState("formler");
  const [conceptQuery, setConceptQuery] = useState("");

  const {
    filtered,
    counts,
    selection,
    query,
    setQuery,
    toggle,
    remove,
    clear,
  } = useFilteredContent(data.entries);

  const conceptFuse = useMemo(
    () => buildConceptSearchIndex(data.concepts),
    [data.concepts],
  );
  const entryFuse = useMemo(
    () => buildSearchIndex(data.entries),
    [data.entries],
  );

  const filteredConcepts = useMemo(() => {
    const q = conceptQuery.trim();
    if (!q) return data.concepts;
    return conceptFuse.search(q).map((h) => h.item);
  }, [conceptQuery, conceptFuse, data.concepts]);

  // Cross-tab hits: when searching one tab, show top hits from the other.
  // Capped so the cross-section never dominates the page; user clicks
  // through to the proper tab if they want the full list.
  const crossConceptHits = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return conceptFuse.search(q).slice(0, CROSS_HIT_CAP).map((h) => h.item);
  }, [query, conceptFuse]);
  const crossEntryHits = useMemo(() => {
    const q = conceptQuery.trim();
    if (!q) return [];
    return entryFuse.search(q).slice(0, CROSS_HIT_CAP).map((h) => h.item);
  }, [conceptQuery, entryFuse]);

  const activePills = Object.entries(selection).flatMap(([dim, vals]) =>
    (vals ?? []).map((optionKey) => {
      const dimDef = data.filters.dimensions.find((d) => d.key === dim);
      const opt = dimDef?.options.find((o) => o.key === optionKey);
      return { dim, optionKey, label: opt?.label_no ?? optionKey };
    })
  );

  const showSidebar = tab === "formler";

  return (
    <div data-testid="list-view" className="min-h-screen bg-paper">
      <Banner />
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {showSidebar ? (
          <FilterSidebar
            filters={data.filters}
            selection={selection}
            counts={counts}
            onToggle={toggle}
            onClear={clear}
          />
        ) : (
          <div aria-hidden className="hidden md:block bg-paper border-r border-line" />
        )}
        <main className="bg-card px-7 py-5">
          <TabBar
            tabs={[
              { key: "formler", label: "Formler", count: data.entries.length },
              { key: "konsepter", label: "Konsepter", count: data.concepts.length },
              { key: "tabeller", label: "Tabeller", count: data.tables.length },
            ]}
            active={tab}
            onChange={(key) => {
              setTab(key);
              setQuery("");
              setConceptQuery("");
            }}
          />

          {tab === "formler" && (
            <>
              <SearchBox
                value={query}
                onChange={setQuery}
                placeholder="Søk i navn, symboler, kjennetegn, eksempler..."
              />
              <div className="mb-3.5 flex items-start justify-between border-b border-line pb-3.5">
                <div>
                  <p className="text-[13px] text-ink-3">
                    <strong className="mr-1 font-serif text-[17px] font-semibold text-ink">
                      {filtered.length}
                    </strong>
                    treff av {data.entries.length} oppføringer
                  </p>
                  <ActiveFilterPills items={activePills} onRemove={remove} />
                </div>
              </div>
              <EntryTable entries={filtered} onRowClick={(id) => navigate(`/entry/${id}`)} />

              {query.trim().length > 0 && crossConceptHits.length > 0 && (
                <CrossSearchSection
                  title="Konsepter som også matcher"
                  items={crossConceptHits.map((c) => ({
                    id: c.id,
                    name_no: c.name_no,
                    tagline: c.tagline,
                    href: `/concept/${c.id}`,
                  }))}
                  onSelect={(href) => navigate(href)}
                />
              )}
            </>
          )}

          {tab === "konsepter" && (
            <>
              <SearchBox
                value={conceptQuery}
                onChange={setConceptQuery}
                placeholder="Søk i konsepter (navn, kjennetegn, beskrivelse)..."
              />
              <div className="mb-3.5 flex items-start justify-between border-b border-line pb-3.5">
                <p className="text-[13px] text-ink-3">
                  <strong className="mr-1 font-serif text-[17px] font-semibold text-ink">
                    {filteredConcepts.length}
                  </strong>
                  {conceptQuery.trim().length > 0
                    ? `treff av ${data.concepts.length} konsepter`
                    : "konsepter"}
                </p>
              </div>
              {filteredConcepts.length === 0 ? (
                <p className="py-6 text-center text-[14px] text-ink-3">
                  Ingen konsepter matcher søket.
                </p>
              ) : (
                <ul className="m-0 grid list-none gap-2 p-0">
                  {filteredConcepts.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => navigate(`/concept/${c.id}`)}
                      className="cursor-pointer rounded-lg border border-line bg-card px-5 py-3.5 hover:border-primary-2"
                    >
                      <div className="font-serif text-base font-semibold text-ink">{c.name_no}</div>
                      <div className="text-[13px] italic text-ink-3">{c.tagline}</div>
                    </li>
                  ))}
                </ul>
              )}

              {conceptQuery.trim().length > 0 && crossEntryHits.length > 0 && (
                <CrossSearchSection
                  title="Formler som også matcher"
                  items={crossEntryHits.map((e) => ({
                    id: e.id,
                    name_no: e.name_no,
                    tagline: e.tagline,
                    href: `/entry/${e.id}`,
                  }))}
                  onSelect={(href) => navigate(href)}
                />
              )}
            </>
          )}

          {tab === "tabeller" && (
            <>
              <div className="mb-4 rounded-r-md border-l-[3px] border-primary-2 bg-primary-soft px-3.5 py-2.5 font-serif text-[13px] text-primary">
                Tabellene er interaktive. Klikk for å slå opp en verdi direkte.
              </div>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {data.tables.map((t) => (
                  <TableCard key={t.id} table={t} onClick={() => navigate(`/table/${t.id}`)} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

interface CrossItem {
  id: string;
  name_no: string;
  tagline: string;
  href: string;
}

/**
 * Secondary "matches from the other tab" list. Visually subordinate
 * to the main tab's results — smaller cards, soft background, muted
 * heading — so the eye reads it as a "by the way, also see…" rather
 * than competing with the primary results.
 */
function CrossSearchSection({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: CrossItem[];
  onSelect: (href: string) => void;
}) {
  return (
    <section className="mt-8 rounded-xl border border-dashed border-line bg-paper-2/50 px-4 py-4">
      <h3 className="mb-3 flex items-baseline gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
        <span>{title}</span>
        <span className="rounded-full bg-primary-2/15 px-1.5 py-px text-[10px] tracking-normal text-primary-2">
          {items.length}
        </span>
      </h3>
      <ul className="m-0 grid list-none gap-1.5 p-0">
        {items.map((it) => (
          <li
            key={it.id}
            onClick={() => onSelect(it.href)}
            className="group cursor-pointer rounded-md border border-line bg-card px-3.5 py-2 hover:border-primary-2"
          >
            <div className="flex items-baseline gap-3">
              <div className="font-serif text-[14px] font-medium text-ink group-hover:text-primary-2">
                {it.name_no}
              </div>
              <div className="flex-1 truncate text-[12.5px] italic text-ink-3">
                {it.tagline}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
