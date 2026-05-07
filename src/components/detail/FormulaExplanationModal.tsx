import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Modal } from "@/components/shell/Modal";
import { Prose } from "./Prose";
import { renderInlineCode } from "./inline-code";
import { useGlossaryPopup } from "./GlossaryPopup";
import type {
  FormulaExplanation,
  FormulaSeeAlsoRef,
} from "./formula-explanations";
import type { GlossaryTerm, Entry, Table } from "@/data/schema";

interface Props {
  explanation: FormulaExplanation;
  glossary?: GlossaryTerm[];
  entries?: Entry[];
  tables?: Table[];
  /** When the user got here via another formula popup, opens a back button. */
  onBack?: () => void;
  /** Name of the previous formula in the stack, shown next to the back button. */
  backToLabel?: string;
  /** Push a different formula onto the stack (cross-reference click). */
  onOpenFormula?: (ref: string) => void;
  /** Used to look up cross-formula labels when rendering Se også. */
  allFormulas?: FormulaExplanation[];
  onClose: () => void;
}

/**
 * Popup with a deeper look at one formula on an entry page (e.g.
 * the PDF or CDF of a continuous distribution). Mirrors the visual
 * shell of PropertyDetailModal and GlossaryPopup so the three popups
 * read as the same family. Body is rendered through Prose with the
 * dark theme; the see_also row at the bottom links to other formula
 * cards (in-stack), entries, glossary terms or tables.
 */
export function FormulaExplanationModal({
  explanation,
  glossary,
  entries,
  tables,
  onBack,
  backToLabel,
  onOpenFormula,
  allFormulas,
  onClose,
}: Props) {
  const glossaryPopup = useGlossaryPopup();

  return (
    <Modal ariaLabel={`Forklaring av ${explanation.name}`} onClose={onClose}>
      <header
        className="border-b px-7 py-5"
        style={{ borderColor: "var(--color-calc-border)" }}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={backToLabel ? `Tilbake til ${backToLabel}` : "Tilbake"}
            title={backToLabel ? `Tilbake til ${backToLabel}` : "Tilbake"}
            className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:bg-white/10"
            style={{ color: "var(--color-calc-label)" }}
          >
            <ArrowLeft size={12} aria-hidden />
            <span>Tilbake</span>
            {backToLabel && (
              <span
                className="ml-1 font-serif text-[12px] italic normal-case tracking-normal"
                style={{ color: "var(--color-calc-text)", opacity: 0.7 }}
              >
                {backToLabel}
              </span>
            )}
          </button>
        )}
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

      {explanation.see_also && explanation.see_also.length > 0 && (
        <div className="px-7 pb-7">
          <div
            className="border-t pt-4 text-[13px]"
            style={{
              borderColor: "var(--color-calc-divider)",
              color: "var(--color-calc-text)",
            }}
          >
            <span
              className="mr-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-calc-label)" }}
            >
              Se også
            </span>
            {explanation.see_also.map((link, i) => (
              <Fragment key={`${link.kind}-${refKey(link)}`}>
                {i > 0 && ", "}
                <SeeAlsoLink
                  link={link}
                  glossary={glossary}
                  entries={entries}
                  tables={tables}
                  allFormulas={allFormulas}
                  onOpenFormula={onOpenFormula}
                  onOpenGlossary={glossaryPopup?.openTerm}
                  onClose={onClose}
                />
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

function refKey(link: FormulaSeeAlsoRef): string {
  return link.kind === "formula" ? link.ref : link.id;
}

interface SeeAlsoLinkProps {
  link: FormulaSeeAlsoRef;
  glossary?: GlossaryTerm[];
  entries?: Entry[];
  tables?: Table[];
  allFormulas?: FormulaExplanation[];
  onOpenFormula?: (ref: string) => void;
  onOpenGlossary?: (termId: string) => void;
  onClose: () => void;
}

function SeeAlsoLink({
  link,
  glossary,
  entries,
  tables,
  allFormulas,
  onOpenFormula,
  onOpenGlossary,
  onClose,
}: SeeAlsoLinkProps) {
  const linkClass = "underline hover:no-underline";
  const linkStyle = {
    color: "var(--color-calc-lookup-border)",
    background: "none",
    border: "none",
    padding: 0,
    font: "inherit",
    cursor: "pointer",
  } as const;

  if (link.kind === "formula") {
    const target = allFormulas?.find((f) => f.id === link.ref);
    const label = target?.abbreviation
      ? `${target.name} (${target.abbreviation})`
      : target?.name ?? link.ref;
    return (
      <>
        <button
          type="button"
          onClick={() => onOpenFormula?.(link.ref)}
          className={linkClass}
          style={linkStyle}
        >
          {label}
        </button>
        <KindBadge kind="formel" />
      </>
    );
  }

  if (link.kind === "glossary") {
    const term = glossary?.find((t) => t.id === link.id);
    const label = term?.term_no ?? link.id;
    if (onOpenGlossary) {
      return (
        <>
          <button
            type="button"
            onClick={() => onOpenGlossary(link.id)}
            className={linkClass}
            style={linkStyle}
          >
            {label}
          </button>
          <KindBadge kind="ordliste" />
        </>
      );
    }
    return (
      <>
        <Link
          to={`/ordliste#${link.id}`}
          className={linkClass}
          style={{ color: "var(--color-calc-lookup-border)" }}
          onClick={onClose}
        >
          {label}
        </Link>
        <KindBadge kind="ordliste" />
      </>
    );
  }

  if (link.kind === "entry") {
    const entry = entries?.find((e) => e.id === link.id);
    const label = entry?.name_no ?? link.id;
    return (
      <>
        <Link
          to={`/entry/${link.id}`}
          className={linkClass}
          style={{ color: "var(--color-calc-lookup-border)" }}
          onClick={onClose}
        >
          {label}
        </Link>
        <KindBadge kind="formel" />
      </>
    );
  }

  // table
  const table = tables?.find((t) => t.id === link.id);
  const label = table?.name_no ?? link.id;
  return (
    <>
      <Link
        to={`/table/${link.id}`}
        className={linkClass}
        style={{ color: "var(--color-calc-lookup-border)" }}
        onClick={onClose}
      >
        {label}
      </Link>
      <KindBadge kind="tabell" />
    </>
  );
}

function KindBadge({ kind }: { kind: "formel" | "ordliste" | "tabell" }) {
  return (
    <span
      aria-hidden
      className="ml-1 inline-block whitespace-nowrap rounded px-1 py-px font-mono text-[10px] font-medium leading-tight"
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        color: "var(--color-calc-label)",
      }}
    >
      ({kind})
    </span>
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
