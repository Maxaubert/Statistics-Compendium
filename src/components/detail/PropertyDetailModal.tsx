import { Modal } from "@/components/shell/Modal";
import { renderInlineCode } from "./inline-code";
import type { PropertyExplanation } from "./property-explanations";

interface Props {
  title: string;
  explanation: PropertyExplanation;
  onClose: () => void;
}

/**
 * Popup with a deeper look at one Egenskap (property): the formula,
 * a plain-language intuisjon, a step-by-step utledning, and a
 * concrete eksempel — rendered inside the shared dark calc-card
 * modal shell so it reads as part of the same family as the
 * detailed-solution cards on the page.
 */
export function PropertyDetailModal({ title, explanation, onClose }: Props) {
  return (
    <Modal ariaLabel={`Detaljer for ${title}`} onClose={onClose}>
      <header
        className="border-b px-7 py-5"
        style={{ borderColor: "var(--color-calc-border)" }}
      >
        <DarkLabel>Egenskap</DarkLabel>
        <h2 className="m-0 mt-0.5 font-serif text-[24px] font-semibold text-white">
          {title}
        </h2>
        <div className="mt-3 font-mono text-[18px] font-semibold">
          {renderInlineCode(explanation.formula, "dark")}
        </div>
      </header>

      <section className="px-7 pt-5">
        <DarkLabel>Intuisjon</DarkLabel>
        <p
          className="m-0 mt-1 text-[14px] leading-relaxed"
          style={{ color: "var(--color-calc-text)" }}
        >
          {renderInlineCode(explanation.intuition, "dark")}
        </p>
      </section>

      <section className="px-7 pt-5">
        <DarkLabel>Utledning</DarkLabel>
        <ol className="m-0 mt-2 list-none p-0">
          {explanation.derivation.map((step, i) => (
            <li
              key={i}
              className="border-b py-3 last:border-b-0"
              style={{ borderColor: "var(--color-calc-divider)" }}
            >
              <div
                className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-calc-label)" }}
              >
                {i + 1}. {step.label}
              </div>
              {step.lines.map((line, li) => (
                <div
                  key={li}
                  className="whitespace-pre-wrap break-words py-px font-mono text-[13.5px] leading-relaxed"
                >
                  {renderInlineCode(line, "dark")}
                </div>
              ))}
              {step.note && (
                <div
                  className="mt-2 rounded-md border-l-2 px-3 py-2 text-[13px] leading-relaxed"
                  style={{
                    borderColor: "var(--color-cyan-2)",
                    background: "rgba(34, 211, 238, 0.08)",
                    color: "var(--color-calc-text)",
                  }}
                >
                  <div
                    aria-hidden
                    className="mb-1 select-none font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--color-cyan-2)" }}
                  >
                    Forklaring
                  </div>
                  <div className="font-serif italic">
                    {renderInlineCode(step.note, "dark")}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {explanation.example && (
        <section className="px-7 pb-7 pt-5">
          <DarkLabel>Eksempel</DarkLabel>
          <div className="mt-1 font-mono text-[13.5px]">
            <span style={{ color: "var(--color-calc-comment)" }}>
              # gitt: {explanation.example.setup}
            </span>
            <div className="mt-1" style={{ color: "var(--color-calc-text)" }}>
              {renderInlineCode(explanation.example.result, "dark")}
            </div>
          </div>
        </section>
      )}
    </Modal>
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
