import { useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { renderInlineCode } from "@/components/detail/inline-code";
import { PROPERTY_EXPLANATIONS } from "@/components/detail/property-explanations";
import type { PropertyExplanation } from "@/components/detail/property-explanations";

/**
 * Hidden gallery at /mockups/property — six visual treatments of the
 * "Egenskap" popup (Forventningsverdi for binomialfordeling).
 * Rendered inline so they can be compared side-by-side; the live
 * version uses one of these in a modal overlay.
 */

const TITLE = "Forventningsverdi";
const EXPLANATION = PROPERTY_EXPLANATIONS["binomial-fordeling"]!.expected_value;

export function MockupProperty() {
  return (
    <div className="min-h-screen bg-paper px-8 py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
              /mockups/property
            </span>
            <h1 className="mt-2 font-serif text-[32px] font-semibold text-ink">
              Egenskap-popup — fem retninger
            </h1>
            <p className="mt-1 max-w-[680px] text-[14px] text-ink-3">
              Samme innhold (binomial · Forventningsverdi). Hver variant
              viser et annet visuelt språk for selve modal-panelet.
            </p>
          </div>
          <Link to="/" className="text-[13px] text-primary-2 hover:underline">
            ← tilbake
          </Link>
        </div>

        <div className="flex flex-col gap-12">
          <Sample
            label="M1 · Nåværende (referanse)"
            note="Hvit modal med mørk navy formel-bånd, lyse utledning-kort. Det vi har nå."
          >
            <M1 />
          </Sample>

          <Sample
            label="M2 · Mørk calc-kort i hele modalen"
            note="Hele modalen i samme mørke navy-stil som eksempel-oppgavekortene. Mono-ish, sterk visuell kontinuitet med oppgaveløsninger."
          >
            <M2 />
          </Sample>

          <Sample
            label="M3 · To-spalter — intuisjon + utledning ved siden av"
            note="Bredere modal: Intuisjon + Eksempel i venstre spalte, Utledning i høyre. Egnet for skjermer >720px."
          >
            <M3 />
          </Sample>

          <Sample
            label="M4 · Editorial — serif og hårfine skiller"
            note="Papir-estetikk, serif gjennomgående, store numeraler i venstre marg, hårfine skiller mellom utledningssteg."
          >
            <M4 />
          </Sample>

          <Sample
            label="M5 · Faner: Intuisjon · Utledning · Eksempel"
            note="Tre faner i toppen — for de som vil hoppe rett til utledning eller eksempel uten å skrolle."
          >
            <M5 />
          </Sample>
        </div>
      </div>
    </div>
  );
}

interface SampleProps {
  label: string;
  note: string;
  children: React.ReactNode;
}

function Sample({ label, note, children }: SampleProps) {
  return (
    <section className="rounded-xl border border-line bg-paper-2/40 p-6">
      <header className="mb-4">
        <h2 className="font-serif text-[17px] font-semibold text-ink">{label}</h2>
        <p className="mt-0.5 text-[12.5px] text-ink-3">{note}</p>
      </header>
      <div className="flex justify-center rounded-lg bg-black/30 p-6">
        {children}
      </div>
    </section>
  );
}

/* ======================================================================
   M1 · Reference (current modal)
   ====================================================================== */

function M1() {
  return (
    <ModalShell width="640px">
      <header className="px-7 pb-3 pt-6">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
          Egenskap
        </div>
        <h2 className="m-0 mt-1 font-serif text-[24px] font-semibold text-ink">
          {TITLE}
        </h2>
      </header>
      <DarkFormulaBand formula={EXPLANATION.formula} className="mx-7" />
      <SectionLabel className="px-7 pt-5">Intuisjon</SectionLabel>
      <p className="m-0 px-7 font-serif text-[14.5px] leading-relaxed text-ink">
        {renderInlineCode(EXPLANATION.intuition, "light")}
      </p>
      <SectionLabel className="px-7 pt-5">Utledning</SectionLabel>
      <ol className="m-0 flex list-none flex-col gap-2 px-7 p-0">
        {EXPLANATION.derivation.map((step, i) => (
          <li
            key={i}
            className="rounded-lg border border-line bg-paper-2/60 px-4 py-3"
          >
            <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {i + 1}. {step.label}
            </div>
            <div className="font-serif text-[14px] leading-relaxed text-ink-2">
              {step.lines.map((line, li) => (
                <div key={li} className="py-px">
                  {renderInlineCode(line, "light")}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      {EXPLANATION.example && (
        <>
          <SectionLabel className="px-7 pt-5">Eksempel</SectionLabel>
          <ExampleBlock example={EXPLANATION.example} className="mx-7 mb-7" />
        </>
      )}
    </ModalShell>
  );
}

/* ======================================================================
   M2 · Full dark calc-card aesthetic
   ====================================================================== */

function M2() {
  return (
    <div
      className="w-full max-w-[640px] overflow-hidden rounded-xl border shadow-2xl"
      style={{
        background:
          "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
        borderColor: "var(--color-calc-border)",
        color: "var(--color-calc-text)",
      }}
    >
      <header className="border-b px-7 py-5" style={{ borderColor: "var(--color-calc-border)" }}>
        <div
          className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--color-calc-label)" }}
        >
          Egenskap
        </div>
        <h2 className="m-0 mt-0.5 font-serif text-[24px] font-semibold text-white">
          {TITLE}
        </h2>
        <div className="mt-3 font-mono text-[18px] font-semibold">
          {renderInlineCode(EXPLANATION.formula, "dark")}
        </div>
      </header>

      <section className="px-7 pt-5">
        <DarkLabel>Intuisjon</DarkLabel>
        <p
          className="m-0 mt-1 text-[14px] leading-relaxed"
          style={{ color: "var(--color-calc-text)" }}
        >
          {renderInlineCode(EXPLANATION.intuition, "dark")}
        </p>
      </section>

      <section className="px-7 pt-5">
        <DarkLabel>Utledning</DarkLabel>
        <ol className="m-0 mt-2 list-none p-0">
          {EXPLANATION.derivation.map((step, i) => (
            <li key={i} className="border-b py-3 last:border-b-0" style={{ borderColor: "var(--color-calc-divider)" }}>
              <div
                className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-calc-label)" }}
              >
                {i + 1}. {step.label}
              </div>
              {step.lines.map((line, li) => (
                <div key={li} className="font-mono text-[13.5px] leading-relaxed">
                  {renderInlineCode(line, "dark")}
                </div>
              ))}
            </li>
          ))}
        </ol>
      </section>

      {EXPLANATION.example && (
        <section className="px-7 pb-7 pt-5">
          <DarkLabel>Eksempel</DarkLabel>
          <div className="mt-1 font-mono text-[13.5px]">
            <span style={{ color: "var(--color-calc-comment)" }}>
              # gitt: {EXPLANATION.example.setup}
            </span>
            <div className="mt-1" style={{ color: "var(--color-calc-text)" }}>
              {renderInlineCode(EXPLANATION.example.result, "dark")}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ======================================================================
   M3 · Two-column
   ====================================================================== */

function M3() {
  return (
    <ModalShell width="880px">
      <header className="px-7 pb-3 pt-6">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
          Egenskap
        </div>
        <h2 className="m-0 mt-1 font-serif text-[24px] font-semibold text-ink">
          {TITLE}
        </h2>
      </header>
      <DarkFormulaBand formula={EXPLANATION.formula} className="mx-7" />
      <div className="grid grid-cols-1 gap-6 px-7 pb-7 pt-5 md:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionLabel>Intuisjon</SectionLabel>
          <p className="m-0 mb-5 mt-1 font-serif text-[14.5px] leading-relaxed text-ink">
            {renderInlineCode(EXPLANATION.intuition, "light")}
          </p>
          {EXPLANATION.example && (
            <>
              <SectionLabel>Eksempel</SectionLabel>
              <div className="mt-1">
                <ExampleBlock example={EXPLANATION.example} />
              </div>
            </>
          )}
        </div>
        <div>
          <SectionLabel>Utledning</SectionLabel>
          <ol className="m-0 mt-2 flex list-none flex-col gap-2 p-0">
            {EXPLANATION.derivation.map((step, i) => (
              <li
                key={i}
                className="rounded-lg border border-line bg-paper-2/60 px-4 py-3"
              >
                <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {i + 1}. {step.label}
                </div>
                <div className="font-serif text-[14px] leading-relaxed text-ink-2">
                  {step.lines.map((line, li) => (
                    <div key={li} className="py-px">
                      {renderInlineCode(line, "light")}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ModalShell>
  );
}

/* ======================================================================
   M4 · Editorial (serif everything, hairline rules, big numerals)
   ====================================================================== */

function M4() {
  return (
    <ModalShell width="640px">
      <header className="px-9 pb-4 pt-7">
        <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          Egenskap
        </div>
        <h2 className="m-0 mt-1 font-serif text-[28px] font-semibold leading-tight text-ink">
          {TITLE}
        </h2>
        <div className="mt-2 font-mono text-[15px] text-primary-2">
          {renderInlineCode(EXPLANATION.formula, "light")}
        </div>
      </header>

      <hr className="m-0 mx-9 border-0 border-t border-line" />

      <section className="px-9 pt-5">
        <p className="m-0 font-serif text-[15px] italic leading-relaxed text-ink-2">
          {renderInlineCode(EXPLANATION.intuition, "light")}
        </p>
      </section>

      <section className="px-9 pt-6">
        <div className="mb-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          Utledning
        </div>
        <ol className="m-0 list-none p-0">
          {EXPLANATION.derivation.map((step, i) => (
            <li
              key={i}
              className="grid grid-cols-[36px_1fr] items-baseline gap-x-3 border-t border-line py-4 first:border-t-0"
            >
              <span className="select-none text-right font-serif text-[26px] font-semibold leading-none text-primary-2">
                {i + 1}
              </span>
              <div>
                <div className="mb-1 font-serif text-[13px] font-semibold uppercase tracking-wider text-ink-3">
                  {step.label}
                </div>
                {step.lines.map((line, li) => (
                  <div key={li} className="py-px font-serif text-[14.5px] leading-relaxed text-ink">
                    {renderInlineCode(line, "light")}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {EXPLANATION.example && (
        <section className="px-9 pb-8 pt-5">
          <div className="border-l-[3px] border-primary-2/50 pl-4">
            <div className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-primary-2/80">
              Eksempel
            </div>
            <p className="m-0 font-serif text-[14.5px] leading-relaxed text-ink-2">
              <span className="font-mono text-[12.5px] text-ink-3">
                {renderInlineCode(EXPLANATION.example.setup, "light")}
              </span>
              <span className="mx-2 text-ink-3">→</span>
              {renderInlineCode(EXPLANATION.example.result, "light")}
            </p>
          </div>
        </section>
      )}
    </ModalShell>
  );
}

/* ======================================================================
   M5 · Tabbed (Intuisjon / Utledning / Eksempel)
   ====================================================================== */

function M5() {
  const [tab, setTab] = useState<"intuisjon" | "utledning" | "eksempel">("utledning");
  return (
    <ModalShell width="640px">
      <header className="px-7 pb-3 pt-6">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
          Egenskap
        </div>
        <h2 className="m-0 mt-1 font-serif text-[24px] font-semibold text-ink">
          {TITLE}
        </h2>
      </header>
      <DarkFormulaBand formula={EXPLANATION.formula} className="mx-7" />

      <div role="tablist" className="mx-7 mt-5 flex gap-x-7 border-b border-line">
        <TabButton active={tab === "intuisjon"} onClick={() => setTab("intuisjon")}>
          Intuisjon
        </TabButton>
        <TabButton active={tab === "utledning"} onClick={() => setTab("utledning")}>
          Utledning
        </TabButton>
        <TabButton active={tab === "eksempel"} onClick={() => setTab("eksempel")}>
          Eksempel
        </TabButton>
      </div>

      <div className="px-7 pb-7 pt-4">
        {tab === "intuisjon" && (
          <p className="m-0 font-serif text-[14.5px] leading-relaxed text-ink">
            {renderInlineCode(EXPLANATION.intuition, "light")}
          </p>
        )}
        {tab === "utledning" && (
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {EXPLANATION.derivation.map((step, i) => (
              <li
                key={i}
                className="rounded-lg border border-line bg-paper-2/60 px-4 py-3"
              >
                <div className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {i + 1}. {step.label}
                </div>
                <div className="font-serif text-[14px] leading-relaxed text-ink-2">
                  {step.lines.map((line, li) => (
                    <div key={li} className="py-px">
                      {renderInlineCode(line, "light")}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        )}
        {tab === "eksempel" && EXPLANATION.example && (
          <ExampleBlock example={EXPLANATION.example} />
        )}
      </div>
    </ModalShell>
  );
}

/* ======================================================================
   Shared bits
   ====================================================================== */

function ModalShell({
  children,
  width,
}: {
  children: React.ReactNode;
  width: string;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-line bg-card shadow-2xl"
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  );
}

function DarkFormulaBand({
  formula,
  className,
}: {
  formula: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg border px-5 py-4 font-mono text-[16px] font-semibold",
        className,
      )}
      style={{
        background:
          "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
        borderColor: "var(--color-calc-border)",
        color: "var(--color-calc-text)",
      }}
    >
      {renderInlineCode(formula, "dark")}
    </div>
  );
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mb-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary-2/80",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DarkLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: "var(--color-calc-label)" }}
    >
      {children}
    </div>
  );
}

function ExampleBlock({
  example,
  className,
}: {
  example: NonNullable<PropertyExplanation["example"]>;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-line bg-paper-2/60 px-4 py-3 font-serif text-[14px] leading-relaxed",
        className,
      )}
    >
      <div className="text-ink-3">
        <span className="font-mono text-[11px] uppercase tracking-wider">
          Gitt:
        </span>{" "}
        {renderInlineCode(example.setup, "light")}
      </div>
      <div className="mt-1 font-medium text-ink">
        {renderInlineCode(example.result, "light")}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "relative px-1 pb-2 pt-1.5 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors",
        active ? "text-primary-2" : "text-ink-3 hover:text-ink-2",
      )}
    >
      {children}
      <span
        aria-hidden
        className={clsx(
          "absolute inset-x-0 -bottom-px h-[2.5px] rounded-t-sm transition-all",
          active ? "bg-primary-2" : "bg-transparent",
        )}
      />
    </button>
  );
}
