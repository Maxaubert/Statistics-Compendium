import { useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { deriveTabMeta } from "@/components/detail/tab-category";

/**
 * Hidden gallery at /mockups/tabs/v3 — third round, focused entirely
 * on the user's preferred direction: tabs show ONLY the category
 * (FOROVER/INVERS) — never the formula. The formula surfaces
 * somewhere else, in five different ways.
 *
 * Each tab needs a unique identifier at rest since FOROVER × 3 and
 * INVERS × 2 would otherwise be indistinguishable. We use a small
 * numeric index after the category.
 */

const TAB_LABELS = [
  "P(X < x)",
  "P(X > x)",
  "P(a < X < b)",
  "Invers: finn x",
  "Invers: finn μ (eller σ)",
];

interface CompactTab {
  raw: string;
  short: string;
  formula: string;
  kind: "forover" | "invers" | "neutral";
  /** Index within its category group ("FOROVER 1" / "INVERS 1"). */
  groupIndex: number;
}

function buildTabs(): CompactTab[] {
  let foroverCount = 0;
  let inversCount = 0;
  return TAB_LABELS.map((raw) => {
    const meta = deriveTabMeta(raw);
    const groupIndex =
      meta.kind === "invers" ? ++inversCount : ++foroverCount;
    return {
      raw,
      short: meta.short,
      formula: meta.short,
      kind: meta.kind,
      groupIndex,
    };
  });
}

const TABS: CompactTab[] = buildTabs();

export function MockupTabsV3() {
  return (
    <div className="min-h-screen bg-paper px-8 py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              /mockups/tabs/v3
            </span>
            <h1 className="mt-2 font-serif text-[32px] font-semibold text-ink">
              Tab-redesign — runde 3
            </h1>
            <p className="mt-1 max-w-[680px] text-[14px] text-ink-3">
              Bare kategori i fanene. Formelen vises et annet sted — fem
              ulike steder. Liten indeks etter kategori (FOROVER 1, 2, 3
              · INVERS 1, 2) så fanene er unike i hvile.
            </p>
          </div>
          <Link to="/mockups/tabs/v2" className="text-[13px] text-primary-2 hover:underline">
            ← runde 2
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          <Sample
            label="V1 · Disclosure: aktiv fane vokser og viser formel"
            note="Din foretrukne: i hvile er hver fane bare 'FOROVER 1' / 'INVERS 2'. Aktiv fane vokser vertikalt og avslører formelen i mono under kategorien."
          >
            {(active, set) => <V1 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="V2 · Formel som seksjon-subtitle (over fanene)"
            note="Seksjon-overskriften får en undertittel som viser aktiv formel. Fanene er minimale chips. Brukeren leser tittel + formel sammen som «Detaljerte oppgaveløsninger · P(X < x)»."
          >
            {(active, set) => <V2 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="V3 · Formel-bånd mellom faner og innhold"
            note="Fanene er kompakte oppe. Mellom fanene og selve innholdet sitter en bred mono-formel som hovedoverskrift for valgt variant. Formelen blir fokuset, fanene blir navigasjon."
          >
            {(active, set) => <V3 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="V4 · To-nivå: kategori-bryter + formel-display"
            note="Topp: pille-bryter mellom FOROVER og INVERS. Midten: bred mørk formel-display av aktiv variant. Bunn: små formel-chips innenfor valgt kategori. Tre lag, men hvert er superklart."
          >
            {(active, set) => <V4 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="V5 · Formel i selve innholdet — fanene er bare navigasjon"
            note="Fanene viser kun kategori. Formelen vises som en H3-stil overskrift øverst på hver eksempel-/steg-seksjon (her demonstrert med en placeholder under). Mest puristisk: fanene er rene knapper, formelen lever i konteksten."
          >
            {(active, set) => <V5 active={active} setActive={set} />}
          </Sample>
        </div>
      </div>
    </div>
  );
}

interface SampleProps {
  label: string;
  note: string;
  children: (active: number, setActive: (i: number) => void) => React.ReactNode;
}

function Sample({ label, note, children }: SampleProps) {
  const [active, setActive] = useState(3);
  return (
    <section className="rounded-xl border border-line bg-card p-6">
      <header className="mb-4">
        <h2 className="font-serif text-[17px] font-semibold text-ink">{label}</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-3">{note}</p>
      </header>
      <div className="rounded-lg border border-line bg-paper-2/40 px-5 py-5">
        {children(active, setActive)}
      </div>
    </section>
  );
}

/* ---------- Shared bits ---------- */

function categoryColor(kind: CompactTab["kind"]) {
  return kind === "invers" ? "text-amber-700" : "text-primary-2/80";
}
function categoryBgActive(kind: CompactTab["kind"]) {
  return kind === "invers" ? "bg-amber-100 text-amber-700" : "bg-primary-soft text-primary-2";
}
function categoryUnderline(kind: CompactTab["kind"]) {
  return kind === "invers" ? "bg-amber-500" : "bg-primary-2";
}

/* ---------- V1 — disclosure: tab grows when active ---------- */

function V1({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap items-end gap-x-7 border-b border-line">
      {TABS.map((t, i) => {
        const isActive = i === active;
        return (
          <button
            key={t.raw}
            role="tab"
            aria-selected={isActive}
            aria-label={t.raw}
            onClick={() => setActive(i)}
            className={clsx(
              "relative flex flex-col items-start leading-none transition-all duration-200 ease-out",
              isActive ? "pb-2.5 pt-2" : "pb-2 pt-3",
            )}
          >
            <span
              aria-hidden
              className={clsx(
                "flex items-baseline gap-1.5 font-mono font-semibold uppercase tracking-[0.16em] transition-all duration-200 ease-out",
                categoryColor(t.kind),
                isActive ? "text-[10px]" : "text-[11.5px]",
              )}
            >
              {t.kind === "invers" ? "Invers" : "Forover"}
              <span className="opacity-60">{t.groupIndex}</span>
            </span>
            <span
              className={clsx(
                "block overflow-hidden font-mono transition-all duration-200 ease-out",
                isActive
                  ? "mt-1 max-h-6 text-[14px] font-semibold text-primary-2 opacity-100"
                  : "mt-0 max-h-0 text-[12px] opacity-0",
              )}
            >
              {t.formula}
            </span>
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-0 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? categoryUnderline(t.kind) : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- V2 — formula as section subtitle ---------- */

function V2({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const t = TABS[active];
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
            Detaljerte oppgaveløsninger
          </span>
          <span className={clsx("font-mono text-[11px] font-semibold uppercase tracking-[0.16em]", categoryColor(t.kind))}>
            ·  {t.kind === "invers" ? "Invers" : "Forover"}
          </span>
        </div>
        <h3 className="mt-1 font-mono text-[20px] font-semibold text-ink">
          {t.formula}
        </h3>
      </div>
      <div role="tablist" className="flex flex-wrap items-center gap-1.5">
        {TABS.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab.raw}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.raw}
              onClick={() => setActive(i)}
              className={clsx(
                "rounded-md border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
                isActive
                  ? clsx("border-transparent", categoryBgActive(tab.kind))
                  : "border-line bg-card text-ink-3 hover:bg-paper-2/60 hover:text-ink-2",
              )}
            >
              <span className="flex items-baseline gap-1">
                {tab.kind === "invers" ? "Invers" : "Forover"}
                <span className="opacity-60">{tab.groupIndex}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- V3 — compact tabs above, large formula band below ---------- */

function V3({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const t = TABS[active];
  return (
    <div className="flex flex-col">
      <div role="tablist" className="flex flex-wrap gap-x-5 border-b border-line pb-2">
        {TABS.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab.raw}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.raw}
              onClick={() => setActive(i)}
              className={clsx(
                "relative flex items-baseline gap-1 px-1 pb-1 pt-2 font-mono text-[11.5px] font-semibold uppercase leading-none tracking-[0.16em] transition-colors",
                isActive ? categoryColor(tab.kind) : "text-ink-3 hover:text-ink-2",
              )}
            >
              {tab.kind === "invers" ? "Invers" : "Forover"}
              <span className={clsx("opacity-70", isActive && "opacity-100")}>{tab.groupIndex}</span>
              <span
                aria-hidden
                className={clsx(
                  "absolute inset-x-0 -bottom-[9px] h-[2.5px] rounded-t-sm transition-all",
                  isActive ? categoryUnderline(tab.kind) : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>
      <div
        className="mt-4 rounded-lg border px-5 py-4 font-mono text-[18px] font-semibold"
        style={{
          background: "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
          borderColor: "var(--color-calc-border)",
          color: "var(--color-calc-text)",
        }}
      >
        {t.formula}
      </div>
    </div>
  );
}

/* ---------- V4 — two-level: category switch + formula display + sub-chips ---------- */

function V4({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const activeKind = TABS[active].kind === "invers" ? "invers" : "forover";
  const inGroup = TABS.filter((t) => t.kind === activeKind);
  const t = TABS[active];

  function selectKind(kind: "forover" | "invers") {
    const firstInKind = TABS.findIndex((tab) => tab.kind === kind);
    if (firstInKind >= 0) setActive(firstInKind);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Top: category switch */}
      <div role="tablist" aria-label="Kategori" className="flex gap-x-1 self-start rounded-lg border border-line bg-card p-1">
        <button
          role="tab"
          aria-selected={activeKind === "forover"}
          onClick={() => selectKind("forover")}
          className={clsx(
            "rounded-md px-5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
            activeKind === "forover"
              ? "bg-primary-soft text-primary-2"
              : "text-ink-3 hover:text-ink-2",
          )}
        >
          Forover
        </button>
        <button
          role="tab"
          aria-selected={activeKind === "invers"}
          onClick={() => selectKind("invers")}
          className={clsx(
            "rounded-md px-5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
            activeKind === "invers"
              ? "bg-amber-100 text-amber-700"
              : "text-ink-3 hover:text-ink-2",
          )}
        >
          Invers
        </button>
      </div>

      {/* Middle: large formula display */}
      <div
        className="rounded-lg border px-5 py-4 font-mono text-[18px] font-semibold"
        style={{
          background: "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
          borderColor: "var(--color-calc-border)",
          color: "var(--color-calc-text)",
        }}
      >
        {t.formula}
      </div>

      {/* Bottom: numbered sub-chips inside the chosen category */}
      <div role="tablist" className="flex flex-wrap items-center gap-1.5">
        {inGroup.map((tab) => {
          const i = TABS.indexOf(tab);
          const isActive = i === active;
          return (
            <button
              key={tab.raw}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.raw}
              onClick={() => setActive(i)}
              className={clsx(
                "rounded-md border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                isActive
                  ? clsx("border-transparent", categoryBgActive(tab.kind))
                  : "border-line bg-card text-ink-3 hover:bg-paper-2/60 hover:text-ink-2",
              )}
            >
              {(activeKind === "forover" ? "Forover" : "Invers")} {tab.groupIndex}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- V5 — purist: tabs are pure navigation, formula lives in the content ---------- */

function V5({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const t = TABS[active];
  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="flex flex-wrap items-center gap-1.5 border-b border-line pb-2">
        {TABS.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab.raw}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.raw}
              onClick={() => setActive(i)}
              className={clsx(
                "rounded-md px-3.5 py-2 font-mono text-[11.5px] font-semibold uppercase tracking-[0.18em] transition-colors",
                isActive
                  ? categoryBgActive(tab.kind)
                  : "text-ink-3 hover:bg-paper-2/60 hover:text-ink-2",
              )}
            >
              {tab.kind === "invers" ? "Invers" : "Forover"} {tab.groupIndex}
            </button>
          );
        })}
      </div>
      {/* Mock content card showing how the formula appears as the section header */}
      <div className="rounded-lg border border-line bg-paper-2 px-5 py-4">
        <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          Eksamen jan25 · oppgave 5a
        </div>
        <h3 className="mt-1 font-serif text-[18px] font-semibold text-ink">
          Sannsynlighet for <span className="font-mono text-[16px]">{t.formula}</span>
        </h3>
        <p className="mt-1 italic text-ink-3">
          (Selve eksempel-innholdet under her — formelen står som overskrift, fanene over er bare navigasjon.)
        </p>
      </div>
    </div>
  );
}
