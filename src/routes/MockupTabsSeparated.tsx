import { useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { deriveTabMeta } from "@/components/detail/tab-category";

/**
 * Iterations of the two-line "FOROVER / INVERS" tab strip with
 * stronger visual separation between tabs. Same content + colours
 * as the live VariantTabBar — only spacing/dividers/box-style change.
 */

const TAB_LABELS = [
  "P(X < x)",
  "P(X > x)",
  "P(a < X < b)",
  "Invers: finn x",
  "Invers: finn μ (eller σ)",
];

export function MockupTabsSeparated() {
  return (
    <div className="min-h-screen bg-paper px-8 py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              /mockups/tabs/separated
            </span>
            <h1 className="mt-2 font-serif text-[32px] font-semibold text-ink">
              Tab-separasjon — fem iterasjoner
            </h1>
            <p className="mt-1 max-w-[680px] text-[14px] text-ink-3">
              Samme to-linjes layout som er live nå, men med ulike
              separasjons-strategier. Vurder hvilken som tydeligst skiller
              hver fane fra naboen.
            </p>
          </div>
          <Link to="/mockups/tabs" className="text-[13px] text-primary-2 hover:underline">
            ← tab-gallery
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          <Sample
            label="T0 · Nåværende (referanse)"
            note="Slik det ser ut nå — 2-linjes med blå underline, gap-x-1 mellom faner."
          >
            {(active, set) => <T0 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="T1 · Mer luft mellom faner"
            note="Bare økt gap-x — fra 4px til 28px. Letteste mulige fix."
          >
            {(active, set) => <T1 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="T2 · Vertikale skillere"
            note="Tynne hairline-divisorer mellom hver fane. Strukturerer uten å ramme inn."
          >
            {(active, set) => <T2 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="T3 · Bokset chip per fane"
            note="Hver fane er sin egen avrundede chip med subtil bakgrunn — separasjon via boks i stedet for luft."
          >
            {(active, set) => <T3 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="T4 · Gruppering med større skille mellom forover/invers"
            note="Liten gap-x i grupper, stor gap mellom kategorier. Forover og invers blir to klare blokker."
          >
            {(active, set) => <T4 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="T5 · Aktiv fane som hevet kort"
            note="Aktiv fane får hvit bakgrunn, lett skygge og rammer som hever seg ut av strip-en. Inaktive blir flatere."
          >
            {(active, set) => <T5 active={active} setActive={set} />}
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

interface TabBtnProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  showUnderline?: boolean;
}

function TabContent({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) {
  const meta = deriveTabMeta(label);
  const tagColor =
    meta.kind === "invers" ? "text-amber-700" : "text-primary-2/70";
  return (
    <>
      <span
        aria-hidden
        className={clsx(
          "font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em]",
          meta.tag ? tagColor : "select-none opacity-0",
        )}
      >
        {meta.tag ?? "—"}
      </span>
      <span className={clsx("font-mono text-[12.5px]", isActive && "font-semibold")}>
        {meta.short}
      </span>
    </>
  );
}

function TabBtn({ label, isActive, onClick, className, showUnderline = true }: TabBtnProps) {
  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-label={label}
      onClick={onClick}
      className={clsx(
        "relative flex flex-col items-start gap-0.5 leading-none transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:rounded-sm focus-visible:ring-primary-2/60",
        isActive ? "text-primary-2" : "text-ink-3 hover:text-ink-2",
        className,
      )}
    >
      <TabContent label={label} isActive={isActive} />
      {showUnderline && (
        <span
          aria-hidden
          className={clsx(
            "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
            isActive ? "bg-primary-2" : "bg-transparent",
          )}
        />
      )}
    </button>
  );
}

/* ---------- T0 — current ---------- */

function T0({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-1 border-b border-line">
      {TAB_LABELS.map((label, i) => (
        <TabBtn
          key={label}
          label={label}
          isActive={i === active}
          onClick={() => setActive(i)}
          className="px-3 pb-2 pt-1.5"
        />
      ))}
    </div>
  );
}

/* ---------- T1 — more horizontal space ---------- */

function T1({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-7 border-b border-line">
      {TAB_LABELS.map((label, i) => (
        <TabBtn
          key={label}
          label={label}
          isActive={i === active}
          onClick={() => setActive(i)}
          className="px-1 pb-2 pt-1.5"
        />
      ))}
    </div>
  );
}

/* ---------- T2 — vertical hairline dividers ---------- */

function T2({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap items-stretch border-b border-line">
      {TAB_LABELS.map((label, i) => (
        <div key={label} className="flex items-stretch">
          {i > 0 && (
            <span aria-hidden className="my-1.5 w-px bg-line" />
          )}
          <TabBtn
            label={label}
            isActive={i === active}
            onClick={() => setActive(i)}
            className="px-5 pb-2 pt-1.5"
          />
        </div>
      ))}
    </div>
  );
}

/* ---------- T3 — chip per tab ---------- */

function T3({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {TAB_LABELS.map((label, i) => {
        const isActive = i === active;
        return (
          <button
            key={label}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => setActive(i)}
            className={clsx(
              "relative flex flex-col items-start gap-0.5 rounded-md border px-3.5 py-2 leading-none transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
              isActive
                ? "border-primary-2 bg-primary-soft text-primary-2 shadow-[0_1px_0_rgb(67_56_202_/0.08)]"
                : "border-line bg-card text-ink-3 hover:bg-paper-2/60 hover:text-ink-2",
            )}
          >
            <TabContent label={label} isActive={isActive} />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- T4 — group separation forover|invers ---------- */

function T4({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const groups = TAB_LABELS.reduce<{ forover: number[]; invers: number[] }>(
    (acc, label, i) => {
      const kind = deriveTabMeta(label).kind;
      if (kind === "invers") acc.invers.push(i);
      else acc.forover.push(i);
      return acc;
    },
    { forover: [], invers: [] },
  );

  return (
    <div role="tablist" className="flex flex-wrap items-end border-b border-line">
      <div className="flex flex-wrap gap-x-3 pr-2">
        {groups.forover.map((i) => (
          <TabBtn
            key={TAB_LABELS[i]}
            label={TAB_LABELS[i]}
            isActive={i === active}
            onClick={() => setActive(i)}
            className="px-2 pb-2 pt-1.5"
          />
        ))}
      </div>
      <span aria-hidden className="mx-3 mb-2 h-7 w-px bg-line" />
      <div className="flex flex-wrap gap-x-3 pl-2">
        {groups.invers.map((i) => (
          <TabBtn
            key={TAB_LABELS[i]}
            label={TAB_LABELS[i]}
            isActive={i === active}
            onClick={() => setActive(i)}
            className="px-2 pb-2 pt-1.5"
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- T5 — active tab raised ---------- */

function T5({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap items-end gap-x-1.5 border-b border-line">
      {TAB_LABELS.map((label, i) => {
        const isActive = i === active;
        return (
          <button
            key={label}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => setActive(i)}
            className={clsx(
              "relative flex flex-col items-start gap-0.5 rounded-t-md px-4 leading-none transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
              isActive
                ? "border border-line border-b-card bg-card pb-[10px] pt-2.5 text-primary-2 -mb-px shadow-[0_-1px_0_rgb(67_56_202_/0.10)]"
                : "border border-transparent pb-2 pt-1.5 text-ink-3 hover:text-ink-2",
            )}
          >
            <TabContent label={label} isActive={isActive} />
          </button>
        );
      })}
    </div>
  );
}
