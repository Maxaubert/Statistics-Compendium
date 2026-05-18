import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ExternalLink, Search } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { StepByStep } from "@/components/detail/StepByStep";
import { renderInlineCode } from "@/components/detail/inline-code";
import { loadAllContent } from "@/data/loadContent";
import {
  VANSKELIGE_OPPGAVER,
  type VanskeligOppgave,
} from "@/data/vanskelige-oppgaver";

/**
 * "Vanskelige oppgaver" — kurert liste over vriende eksamensdeloppgaver
 * der ordlyden gjorde det krevende å se hvilken formel som passet.
 * Ikke nye konsepter; bare hjelp på eksamensdagen til å gjenkjenne
 * problemtypen og hoppe til riktig formelside.
 *
 * Hver oppgave er identifisert av to uavhengige agentvurderinger
 * (dobbel-agent-snitt) av faktiske ITD20218-eksamener, og har:
 *  - sitat fra oppgaveteksten
 *  - kort forklaring av hvorfor ordlyden er vrien
 *  - lenke til riktig formelside (+ evt. fane)
 *  - steg-for-steg-løsning som student kan følge direkte
 */
export function HelpVanskelige() {
  const { entries } = loadAllContent();
  const [query, setQuery] = useState("");
  const [examFilter, setExamFilter] = useState<string | null>(null);

  const exams = useMemo(() => {
    const seen = new Map<string, string>();
    for (const t of VANSKELIGE_OPPGAVER) seen.set(t.exam, t.exam_label);
    return Array.from(seen.entries());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VANSKELIGE_OPPGAVER.filter((t) => {
      if (examFilter && t.exam !== examFilter) return false;
      if (!q) return true;
      return (
        t.task.toLowerCase().includes(q) ||
        t.topic.toLowerCase().includes(q) ||
        t.quote.toLowerCase().includes(q) ||
        t.why_tricky.toLowerCase().includes(q) ||
        t.formula_entry.toLowerCase().includes(q)
      );
    });
  }, [query, examFilter]);

  const entryNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of entries) m.set(e.id, e.name_no);
    return m;
  }, [entries]);

  // Group filtered by exam for the rendered list.
  const grouped = useMemo(() => {
    const buckets = new Map<string, { label: string; tasks: VanskeligOppgave[] }>();
    for (const t of filtered) {
      if (!buckets.has(t.exam))
        buckets.set(t.exam, { label: t.exam_label, tasks: [] });
      buckets.get(t.exam)!.tasks.push(t);
    }
    return Array.from(buckets.entries());
  }, [filtered]);

  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="bg-card px-7 py-8">
        <nav className="mb-4 text-[13px] text-ink-3">
          <Link to="/hjelp" className="text-primary-2 hover:text-primary">
            Hjelp
          </Link>
          <span className="mx-1.5">›</span>
          <span>Vanskelige oppgaver</span>
        </nav>

        <header className="mb-6">
          <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
            Vanskelige oppgaver
          </h1>
          <p className="m-0 max-w-[68ch] font-serif italic text-ink-3">
            Kurert liste fra tidligere ITD20218-eksamener av deloppgaver der
            ordlyden gjør det vanskelig å se hvilken formel som gjelder.
            Tenkt som siste-ressurs på eksamensdagen: gjenkjenn mønsteret,
            hopp til riktig formelside, følg løsningsskissen.
          </p>
        </header>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søk i sitat, tema, formelside…"
              className="w-full rounded-md border border-line bg-card px-3 py-2 pl-9 text-[14px] text-ink placeholder:text-ink-3 focus:border-primary-2 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setExamFilter(null)}
              className={
                "rounded-full border px-3 py-1 text-[12px] transition-colors " +
                (examFilter === null
                  ? "border-primary-2 bg-primary-2 text-white"
                  : "border-line bg-card text-ink-2 hover:border-primary-2/50")
              }
            >
              Alle eksamener ({VANSKELIGE_OPPGAVER.length})
            </button>
            {exams.map(([id, label]) => {
              const count = VANSKELIGE_OPPGAVER.filter((t) => t.exam === id).length;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setExamFilter(examFilter === id ? null : id)}
                  className={
                    "rounded-full border px-3 py-1 text-[12px] transition-colors " +
                    (examFilter === id
                      ? "border-primary-2 bg-primary-2 text-white"
                      : "border-line bg-card text-ink-2 hover:border-primary-2/50")
                  }
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="rounded-md border border-dashed border-line bg-paper-2/50 p-6 text-center text-ink-3">
            Ingen oppgaver matcher søket.
          </p>
        )}

        {grouped.map(([examId, { label, tasks }]) => (
          <section key={examId} className="mb-10">
            <h2 className="mb-4 border-b border-line pb-2 font-serif text-[22px] font-semibold text-ink">
              {label}
              <span className="ml-2 font-mono text-[12px] font-normal text-ink-3">
                ({tasks.length} {tasks.length === 1 ? "oppgave" : "oppgaver"})
              </span>
            </h2>
            <div className="space-y-6">
              {tasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  entryName={entryNameById.get(t.formula_entry)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

interface TaskCardProps {
  task: VanskeligOppgave;
  entryName?: string;
}

function TaskCard({ task, entryName }: TaskCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <article
      id={task.id}
      className="rounded-lg border border-line bg-card"
    >
      <div className="px-6 py-5">
        <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-2">
            {task.task}
          </span>
          <span className="font-serif text-[18px] font-semibold text-ink">
            {task.topic}
          </span>
        </div>

        <blockquote className="my-3 rounded-md border-l-2 border-primary-2/40 bg-paper-2/50 px-4 py-3 font-serif text-[14.5px] leading-relaxed text-ink-2">
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Sitat
          </span>
          <div className="mt-1">{renderInlineCode(task.quote, "light")}</div>
        </blockquote>

        <p className="my-3 text-[14.5px] leading-relaxed text-ink-2">
          <span className="mr-2 inline-block rounded bg-amber-100/70 px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-900">
            Hvorfor vrien
          </span>
          {renderInlineCode(task.why_tricky, "light")}
        </p>

        <div className="my-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px]">
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Formelside
          </span>
          <Link
            to={`/entry/${task.formula_entry}`}
            className="inline-flex items-center gap-1 text-primary-2 underline decoration-primary-3/60 underline-offset-[3px] hover:text-primary hover:decoration-primary"
          >
            {entryName ?? task.formula_entry}
            <ExternalLink size={11} aria-hidden />
          </Link>
          {task.formula_tab && (
            <span className="text-ink-3">
              <span className="mx-1">→</span>
              fane{" "}
              <span className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[12px] text-ink-2">
                {task.formula_tab}
              </span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-2/40 px-3 py-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:border-primary-2/50 hover:text-primary-2"
        >
          <ChevronRight
            size={13}
            className={
              "transition-transform " + (open ? "rotate-90" : "rotate-0")
            }
            aria-hidden
          />
          {open ? "Skjul løsningsskisse" : "Vis løsningsskisse"}
        </button>

        {open && (
          <div className="mt-5 border-t border-line pt-5">
            <h3 className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              Steg for steg
            </h3>
            <StepByStep steps={task.steps} />

            <div className="mt-5 rounded-md border border-emerald-300/60 bg-emerald-50/70 px-4 py-3">
              <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Svar
              </div>
              <div className="mt-1 font-mono text-[15px] text-ink">
                {renderInlineCode(task.answer, "light")}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
