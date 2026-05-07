import { Modal } from "@/components/shell/Modal";
import { Prose } from "./Prose";
import { renderInlineCode } from "./inline-code";
import type { FormulaExplanation } from "./formula-explanations";
import type { GlossaryTerm } from "@/data/schema";

interface Props {
  explanation: FormulaExplanation;
  glossary?: GlossaryTerm[];
  onClose: () => void;
}

/**
 * Popup with a deeper look at one formula on an entry page (e.g.
 * the PDF or CDF of a continuous distribution). Mirrors the visual
 * shell of PropertyDetailModal so the two card-modal pairs read as
 * the same family. The body is rendered through Prose with the dark
 * theme, so the markdown supports headings, callouts and lists.
 */
export function FormulaExplanationModal({
  explanation,
  glossary,
  onClose,
}: Props) {
  return (
    <Modal ariaLabel={`Forklaring av ${explanation.name}`} onClose={onClose}>
      <header
        className="border-b px-7 py-5"
        style={{ borderColor: "var(--color-calc-border)" }}
      >
        <div className="flex items-center gap-2">
          <DarkLabel>Formel</DarkLabel>
          {explanation.abbreviation && (
            <span
              className="rounded px-1.5 py-px font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "var(--color-calc-label)",
              }}
            >
              {explanation.abbreviation}
            </span>
          )}
        </div>
        <h2 className="m-0 mt-0.5 font-serif text-[24px] font-semibold text-white">
          {explanation.name}
        </h2>
        <div className="mt-3 font-mono text-[18px] font-semibold">
          {renderInlineCode(explanation.formula, "dark")}
        </div>
      </header>

      <section
        className="px-7 py-5"
        style={{ color: "var(--color-calc-text)" }}
      >
        <Prose body={explanation.long} glossary={glossary} theme="dark" />
      </section>
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
