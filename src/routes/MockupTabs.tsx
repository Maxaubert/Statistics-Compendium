import { useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowLeftRight,
  RotateCcw,
  Target,
} from "lucide-react";

/**
 * Hidden gallery at /mockups/tabs — six redesign options for the
 * step-for-step / detailed-solutions tab strip on entry pages. Same
 * five tabs in every variant; only the visual treatment changes so
 * the user can pick (or mix) a direction.
 */

const TABS = [
  { id: "lt", formula: "P(X < x)", short: "Mindre enn", category: "forover" },
  { id: "gt", formula: "P(X > x)", short: "Større enn", category: "forover" },
  { id: "in", formula: "P(a < X < b)", short: "Intervall", category: "forover" },
  { id: "ix", formula: "Invers: finn x", short: "Finn x", category: "invers" },
  { id: "im", formula: "Invers: finn μ (eller σ)", short: "Finn μ", category: "invers" },
];

const ICONS = {
  lt: ArrowLeftToLine,
  gt: ArrowRightToLine,
  in: ArrowLeftRight,
  ix: Target,
  im: RotateCcw,
};

export function MockupTabs() {
  return (
    <div className="min-h-screen bg-paper px-8 py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              /mockups/tabs
            </span>
            <h1 className="mt-2 font-serif text-[32px] font-semibold text-ink">
              Tab-design — seks retninger
            </h1>
            <p className="mt-1 text-[14px] text-ink-3">
              Klikk en fane i hver variant for å se aktiv-tilstand. Pek ut hva
              du vil bruke (eller bland — én A&apos;s tab-stil + én B&apos;s
              etiketter er fint).
            </p>
          </div>
          <Link to="/" className="text-[13px] text-primary-2 hover:underline">
            ← tilbake
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          <Sample
            label="A · Nåværende (referanse)"
            note="Mono-formler + blå underline. Det vi har nå."
            render={(active, set) => <CurrentTabs active={active} setActive={set} />}
          />

          <Sample
            label="B · Serif-etikett primær, formel under"
            note="Menneskelig navn først (serif), mono-formelen sekundært. Hver fane gjenkjennes på navn, ikke ligning."
            render={(active, set) => <SerifTabs active={active} setActive={set} />}
          />

          <Sample
            label="C · Tolinjes med kategori-tag"
            note="Liten caps 'FOROVER'/'INVERS' over selve formelen. Kategori-skille tydelig."
            render={(active, set) => <TwoLineTabs active={active} setActive={set} />}
          />

          <Sample
            label="D · Ikon-ledet"
            note="Liten retning-ikon foran mono-formelen. Skannbart visuelt."
            render={(active, set) => <IconTabs active={active} setActive={set} />}
          />

          <Sample
            label="E · Pill (uten underline)"
            note="Aktiv fane = fylt pill, inaktive er flate. Boldere skille mellom valgt og rest."
            render={(active, set) => <PillTabs active={active} setActive={set} />}
          />

          <Sample
            label="F · Gruppert med skille"
            note="Forover-tabs (rolig blå) | Invers-tabs (amber). Seksjonsskille gjør det åpenbart hvor inversen begynner."
            render={(active, set) => <GroupedTabs active={active} setActive={set} />}
          />

          <Sample
            label="G · Kombi: serif-etikett + gruppering"
            note="Mest ryddig — serif-navn (B) + gruppering med farge (F)."
            render={(active, set) => <ComboTabs active={active} setActive={set} />}
          />
        </div>
      </div>
    </div>
  );
}

interface SampleProps {
  label: string;
  note: string;
  render: (active: string, setActive: (id: string) => void) => React.ReactNode;
}

function Sample({ label, note, render }: SampleProps) {
  const [active, setActive] = useState(TABS[3].id);
  return (
    <section className="rounded-xl border border-line bg-card p-6">
      <header className="mb-4">
        <h2 className="font-serif text-[17px] font-semibold text-ink">{label}</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-3">{note}</p>
      </header>
      <div className="rounded-lg border border-line bg-paper-2/40 px-4 py-4">
        {render(active, setActive)}
      </div>
    </section>
  );
}

/* ---------- Variant A — current ---------- */

