import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, RotateCcw } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";
import type { WizardOption } from "@/data/schema";

export function Wizard() {
  const data = loadAllContent();
  const tree = data.wizard;
  const [path, setPath] = useState<string[]>(tree ? [tree.start] : []);
  const [terminal, setTerminal] = useState<WizardOption | null>(null);

  if (!tree) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="p-12 text-center font-serif text-ink-3">
          Veiviseren er ikke tilgjengelig.
        </main>
      </div>
    );
  }

  const currentId = path[path.length - 1];
  const currentNode = tree.nodes.find((n) => n.id === currentId);

  function pick(opt: WizardOption) {
    if (opt.next) {
      setPath((p) => [...p, opt.next!]);
    } else if (opt.leads_to) {
      setTerminal(opt);
    }
  }

  function reset() {
    setPath([tree!.start]);
    setTerminal(null);
  }

  function back() {
    if (terminal) {
      setTerminal(null);
      return;
    }
    setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
  }

  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[720px] bg-card px-12 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Veiviser
        </h1>
        <p className="mb-6 font-serif italic text-ink-3">
          Svar på spørsmålene under for å finne riktig fordeling eller test.
        </p>

        <div className="mb-4 flex gap-2 text-[12px] text-ink-3">
          <button
            type="button"
            onClick={back}
            disabled={path.length <= 1 && !terminal}
            className="rounded-md border border-line bg-paper-2 px-2 py-1 disabled:opacity-50"
          >
            ← Tilbake
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 rounded-md border border-line bg-paper-2 px-2 py-1"
          >
            <RotateCcw size={12} /> Start på nytt
          </button>
        </div>

        {terminal ? (
          <section className="rounded-lg border border-primary-2 bg-primary-soft px-6 py-5">
            <div className="mb-2 font-serif text-[18px] font-semibold text-primary">
              Anbefalt:
            </div>
            <ul className="m-0 list-none space-y-2 p-0">
              {terminal.leads_to!.map((r) => {
                const name =
                  r.kind === "entry"
                    ? data.entries.find((e) => e.id === r.id)?.name_no
                    : r.kind === "concept"
                      ? data.concepts.find((c) => c.id === r.id)?.name_no
                      : r.id;
                const to =
                  r.kind === "entry"
                    ? `/entry/${r.id}`
                    : r.kind === "concept"
                      ? `/concept/${r.id}`
                      : `/table/${r.id}`;
                return (
                  <li key={r.id}>
                    <Link
                      to={to}
                      className="flex items-center gap-2 rounded-md border border-line bg-card px-4 py-2 no-underline hover:border-primary-2"
                    >
                      <ChevronRight size={16} className="text-primary-2" />
                      <span className="font-serif text-[15px] font-semibold text-ink">
                        {name ?? r.id}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : currentNode ? (
          <section>
            <div className="mb-4 font-serif text-[20px] font-medium leading-snug text-ink">
              {currentNode.question}
            </div>
            <ul className="m-0 list-none space-y-2 p-0">
              {currentNode.options.map((opt, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pick(opt)}
                    className="flex w-full items-center gap-2 rounded-md border border-line bg-paper-2 px-4 py-3 text-left text-[14px] hover:border-primary-2"
                  >
                    <ChevronRight size={16} className="text-primary-2" />
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="text-ink-3">Ugyldig node-id.</p>
        )}
      </main>
    </div>
  );
}
