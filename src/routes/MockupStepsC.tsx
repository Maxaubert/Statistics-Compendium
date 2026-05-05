import { useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { CornerDownRight, AlertTriangle } from "lucide-react";
import { VariantTabBar } from "@/components/detail/VariantTabBar";
import { renderInlineCode } from "@/components/detail/inline-code";

/**
 * Iterations of variant C (timeline rail) — same skeleton, varied
 * spacing/separation strategies so we can pick the version that
 * feels visually distinct between steps.
 */

const TAB_LABELS = [
  "P(X < x)",
  "P(X > x)",
  "P(a < X < b)",
  "Invers: finn x",
  "Invers: finn μ (eller σ)",
];

type Step = { kind: "step"; text: string } | { kind: "conditional"; text: string };

const STEPS: Step[] = [
  {
    kind: "step",
    text: "Les hva som er gitt: en sannsynlighet og hvilken side. Enten `P(X < x) = p`, eller `P(X > x) = α` (da er `p = 1 − α`).",
  },
  {
    kind: "step",
    text: "Slå opp `z` slik at `G(z) = p` i tabell E.4 (Z-kvantil). Eksempel: `p = 0.975 ⇒ z = 1.96`.",
  },
  {
    kind: "conditional",
    text: "Hvis `p < 0.5`: `z` er negativ. Bruk refleksjon `z = −z_{1-p}` (f.eks. `p = 0.001 ⇒ z = −z_{0.999} = −3.090`).",
  },
  {
    kind: "step",
    text: "Sett inn i `x = μ + σ · z` (f.eks. `μ = 300`, `σ = 5`, `z = −3.090 ⇒ x = 300 − 15.45 = 284.55`).",
  },
  {
    kind: "step",
    text: "Sanity-sjekk: `p < 0.5 ⇒ x < μ`; `p > 0.5 ⇒ x > μ`. Stemmer det ikke, har du glemt fortegnet på `z`.",
  },
];

function stepNumbers(steps: Step[]): (number | null)[] {
  let n = 0;
  return steps.map((s) => (s.kind === "step" ? ++n : null));
}

export function MockupStepsC() {
  return (
    <div className="min-h-screen bg-paper px-8 py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              /mockups/steps/c
            </span>
            <h1 className="mt-2 font-serif text-[32px] font-semibold text-ink">
              Tidslinje — fem iterasjoner
            </h1>
            <p className="mt-1 max-w-[680px] text-[14px] text-ink-3">
              Samme variant C, men med ulik luft mellom steg, ulike
              node-størrelser og forskjellig grad av kort-bakgrunn.
              Velg det som leses tydeligst.
            </p>
          </div>
          <Link
            to="/mockups/steps"
            className="text-[13px] text-primary-2 hover:underline"
          >
            ← steg-gallery
          </Link>
        </div>

        <div className="flex flex-col gap-12">
          <Sample
            label="C1 · Mer luft, større noder"
            note="Doblet vertikal padding mellom steg, 28px noder, mer venstre-luft mellom rail og tekst."
          >
            {(active, set) => <C1 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="C2 · Hårfine skiller mellom steg"
            note="Hver rad får et fint divider-strek øverst, så stegene ikke flyter sammen."
          >
            {(active, set) => <C2 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="C3 · Kort som svever av raila"
            note="Hvert vanlige steg får et lett hvitt kort med skygge — tydelig separasjon, men ren."
          >
            {(active, set) => <C3 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="C4 · Tykk rail + alternerende bånd"
            note="3px rail, 32px noder. Annenhver rad har subtil paper-2-bakgrunn (zebra) så stegene rammes inn av seg selv."
          >
            {(active, set) => <C4 active={active} setActive={set} />}
          </Sample>

          <Sample
            label="C5 · Seksjon per steg, tykk rail"
            note="Hvert steg er sin egen seksjon med romslig padding og en label-tag øverst. Maks separasjon."
          >
            {(active, set) => <C5 active={active} setActive={set} />}
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
      <div className="rounded-lg border border-line bg-paper-2/40 px-4 py-5">
        {children(active, setActive)}
      </div>
    </section>
  );
}

/* ======================================================================
   C1 — More breathing room, bigger nodes
   ====================================================================== */

function C1({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  const numbers = stepNumbers(STEPS);
  return (
    <>
      <VariantTabBar
        labels={TAB_LABELS}
        active={active}
        onSelect={setActive}
        ariaLabel="C1"
      />
      <ol className="relative mt-7 m-0 list-none p-0 pl-12">
        <span
          aria-hidden
          className="absolute left-[18px] top-3 bottom-3 w-px bg-primary-2/30"
        />
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li key={i} className={clsx("relative pb-8", isCond && "pl-6")}>
              <span
                className={clsx(
                  "absolute -left-[42px] top-1 flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-semibold ring-4 ring-paper-2/40",
                  isCond
                    ? "bg-amber-100 text-amber-700"
                    : "bg-primary-2 text-white",
                )}
              >
                {isCond ? "!" : numbers[i]}
              </span>
              {isCond && (
                <span
                  aria-hidden
                  className="absolute -left-[18px] top-3.5 h-px w-6 border-t border-dashed border-amber-500/70"
                />
              )}
              <div
                className={clsx(
                  "rounded-md font-serif text-[14.5px] leading-relaxed",
                  isCond
                    ? "border border-amber-300/70 bg-amber-50/60 px-4 py-3 text-ink-2"
                    : "px-1 py-0.5 text-ink",
                )}
              >
                {isCond && (
                  <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                    <CornerDownRight size={11} />
                    Pass på
                  </span>
                )}
                {renderInlineCode(s.text, "light")}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ======================================================================
   C2 — Hairline divider between rows
   ====================================================================== */

function C2({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  const numbers = stepNumbers(STEPS);
  return (
    <>
      <VariantTabBar
        labels={TAB_LABELS}
        active={active}
        onSelect={setActive}
        ariaLabel="C2"
      />
      <ol className="relative mt-6 m-0 list-none p-0 pl-10">
        <span
          aria-hidden
          className="absolute left-[15px] top-2 bottom-2 w-px bg-primary-2/30"
        />
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li
              key={i}
              className={clsx(
                "relative py-5",
                i > 0 && "border-t border-line",
                isCond && "pl-6",
              )}
            >
              <span
                className={clsx(
                  "absolute -left-[34px] top-5 flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-semibold ring-[5px] ring-paper-2/40",
                  isCond
                    ? "bg-amber-100 text-amber-700"
                    : "bg-primary-2 text-white",
                )}
              >
                {isCond ? "!" : numbers[i]}
              </span>
              {isCond && (
                <span
                  aria-hidden
                  className="absolute -left-[15px] top-7 h-px w-6 border-t border-dashed border-amber-500/70"
                />
              )}
              <div
                className={clsx(
                  "font-serif text-[14.5px] leading-relaxed",
                  isCond
                    ? "rounded-md border border-amber-300/70 bg-amber-50/60 px-4 py-3 text-ink-2"
                    : "px-1 text-ink",
                )}
              >
                {isCond && (
                  <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                    <CornerDownRight size={11} />
                    Pass på
                  </span>
                )}
                {renderInlineCode(s.text, "light")}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ======================================================================
   C3 — Floating cards
   ====================================================================== */

function C3({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  const numbers = stepNumbers(STEPS);
  return (
    <>
      <VariantTabBar
        labels={TAB_LABELS}
        active={active}
        onSelect={setActive}
        ariaLabel="C3"
      />
      <ol className="relative mt-6 m-0 list-none p-0 pl-12">
        <span
          aria-hidden
          className="absolute left-[18px] top-3 bottom-3 w-px bg-primary-2/30"
        />
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li
              key={i}
              className={clsx("relative pb-5", isCond && "pl-7")}
            >
              <span
                className={clsx(
                  "absolute -left-[42px] top-3 flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-semibold ring-4 ring-paper-2/40",
                  isCond
                    ? "bg-amber-100 text-amber-700"
                    : "bg-primary-2 text-white",
                )}
              >
                {isCond ? "!" : numbers[i]}
              </span>
              {isCond && (
                <span
                  aria-hidden
                  className="absolute -left-[18px] top-6 h-px w-7 border-t border-dashed border-amber-500/70"
                />
              )}
              <div
                className={clsx(
                  "rounded-lg font-serif text-[14.5px] leading-relaxed shadow-sm",
                  isCond
                    ? "border border-amber-300/80 bg-amber-50 px-4 py-3 text-ink-2"
                    : "border border-line bg-card px-4 py-3 text-ink",
                )}
              >
                {isCond && (
                  <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                    <CornerDownRight size={11} />
                    Pass på
                  </span>
                )}
                {renderInlineCode(s.text, "light")}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ======================================================================
   C4 — Thick rail, larger nodes, zebra rows
   ====================================================================== */

function C4({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  const numbers = stepNumbers(STEPS);
  return (
    <>
      <VariantTabBar
        labels={TAB_LABELS}
        active={active}
        onSelect={setActive}
        ariaLabel="C4"
      />
      <ol className="relative mt-6 m-0 list-none p-0 pl-14">
        <span
          aria-hidden
          className="absolute left-[18px] top-3 bottom-3 w-[3px] rounded-full bg-primary-2/35"
        />
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          // Count regular steps so far for zebra alternation
          const stepIdx = numbers[i];
          const zebra =
            !isCond && stepIdx !== null && stepIdx % 2 === 0
              ? "bg-paper-2/55"
              : "";
          return (
            <li
              key={i}
              className={clsx(
                "relative my-1 rounded-lg py-4 pl-2 pr-3",
                isCond ? "bg-amber-50/60 ring-1 ring-amber-200" : zebra,
                isCond && "pl-9",
              )}
            >
              <span
                className={clsx(
                  "absolute -left-[46px] top-3 flex h-8 w-8 items-center justify-center rounded-full font-mono text-[13px] font-semibold shadow-sm ring-4 ring-paper-2/40",
                  isCond
                    ? "bg-amber-100 text-amber-700"
                    : "bg-primary-2 text-white",
                )}
              >
                {isCond ? "!" : numbers[i]}
              </span>
              {isCond && (
                <span
                  aria-hidden
                  className="absolute -left-[18px] top-7 h-px w-8 border-t-[1.5px] border-dashed border-amber-500/70"
                />
              )}
              <div className="font-serif text-[14.5px] leading-relaxed text-ink">
                {isCond && (
                  <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                    <CornerDownRight size={11} />
                    Pass på
                  </span>
                )}
                {renderInlineCode(s.text, "light")}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ======================================================================
   C5 — Section-per-step with label, max separation
   ====================================================================== */

function C5({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  const numbers = stepNumbers(STEPS);
  return (
    <>
      <VariantTabBar
        labels={TAB_LABELS}
        active={active}
        onSelect={setActive}
        ariaLabel="C5"
      />
      <ol className="relative mt-7 m-0 flex list-none flex-col gap-4 p-0 pl-14">
        <span
          aria-hidden
          className="absolute left-[18px] top-4 bottom-4 w-[2px] bg-primary-2/30"
        />
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li key={i} className="relative">
              <span
                className={clsx(
                  "absolute -left-[46px] top-4 flex h-8 w-8 items-center justify-center rounded-full font-mono text-[13px] font-semibold ring-4 ring-paper-2/40",
                  isCond
                    ? "bg-amber-100 text-amber-700"
                    : "bg-primary-2 text-white",
                )}
              >
                {isCond ? <AlertTriangle size={14} strokeWidth={2.5} /> : numbers[i]}
              </span>
              <span
                aria-hidden
                className={clsx(
                  "absolute top-7 h-px border-t",
                  isCond
                    ? "-left-[20px] w-[52px] border-dashed border-amber-500/70"
                    : "-left-[20px] w-8 border-primary-2/30",
                )}
              />
              <div
                className={clsx(
                  "rounded-lg px-5 py-4",
                  isCond
                    ? "ml-8 border border-amber-300/70 bg-amber-50/70"
                    : "border border-line bg-card",
                )}
              >
                <div
                  className={clsx(
                    "mb-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em]",
                    isCond ? "text-amber-700" : "text-primary-2/80",
                  )}
                >
                  {isCond ? "Pass på" : `Steg ${numbers[i]}`}
                </div>
                <div
                  className={clsx(
                    "font-serif text-[14.5px] leading-relaxed",
                    isCond ? "text-ink-2" : "text-ink",
                  )}
                >
                  {renderInlineCode(s.text, "light")}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
