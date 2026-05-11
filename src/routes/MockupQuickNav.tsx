import { clsx } from "clsx";
import { useState } from "react";

/**
 * Mockup page — visual comparison of QuickNav rail design variants.
 * Each variant shares the new baseline (no header, vertically centered)
 * and shows the same four section anchors. Pick one and we'll apply
 * it to the live component.
 */
const ITEMS = [
  { id: "a", label: "Formel" },
  { id: "b", label: "Steg for steg" },
  { id: "c", label: "Løsninger" },
  { id: "d", label: "Tabeller" },
];

export function MockupQuickNav() {
  return (
    <div className="min-h-screen bg-paper p-10">
      <h1 className="mb-2 font-serif text-3xl font-semibold text-ink">
        QuickNav mockups
      </h1>
      <p className="mb-8 max-w-2xl font-serif text-ink-2">
        Fem alternativer for den vertikale hurtignavigasjonen. Alle er
        vertikalt sentrert i sin egen kolonne, uten «På denne siden»-
        tittel. Si fra hvilken du liker.
      </p>

      <div className="grid grid-cols-5 gap-6">
        <VariantPanel name="A · Linje + aktivblokk" variant={LineWithBlock} />
        <VariantPanel name="B · Prikker + tekst" variant={DotsAndText} />
        <VariantPanel name="C · Pill-knapper" variant={PillItems} />
        <VariantPanel name="D · Ren tekst" variant={PlainText} />
        <VariantPanel name="E · Nummererte noder" variant={NumberedNodes} />
      </div>
    </div>
  );
}

function VariantPanel({
  name,
  variant: Variant,
}: {
  name: string;
  variant: React.FC<{ active: string; onPick: (id: string) => void }>;
}) {
  const [active, setActive] = useState("b");
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="mb-4 border-b border-line pb-2 font-mono text-[11px] uppercase tracking-wider text-ink-3">
        {name}
      </div>
      {/* Simulated article frame, ~340px tall, so the rail can vertically center */}
      <div className="relative h-[340px] rounded-lg bg-paper-2/40">
        <div className="absolute inset-y-0 left-3 flex items-center">
          <Variant active={active} onPick={setActive} />
        </div>
        <div className="absolute inset-y-0 right-4 flex flex-col justify-center gap-2 pr-2 text-[11px] text-ink-3">
          <div className="text-right italic">(article content)</div>
        </div>
      </div>
    </div>
  );
}

// ─── Variant A: vertical line with active marker block ───────────────────
function LineWithBlock({
  active,
  onPick,
}: {
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <nav aria-label="Hurtignavigasjon" className="flex">
      <div className="relative w-[2px] bg-line">
        {/* Active indicator block */}
        <div
          className="absolute -left-[1px] w-[4px] rounded-full bg-primary-2 transition-all duration-300"
          style={{
            top: `${ITEMS.findIndex((i) => i.id === active) * 36}px`,
            height: "28px",
          }}
        />
      </div>
      <div className="flex flex-col gap-2 pl-3">
        {ITEMS.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => onPick(it.id)}
            className={clsx(
              "h-7 px-1 text-left font-serif text-[13px] transition-colors",
              it.id === active
                ? "font-semibold text-primary-2"
                : "text-ink-3 hover:text-ink",
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Variant B: dots + text ──────────────────────────────────────────────
function DotsAndText({
  active,
  onPick,
}: {
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <nav aria-label="Hurtignavigasjon" className="flex flex-col gap-2.5">
      {ITEMS.map((it) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onPick(it.id)}
            className="group flex items-center gap-3"
          >
            <span
              className={clsx(
                "h-2 w-2 rounded-full transition-all",
                isActive
                  ? "bg-primary-2 ring-2 ring-primary-soft"
                  : "bg-ink-3/40 group-hover:bg-ink-3",
              )}
            />
            <span
              className={clsx(
                "font-serif text-[13px] transition-colors",
                isActive
                  ? "font-semibold text-primary-2"
                  : "text-ink-3 group-hover:text-ink",
              )}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Variant C: pill items ───────────────────────────────────────────────
function PillItems({
  active,
  onPick,
}: {
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <nav aria-label="Hurtignavigasjon" className="flex flex-col gap-1">
      {ITEMS.map((it) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onPick(it.id)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-left font-serif text-[13px] transition-colors",
              isActive
                ? "bg-primary-2 text-white"
                : "text-ink-3 hover:bg-paper-2 hover:text-ink",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Variant D: plain text, color on active ──────────────────────────────
function PlainText({
  active,
  onPick,
}: {
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <nav aria-label="Hurtignavigasjon" className="flex flex-col gap-2">
      {ITEMS.map((it) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onPick(it.id)}
            className={clsx(
              "px-1 text-left font-serif text-[13.5px] transition-colors",
              isActive
                ? "font-semibold text-primary-2"
                : "text-ink-3 hover:text-ink",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Variant E: numbered nodes ───────────────────────────────────────────
function NumberedNodes({
  active,
  onPick,
}: {
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <nav aria-label="Hurtignavigasjon" className="flex flex-col gap-2">
      {ITEMS.map((it, idx) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onPick(it.id)}
            className="group flex items-center gap-2.5"
          >
            <span
              className={clsx(
                "flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold transition-colors",
                isActive
                  ? "bg-primary-2 text-white"
                  : "bg-paper-2 text-ink-3 group-hover:bg-line",
              )}
            >
              {idx + 1}
            </span>
            <span
              className={clsx(
                "font-serif text-[13px] transition-colors",
                isActive
                  ? "font-semibold text-primary-2"
                  : "text-ink-3 group-hover:text-ink",
              )}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
