import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";

interface SymbolUsage {
  sym: string;
  meanings: { means: string; entries: { id: string; name: string }[] }[];
}

function aggregate(): SymbolUsage[] {
  const data = loadAllContent();
  // sym → meaning → list of entries
  const map = new Map<string, Map<string, { id: string; name: string }[]>>();
  for (const entry of data.entries) {
    for (const s of entry.symbols ?? []) {
      const meaningMap = map.get(s.sym) ?? new Map();
      const list = meaningMap.get(s.means) ?? [];
      list.push({ id: entry.id, name: entry.name_no });
      meaningMap.set(s.means, list);
      map.set(s.sym, meaningMap);
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, "nb"))
    .map(([sym, meaningMap]) => ({
      sym,
      meanings: Array.from(meaningMap.entries()).map(([means, entries]) => ({
        means,
        entries,
      })),
    }));
}

export function SymbolTable() {
  const symbols = aggregate();
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[920px] bg-card px-14 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Symboler
        </h1>
        <p className="mb-8 font-serif italic text-ink-3">
          Alle symboler som dukker opp på tvers av oppføringer, samlet i én
          tabell. Trykk på en oppføring for å se symbolet i kontekst.
        </p>
        <div className="space-y-6">
          {symbols.map((s) => (
            <section
              key={s.sym}
              className="rounded-lg border border-line bg-paper-2 px-5 py-4"
            >
              <div className="mb-2 font-math text-[28px] font-medium text-primary">
                {s.sym}
              </div>
              <ul className="m-0 list-none space-y-2 p-0">
                {s.meanings.map((m, i) => (
                  <li key={i} className="text-[14px] text-ink-2">
                    <div>{m.means}</div>
                    <div className="mt-1 text-[12px] text-ink-3">
                      Brukt i:{" "}
                      {m.entries.map((e, j) => (
                        <span key={e.id}>
                          {j > 0 && ", "}
                          <Link
                            to={`/entry/${e.id}`}
                            className="text-primary-2 underline"
                          >
                            {e.name}
                          </Link>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