function CurrentTabs({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-1 border-b border-line">
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            onClick={() => setActive(t.id)}
            className={clsx(
              "relative px-3 pb-2 pt-1.5 font-mono text-[12.5px] leading-none transition-colors",
              isActive ? "font-semibold text-primary-2" : "text-ink-3 hover:text-ink-2",
            )}
          >
            {t.formula}
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? "bg-primary-2" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Variant B — serif primary, formula sub ---------- */

function SerifTabs({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-1 border-b border-line">
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            onClick={() => setActive(t.id)}
            className={clsx(
              "relative flex flex-col items-start gap-0.5 px-3 pb-2 pt-1.5 leading-none transition-colors",
              isActive ? "text-primary-2" : "text-ink-3 hover:text-ink-2",
            )}
          >
            <span
              className={clsx(
                "font-serif text-[14px]",
                isActive ? "font-semibold" : "font-medium",
              )}
            >
              {t.short}
            </span>
            <span className="font-mono text-[10.5px] opacity-70">{t.formula}</span>
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? "bg-primary-2" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Variant C — two-line with category tag ---------- */

function TwoLineTabs({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-1 border-b border-line">
      {TABS.map((t) => {
        const isActive = t.id === active;
        const isForward = t.category === "forover";
        return (
          <button
            key={t.id}
            role="tab"
            onClick={() => setActive(t.id)}
            className={clsx(
              "relative flex flex-col items-start gap-0.5 px-3 pb-2 pt-1.5 leading-none transition-colors",
              isActive ? "text-primary-2" : "text-ink-3 hover:text-ink-2",
            )}
          >
            <span
              className={clsx(
                "font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em]",
                isForward ? "text-primary-2/70" : "text-amber-700",
              )}
            >
              {isForward ? "Forover" : "Invers"}
            </span>
            <span className={clsx("font-mono text-[12.5px]", isActive && "font-semibold")}>
              {t.short}
            </span>
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? "bg-primary-2" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Variant D — icon-led ---------- */

function IconTabs({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-x-1 border-b border-line">
      {TABS.map((t) => {
        const isActive = t.id === active;
        const Icon = ICONS[t.id as keyof typeof ICONS];
        return (
          <button
            key={t.id}
            role="tab"
            onClick={() => setActive(t.id)}
            className={clsx(
              "relative flex items-center gap-1.5 px-3 pb-2 pt-1.5 font-mono text-[12.5px] leading-none transition-colors",
              isActive ? "font-semibold text-primary-2" : "text-ink-3 hover:text-ink-2",
            )}
          >
            <Icon size={13} strokeWidth={2} />
            {t.formula}
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? "bg-primary-2" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Variant E — pill ---------- */

function PillTabs({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap items-center gap-1.5">
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            onClick={() => setActive(t.id)}
            className={clsx(
              "rounded-full px-3 py-1.5 font-mono text-[12.5px] leading-none transition-colors",
              isActive
                ? "bg-primary-2 font-semibold text-white"
                : "bg-transparent text-ink-3 hover:bg-paper-2 hover:text-ink-2",
            )}
          >
            {t.formula}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Variant F — grouped with separator + category color ---------- */

function GroupedTabs({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  const forward = TABS.filter((t) => t.category === "forover");
  const inverse = TABS.filter((t) => t.category === "invers");
  return (
    <div role="tablist" className="flex flex-wrap items-center gap-x-1 border-b border-line">
      {forward.map((t) => (
        <GroupTab key={t.id} t={t} active={active} setActive={setActive} accent="blue" />
      ))}
      <span aria-hidden className="mx-2 mb-2 mt-1 h-4 w-px bg-line" />
      {inverse.map((t) => (
        <GroupTab key={t.id} t={t} active={active} setActive={setActive} accent="amber" />
      ))}
    </div>
  );
}

function GroupTab({
  t,
  active,
  setActive,
  accent,
}: {
  t: (typeof TABS)[number];
  active: string;
  setActive: (id: string) => void;
  accent: "blue" | "amber";
}) {
  const isActive = t.id === active;
  const accentClasses = {
    blue: "text-primary-2",
    amber: "text-amber-700",
  };
  const accentBar = {
    blue: "bg-primary-2",
    amber: "bg-amber-500",
  };
  return (
    <button
      role="tab"
      onClick={() => setActive(t.id)}
      className={clsx(
        "relative px-3 pb-2 pt-1.5 font-mono text-[12.5px] leading-none transition-colors",
        isActive
          ? clsx("font-semibold", accentClasses[accent])
          : "text-ink-3 hover:text-ink-2",
      )}
    >
      {t.formula}
      <span
        aria-hidden
        className={clsx(
          "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
          isActive ? accentBar[accent] : "bg-transparent",
        )}
      />
    </button>
  );
}

/* ---------- Variant G — combo: serif + grouped + colored ---------- */

function ComboTabs({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  const forward = TABS.filter((t) => t.category === "forover");
  const inverse = TABS.filter((t) => t.category === "invers");
  return (
    <div role="tablist" className="flex flex-wrap items-center gap-x-1 border-b border-line">
      {forward.map((t) => (
        <ComboTab key={t.id} t={t} active={active} setActive={setActive} accent="blue" />
      ))}
      <span aria-hidden className="mx-2 mb-2 mt-1 h-5 w-px bg-line" />
      {inverse.map((t) => (
        <ComboTab key={t.id} t={t} active={active} setActive={setActive} accent="amber" />
      ))}
    </div>
  );
}

function ComboTab({
  t,
  active,
  setActive,
  accent,
}: {
  t: (typeof TABS)[number];
  active: string;
  setActive: (id: string) => void;
  accent: "blue" | "amber";
}) {
  const isActive = t.id === active;
  const accentText = accent === "blue" ? "text-primary-2" : "text-amber-700";
  const accentBar = accent === "blue" ? "bg-primary-2" : "bg-amber-500";
  return (
    <button
      role="tab"
      onClick={() => setActive(t.id)}
      className={clsx(
        "relative flex flex-col items-start gap-0.5 px-3 pb-2 pt-1.5 leading-none transition-colors",
        isActive ? accentText : "text-ink-3 hover:text-ink-2",
      )}
    >
      <span className={clsx("font-serif text-[14px]", isActive ? "font-semibold" : "font-medium")}>
        {t.short}
      </span>
      <span className="font-mono text-[10.5px] opacity-70">{t.formula}</span>
      <span
        aria-hidden
        className={clsx(
          "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
          isActive ? accentBar : "bg-transparent",
        )}
      />
    </button>
  );
}
