import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Banner } from "@/components/shell/Banner";
import { TabBar } from "@/components/shell/TabBar";
import { SearchBox } from "@/components/list/SearchBox";
import { FilterSidebar } from "@/components/list/FilterSidebar";
import { ActiveFilterPills } from "@/components/list/ActiveFilterPills";
import { EntryTable } from "@/components/list/EntryTable";
import { loadAllContent } from "@/data/loadContent";
import { useFilteredContent } from "@/hooks/useFilteredContent";

export function ListView() {
  const data = loadAllContent();
  const navigate = useNavigate();
  const [tab, setTab] = useState("formler");

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

  const activePills = Object.entries(selection).flatMap(([dim, vals]) =>
    (vals ?? []).map((optionKey) => {
      const dimDef = data.filters.dimensions.find((d) => d.key === dim);
      const opt = dimDef?.options.find((o) => o.key === optionKey);
      return { dim, optionKey, label: opt?.label_no ?? optionKey };
    })
  );

  return (
    <div data-testid="list-view" className="min-h-screen bg-paper">
      <Banner />
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <FilterSidebar
          filters={data.filters}
          selection={selection}
          counts={counts}
          onToggle={toggle}
          onClear={clear}
        />
        <main className="bg-card px-7 py-5">
          <TabBar
            tabs={[
              { key: "formler", label: "Formler", count: data.entries.length },
              { key: "konsepter", label: "Konsepter", count: data.concepts.length },
              { key: "tabeller", label: "Tabeller", count: data.tables.length },
            ]}
            active={tab}
            onChange={setTab}
          />
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
        </main>
      </div>
    </div>
  );
}
