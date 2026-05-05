import { useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { AlertTriangle, CornerDownRight } from "lucide-react";
import { VariantTabBar } from "@/components/detail/VariantTabBar";
import { renderInlineCode } from "@/components/detail/inline-code";

/**
 * Hidden gallery at /mockups/steps — full step-by-step strip variants
 * (tabs + regular steps + conditional "Pass på" steps as one unit).
 * Same content for every variant; only the visual treatment changes.
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

/** Returns the step index (1-based, only counting non-conditional rows). */
function stepNumbers(steps: Step[]): (number | null)[] {
  let n = 0;
  return steps.map((s) => (s.kind === "step" ? ++n : null));
}

export function MockupSteps() {
  return (
    <div className="min-h-screen bg-paper px-8 py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              /mockups/steps
            </span>
            <h1 className="mt-2 font-serif text-[32px] font-semibold text-ink">
              Steg-for-steg — fem retninger
            </h1>
            <p className="mt-1 max-w-[640px] text-[14px] text-ink-3">
              Hver variant viser hele stripen: tab-rad → vanlige steg →
              betinget &laquo;Pass p&aring;&raquo;-steg. Pek ut hva som funker
              best (eller bland deler).
            </p>
          </div>
          <Link to="/" className="text-[13px] text-primary-2 hover:underline">
            ← tilbake
          </Link>
        </div>

        <div className="flex flex-col gap-12">
          <Sample
            label="A · Nåværende (referanse)"
            note="Mørk navy-kort per steg, lys indigo nummer-sirkel, amber-rammet betinget med HVIS…-merkelapp."
          >
            {(active, set) => <CurrentStrip active={active} setActive={set} />}
          </Sample>

          <Sample
            label="B · Editorial — stor serif-tall, hårfin linje"
            note="Hvitt papir, kapittel-stil serif-numeral i venstremarg, hårfine skiller. Betinget = liten 'Pass på'-pille pluss varm tone."
          >
            {(active, set) => <EditorialStrip active={active} setActive={set} />}
          </Sample>

          <Sample
            label="C · Tidslinje med rail"
            note="Vertikal indigo-rail med node-sirkler. Vanlige steg er hvite kort til høyre for raila. Betinget steg har stiplet avstikker."
          >
            {(active, set) => <TimelineStrip active={active} setActive={set} />}
          </Sample>

          <Sample
            label="D · Mono-terminal (matcher eksempelkortene)"
            note="Hvert steg er et mørkt navy-kort med mono-skrift, lik eksempel-oppgavene. Betinget får cyan/amber `! PASS PÅ`-tag."
          >
            {(active, set) => <MonoStrip active={active} setActive={set} />}
          </Sample>

          <Sample
            label="E · Tag-liste — minimal, uten kort"
            note="Ingen kort. Bare en liten 'STEG 1'-tag øverst og innhold under, hårfine skiller mellom. Betinget bytter tag til PASS PÅ + amber venstrekant."
          >
            {(active, set) => <TagListStrip active={active} setActive={set} />}
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
  // Default-active "Invers: finn x" so conditional row content makes sense.
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
   Variant A — Current (reference)
   ====================================================================== */

function CurrentStrip({
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
        ariaLabel="mockup-A"
      />
      <ol className="mt-4 m-0 list-none p-0">
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li
              key={i}
              style={
                isCond
                  ? undefined
                  : {
                      background:
                        "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
                      borderColor: "var(--color-calc-border)",
                    }
              }
              className={clsx(
                "relative mb-2 rounded-lg border py-3 pl-12 pr-4 font-serif text-[14.5px] leading-relaxed",
                isCond
                  ? "border-amber-300/70 border-l-[3px] border-l-amber-500 bg-amber-50/40 text-ink-2"
                  : "text-white",
              )}
            >
              <span
                className={clsx(
                  "absolute left-3.5 top-3 flex h-6 w-6 items-center justify-center rounded-full font-mono text-[12px] font-semibold",
                  isCond
                    ? "bg-amber-500 text-white"
                    : "text-[var(--color-calc-bg)]",
                )}
                style={
                  isCond
                    ? undefined
                    : { background: "var(--color-calc-lookup-border)" }
                }
              >
                {numbers[i] ?? "!"}
              </span>
              {isCond && (
                <span className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  Hvis…
                </span>
              )}
              {renderInlineCode(s.text, isCond ? "light" : "dark")}
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ======================================================================
   Variant B — Editorial. Big serif numeral in margin, hairline rules.
   ====================================================================== */

function EditorialStrip({
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
        ariaLabel="mockup-B"
      />
      <ol className="mt-3 m-0 list-none p-0">
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li
              key={i}
              className={clsx(
                "grid grid-cols-[64px_1fr] items-baseline gap-x-4 border-t border-line py-5 pr-2",
                isCond && "bg-amber-50/30 -mx-4 px-4",
              )}
            >
              <span
                className={clsx(
                  "select-none text-right font-serif text-[34px] font-semibold leading-none",
                  isCond ? "text-amber-700/80 italic" : "text-primary-2",
                )}
              >
                {isCond ? "!" : numbers[i]}
              </span>
              <div className="font-serif text-[14.5px] leading-relaxed text-ink">
                {isCond && (
                  <span className="mr-1.5 inline-block translate-y-[-1px] rounded-sm bg-amber-200/60 px-1.5 py-0.5 align-middle font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
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
   Variant C — Timeline rail
   ====================================================================== */

function TimelineStrip({
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
        ariaLabel="mockup-C"
      />
      <ol className="relative mt-5 m-0 list-none p-0 pl-9">
        <span
          aria-hidden
          className="absolute left-[14px] top-2 bottom-2 w-px bg-primary-2/30"
        />
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li
              key={i}
              className={clsx(
                "relative pb-4",
                isCond && "pl-7",
              )}
            >
              {/* Node */}
              <span
                className={clsx(
                  "absolute -left-[34px] top-1 flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-semibold ring-4 ring-paper-2/40",
                  isCond
                    ? "bg-amber-100 text-amber-700"
                    : "bg-primary-2 text-white",
                )}
              >
                {isCond ? "!" : numbers[i]}
              </span>
              {/* Optional dashed branch for conditional */}
              {isCond && (
                <span
                  aria-hidden
                  className="absolute -left-[14px] top-3 h-px w-7 border-t border-dashed border-amber-500/70"
                />
              )}
              <div
                className={clsx(
                  "rounded-md font-serif text-[14.5px] leading-relaxed",
                  isCond
                    ? "border border-amber-300/70 bg-amber-50/60 px-3 py-2 text-ink-2"
                    : "px-1 text-ink",
                )}
              >
                {isCond && (
                  <span className="mb-1 flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700">
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
   Variant D — Mono terminal blocks (matches example task cards)
   ====================================================================== */

function MonoStrip({
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
        ariaLabel="mockup-D"
      />
      <ol className="mt-4 m-0 flex list-none flex-col gap-1 p-0">
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li
              key={i}
              style={{
                background:
                  "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
                borderColor: isCond ? "#b45309" : "var(--color-calc-border)",
              }}
              className={clsx(
                "rounded-md border px-4 py-3 font-mono text-[13px] leading-[1.55]",
                isCond ? "border-l-[3px]" : "",
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={clsx(
                    "font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em]",
                    isCond ? "text-amber-300" : "text-[var(--color-calc-label)]",
                  )}
                >
                  {isCond ? "! Pass på" : `Steg ${numbers[i]?.toString().padStart(2, "0")}`}
                </span>
              </div>
              <div className="text-[var(--color-calc-text)]">
                {renderInlineCode(s.text, "dark")}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ======================================================================
   Variant E — Tag list (minimal, no cards)
   ====================================================================== */

function TagListStrip({
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
        ariaLabel="mockup-E"
      />
      <ol className="mt-3 m-0 list-none p-0">
        {STEPS.map((s, i) => {
          const isCond = s.kind === "conditional";
          return (
            <li
              key={i}
              className={clsx(
                "grid grid-cols-[110px_1fr] items-baseline gap-x-3 border-t border-line py-4",
                isCond && "border-l-[2px] border-l-amber-400 bg-amber-50/25 -mx-4 px-4",
              )}
            >
              <span
                className={clsx(
                  "font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em]",
                  isCond ? "text-amber-700" : "text-primary-2",
                )}
              >
                {isCond ? (
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle size={11} strokeWidth={2.5} />
                    Pass på
                  </span>
                ) : (
                  <>Steg {numbers[i]}</>
                )}
              </span>
              <div className="font-serif text-[14.5px] leading-relaxed text-ink">
                {renderInlineCode(s.text, "light")}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
