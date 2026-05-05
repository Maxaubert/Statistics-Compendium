import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Banner } from "@/components/shell/Banner";
import { SearchBox } from "@/components/list/SearchBox";
import { FilterSidebar } from "@/components/list/FilterSidebar";
import { ActiveFilterPills } from "@/components/list/ActiveFilterPills";
import { EntryTable } from "@/components/list/EntryTable";
import { TableCard } from "@/components/tables/TableCard";
import { loadAllContent } from "@/data/loadContent";
import {
  buildGlossarySearchIndex,
  searchGlossary,
} from "@/data/search";
import { GlossaryPopupProvider, useGlossaryPopup } from "@/components/detail/GlossaryPopup";
import { useFilteredContent } from "@/hooks/useFilteredContent";

const CROSS_HIT_CAP = 8;
const VALID_TABS = new Set(["formler", "tabeller"]);

/**
 * Ids of the three "oversikt" entries that get a small featured panel
 * at the top of the formler tab. They live in the same list as every
 * other entry, but the panel surfaces them so users can find the
 * "what does varians/standardavvik/forventningsverdi mean" reading
 * without scrolling through the table.
 */
const OVERVIEW_ENTRY_IDS = [
  "varians-oversikt",
  "standardavvik-oversikt",
  "forventningsverdi-oversikt",
] as const;

export function ListView() {
  const data = loadAllContent();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawTab = searchParams.get("tab") ?? "formler";
  const tab = VALID_TABS.has(rawTab) ? rawTab : "formler";

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

  useEffect(() => {
    setQuery("");
  }, [tab, setQuery]);

  const glossaryFuse = useMemo(
    () => buildGlossarySearchIndex(data.glossary),
    [data.glossary],
  );

  // Cross-search: when the user types in the formler tab, surface
  // glossary terms that also match. Capped so the cross-section
  // never dominates.
  const crossGlossaryHitsForFormler = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return searchGlossary(glossaryFuse, q).slice(0, CROSS_HIT_CAP).map((h) => h.item);
  }, [query, glossaryFuse]);

  const overviewEntries = useMemo(() => {
    return OVERVIEW_ENTRY_IDS
      .map((id) => data.entries.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));
  }, [data.entries]);

  const activePills = Object.entries(selection).flatMap(([dim, vals]) =>
    (vals ?? []).map((optionKey) => {
      const dimDef = data.filters.dimensions.find((d) => d.key === dim);
      const opt = dimDef?.options.find((o) => o.key === optionKey);
      return { dim, optionKey, label: opt?.label_no ?? optionKey };
    })
  );

  const showSidebar = tab === "formler";
  const showOverviews = tab === "formler" && query.trim().length === 0 && overviewEntries.length > 0;

  return (
    <GlossaryPopupProvider glossary={data.glossary}>
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
          {tab === "formler" && (
            <>
              <SearchBox
                value={query}
                onChange={setQuery}
                placeholder="Søk i navn, symboler, kjennetegn, eksempler..."
              />
              {showOverviews && (
                <OverviewSection entries={overviewEntries} />
              )}
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

              {query.trim().length > 0 && crossGlossaryHitsForFormler.length > 0 && (
                <GlossaryCrossSection
                  items={crossGlossaryHitsForFormler.map((g) => ({
                    id: g.id,
                    term_no: g.term_no,
                    short_def: g.short_def,
                  }))}
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
    </GlossaryPopupProvider>
  );
}

interface OverviewEntry {
  id: string;
  name_no: string;
  tagline: string;
}

/**
 * Featured "Oversikter" section at the top of the formler tab. Pulls
 * the three overview entries out of the main table so users can find
 * the "what does varians/standardavvik/forventningsverdi mean" reading
 * without scrolling. Visually subordinate (subtle accent, smaller cards)
 * — it leads the page but doesn't compete with the main table.
 */
function OverviewSection({ entries }: { entries: OverviewEntry[] }) {
  return (
    <section
      data-testid="oversikter-section"
      className="mb-5 rounded-xl border border-amber-200/70 bg-amber-50/40 px-4 py-4"
    >
      <h3 className="mb-3 flex items-baseline gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-900/70">
        <span>Oversikter</span>
        <span className="rounded-full bg-amber-200/60 px-1.5 py-px text-[10px] tracking-normal text-amber-900">
          {entries.length}
        </span>
      </h3>
      <ul className="m-0 grid list-none gap-1.5 p-0 sm:grid-cols-3">
        {entries.map((e) => (
          <li key={e.id} className="m-0">
            <Link
              to={`/entry/${e.id}`}
              className="group block rounded-md border border-amber-200/70 bg-card px-3.5 py-2 no-underline hover:border-amber-400"
            >
              <div className="font-serif text-[14px] font-medium text-ink group-hover:text-amber-900">
                {e.name_no}
              </div>
              <div className="truncate text-[12.5px] italic text-ink-3">
                {e.tagline}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface GlossaryCrossItem {
  id: string;
  term_no: string;
  short_def: string;
}

function GlossaryCrossSection({ items }: { items: GlossaryCrossItem[] }) {
  const popup = useGlossaryPopup();
  return (
    <section className="mt-8 rounded-xl border border-dashed border-line bg-paper-2/50 px-4 py-4">
      <h3 className="mb-3 flex items-baseline gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
        <span>Termer som også matcher</span>
        <span className="rounded-full bg-primary-2/15 px-1.5 py-px text-[10px] tracking-normal text-primary-2">
          {items.length}
        </span>
      </h3>
      <ul className="m-0 grid list-none grid-cols-1 gap-1.5 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <li
            key={it.id}
            onClick={() => popup?.openTerm(it.id)}
            className="group cursor-pointer rounded-md border border-line bg-card px-3.5 py-2 hover:border-primary-2"
          >
            <div className="truncate font-serif text-[14px] font-medium text-ink group-hover:text-primary-2">
              {it.term_no}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
