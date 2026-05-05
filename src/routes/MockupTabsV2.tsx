import { useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { deriveTabMeta } from "@/components/detail/tab-category";

/**
 * Hidden gallery at /mockups/tabs/v2 — second round of tab-strip
 * variants after T1 (gap-x-7) was applied live. Explores spreading,
 * grouping, and a disclosure-style variant where the category tag
 * is the resting state and the formula reveals on selection.
 */

const TAB_LABELS = [
  "P(X < x)",
  "P(X > x)",
  "P(a < X < b)",
  "Invers: finn x",
  "Invers: finn μ (eller σ)",
];

export function MockupTabsV2() {
  return (
    <div className="min-h-screen bg-paper px-8 py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              /mockups/tabs/v2
            </span>
            <h1 className="mt-2 font-serif text-[32px] font-semibold text-ink">
              Tab-redesign — runde 2
            </h1>
            <p className="mt-1 max-w-[680px] text-[14px] text-ink-3">
              Etter T1 (gap-x-7) ble brukt live. Utforsker spredning,
              gruppering, og en disclosure-variant hvor kategorien er
              standard og formelen avsløres når en fane velges.
            </p>
          </div>
          <Link
            to="/mockups/tabs/separated"
            className="text-[13px] text-primary-2 hover:underline"
          >
            ← runde 1
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          <Sample
            label="S1 · Spredt jevnt over hele bredden (justify-between)"
            note="Hver fane fyller en lik andel av bredden via flexbox justify-between. Mest luft mulig — bra på desktop, kan se rart ut hvis enkelte labels er mye lengre enn andre."
          >
            {(active, set) => <S1 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="S2 · Mer vertikal luft + tydeligere aktiv-tilstand"
            note="Doblet pb/pt rundt fanene, tykkere underline (3px), aktiv-fane får en mild bakgrunn øverst. Gir mer 'vekt' uten å rote til layoutet."
          >
            {(active, set) => <S2 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="S3 · Gruppe-bakgrunner (forover-blokk vs invers-blokk)"
            note="Hver kategori-gruppe får sin egen subtile bakgrunn-tint. FOROVER-fanene sitter på et lett blå-tintet bånd, INVERS-fanene på et amber-tintet bånd. Maksimal segregering."
          >
            {(active, set) => <S3 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="S4 · Pill-bakgrunn på aktiv fane"
            note="Aktiv fane får en avrundet bakgrunn-pill i kategori-fargen (blå for forover, amber for invers). Inaktive er flate. Ingen underline trengs."
          >
            {(active, set) => <S4 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="S5 · Disclosure: kun kategori synlig, formel åpnes på aktiv"
            note="Inaktive faner viser bare kategori-tag (FOROVER/INVERS) + en kort identifikator. Aktiv fane skyver tag-en opp og avslører formelen i mono under. Gir ren rad i hvile, fokus når valgt."
          >
            {(active, set) => <S5 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="S6 · To-nivå: kategori-bryter + formel-rad"
            note="Øverst: bryter mellom FOROVER og INVERS som store hovedtaber. Under: bare formlene som tilhører valgt kategori. Tøff-est segregering, men krever to-stegs valg."
          >
            {(active, set) => <S6 active={active} setActive={set} />}
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

function categoryColors(kind: "forover" | "invers" | "neutral") {
  return kind === "invers" ? "text-amber-700" : "text-primary-2/80";
}

function TwoLineContent({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) {
  const meta = deriveTabMeta(label);
  return (
    <>
      <span
        aria-hidden
        className={clsx(
          "font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em]",
          meta.tag ? categoryColors(meta.kind) : "select-none opacity-0",
        )}
      >
        {meta.tag ?? "—"}
      </span>
      <span
        className={clsx("font-mono text-[12.5px]", isActive && "font-semibold")}
      >
        {meta.short}
      </span>
    </>
  );
}

/* ---------- S1 — justify-between, fills full width ---------- */

function S1({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex justify-between border-b border-line">
      {TAB_LABELS.map((label, i) => {
        const isActive = i === active;
        return (
          <button
            key={label}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => setActive(i)}
            className={clsx(
              "relative flex flex-col items-start gap-0.5 px-1 pb-2 pt-1.5 leading-none transition-colors",
              isActive ? "text-primary-2" : "text-ink-3 hover:text-ink-2",
            )}
          >
            <TwoLineContent label={label} isActive={isActive} />
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-0 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? "bg-primary-2" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- S2 — more breathing room, stronger active state ---------- */

function S2({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-8 border-b border-line">
      {TAB_LABELS.map((label, i) => {
        const isActive = i === active;
        return (
          <button
            key={label}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => setActive(i)}
            className={clsx(
              "relative flex flex-col items-start gap-1 px-2 pb-3.5 pt-3 leading-none transition-colors",
              "rounded-t-md",
              isActive ? "bg-primary-soft/50 text-primary-2" : "text-ink-3 hover:text-ink-2",
            )}
          >
            <TwoLineContent label={label} isActive={isActive} />
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-1 -bottom-px h-[3.5px] rounded-t-sm transition-all",
                isActive ? "bg-primary-2" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- S3 — group backgrounds (forover band + invers band) ---------- */

function S3({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const groups = TAB_LABELS.reduce<{
    forover: number[];
    invers: number[];
  }>(
    (acc, label, i) => {
      const kind = deriveTabMeta(label).kind;
      if (kind === "invers") acc.invers.push(i);
      else acc.forover.push(i);
      return acc;
    },
    { forover: [], invers: [] },
  );

  return (
    <div role="tablist" className="flex flex-wrap items-stretch border-b border-line">
      <div className="flex flex-wrap gap-x-3 rounded-tl-md bg-primary-soft/40 px-3 pb-2 pt-2">
        {groups.forover.map((i) => {
          const label = TAB_LABELS[i];
          const isActive = i === active;
          return (
            <button
              key={label}
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              onClick={() => setActive(i)}
              className={clsx(
                "relative flex flex-col items-start gap-0.5 px-2 pb-1 pt-0.5 leading-none transition-colors",
                isActive ? "text-primary-2" : "text-ink-3 hover:text-ink-2",
              )}
            >
              <TwoLineContent label={label} isActive={isActive} />
              <span
                aria-hidden
                className={clsx(
                  "absolute inset-x-1 -bottom-2 h-[2.5px] rounded-t-sm transition-all",
                  isActive ? "bg-primary-2" : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 rounded-tr-md bg-amber-50/70 px-3 pb-2 pt-2">
        {groups.invers.map((i) => {
          const label = TAB_LABELS[i];
          const isActive = i === active;
          return (
            <button
              key={label}
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              onClick={() => setActive(i)}
              className={clsx(
                "relative flex flex-col items-start gap-0.5 px-2 pb-1 pt-0.5 leading-none transition-colors",
                isActive ? "text-amber-700" : "text-ink-3 hover:text-ink-2",
              )}
            >
              <TwoLineContent label={label} isActive={isActive} />
              <span
                aria-hidden
                className={clsx(
                  "absolute inset-x-1 -bottom-2 h-[2.5px] rounded-t-sm transition-all",
                  isActive ? "bg-amber-500" : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- S4 — pill background on active tab ---------- */

function S4({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap items-center gap-x-2">
      {TAB_LABELS.map((label, i) => {
        const isActive = i === active;
        const meta = deriveTabMeta(label);
        const activeBg = meta.kind === "invers" ? "bg-amber-100 text-amber-700" : "bg-primary-soft text-primary-2";
        return (
          <button
            key={label}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => setActive(i)}
            className={clsx(
              "flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 leading-none transition-colors",
              isActive ? activeBg : "text-ink-3 hover:bg-paper-2/60 hover:text-ink-2",
            )}
          >
            <TwoLineContent label={label} isActive={isActive} />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- S5 — disclosure: category-only at rest, formula on active ---------- */

function S5({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-7 border-b border-line">
      {TAB_LABELS.map((label, i) => {
        const isActive = i === active;
        const meta = deriveTabMeta(label);
        const tagColor = meta.kind === "invers" ? "text-amber-700" : "text-primary-2/80";
        // Each tab needs a UNIQUE compact identifier when collapsed.
        // We use the meta.short trimmed to first 6 chars as a hint badge,
        // since just "FOROVER × 3" wouldn't differentiate them.
        const compactHint = meta.short.length > 12 ? meta.short.slice(0, 10) + "…" : meta.short;
        return (
          <button
            key={label}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => setActive(i)}
            className={clsx(
              "relative flex flex-col items-start leading-none transition-all duration-200 ease-out",
              isActive ? "pb-3 pt-2" : "pb-2 pt-2.5",
            )}
          >
            <span
              aria-hidden
              className={clsx(
                "font-mono font-semibold uppercase tracking-[0.16em] transition-all duration-200 ease-out",
                isActive ? "text-[10.5px]" : "text-[11px]",
                meta.tag ? tagColor : "text-ink-3/40",
              )}
            >
              {meta.tag ?? "—"}
            </span>
            <span
              className={clsx(
                "font-mono transition-all duration-200 ease-out",
                isActive
                  ? "mt-1 max-h-6 text-[13px] font-semibold opacity-100 text-primary-2"
                  : "mt-0 max-h-0 overflow-hidden text-[12px] opacity-0",
              )}
            >
              {meta.short}
            </span>
            {!isActive && (
              <span
                aria-hidden
                className="mt-0.5 font-mono text-[10px] text-ink-3"
              >
                {compactHint}
              </span>
            )}
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-0 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? "bg-primary-2" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- S6 — two-level: category switch then formula row ---------- */

function S6({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const activeMeta = deriveTabMeta(TAB_LABELS[active]);
  const [activeKind, setActiveKindInner] = useState<"forover" | "invers">(activeMeta.kind === "invers" ? "invers" : "forover");
  const visibleIndices = TAB_LABELS.map((l, i) => ({ i, kind: deriveTabMeta(l).kind })).filter(
    (x) => x.kind === activeKind,
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Top level: category switch */}
      <div role="tablist" aria-label="Kategori" className="flex gap-x-1 self-start rounded-lg border border-line bg-card p-1">
        <button
          role="tab"
          aria-selected={activeKind === "forover"}
          onClick={() => setActiveKindInner("forover")}
          className={clsx(
            "rounded-md px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
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
          onClick={() => setActiveKindInner("invers")}
          className={clsx(
            "rounded-md px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
            activeKind === "invers"
              ? "bg-amber-100 text-amber-700"
              : "text-ink-3 hover:text-ink-2",
          )}
        >
          Invers
        </button>
      </div>
      {/* Sub level: formulas in chosen category */}
      <div role="tablist" aria-label="Formel" className="flex flex-wrap gap-x-7 border-b border-line">
        {visibleIndices.map(({ i }) => {
          const label = TAB_LABELS[i];
          const isActive = i === active;
          const meta = deriveTabMeta(label);
          return (
            <button
              key={label}
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              onClick={() => setActive(i)}
              className={clsx(
                "relative px-1 pb-2 pt-1.5 font-mono text-[13px] leading-none transition-colors",
                isActive
                  ? activeKind === "invers"
                    ? "font-semibold text-amber-700"
                    : "font-semibold text-primary-2"
                  : "text-ink-3 hover:text-ink-2",
              )}
            >
              {meta.short}
              <span
                aria-hidden
                className={clsx(
                  "absolute inset-x-0 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                  isActive
                    ? activeKind === "invers"
                      ? "bg-amber-500"
                      : "bg-primary-2"
                    : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
