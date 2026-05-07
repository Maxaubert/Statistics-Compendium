import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Modal } from "@/components/shell/Modal";
import { Prose } from "./Prose";
import type { GlossaryTerm } from "@/data/schema";

function relatedRefPath(kind: string, id: string): string {
  switch (kind) {
    case "entry":     return `/entry/${id}`;
    case "table":     return `/table/${id}`;
    case "pattern":   return `/monstre/${id}`;
    case "glossary":  return `/ordliste#${id}`;
    default:          return "/";
  }
}

interface PopupProps {
  term: GlossaryTerm;
  onClose: () => void;
  /** When set, renders a back button in the popup header. */
  onBack?: () => void;
  /** Tooltip target term name shown when hovering the back button. */
  backToLabel?: string;
}

/**
 * Shared dark-card popup that shows a glossary term's full definition.
 * Used by the Glossary index page and by the inline link auto-linker on
 * entry/concept detail pages.
 *
 * When the popup is opened from another popup (e.g., user clicked a
 * cross-glossary link), `onBack` is provided and a back button appears
 * in the top-left of the header. Clicking it pops the history stack.
 */
export function GlossaryPopup({ term, onClose, onBack, backToLabel }: PopupProps) {
  const popup = useGlossaryPopup();
  const openTerm = popup?.openTerm;

  return (
    <Modal ariaLabel={`Detaljer for termen ${term.term_no}`} onClose={onClose}>
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
              <span className="ml-1 normal-case tracking-normal text-[12px] font-serif italic" style={{ color: "var(--color-calc-text)", opacity: 0.7 }}>
                {backToLabel}
              </span>
            )}
          </button>
        )}
        <div
          className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--color-calc-label)" }}
        >
          Term
        </div>
        <h2 className="m-0 mt-0.5 font-serif text-[28px] font-semibold text-white">
          {term.term_no}
        </h2>
      </header>

      <section
        className="px-7 pt-5"
        style={{ color: "var(--color-calc-text)" }}
      >
        <Prose
          body={term.short_def}
          theme="dark"
          paragraphClass="m-0 text-[15px] leading-relaxed"
        />
      </section>

      {term.long_def && (
        <section
          className="px-7 pt-4"
          style={{ color: "var(--color-calc-text)", opacity: 0.85 }}
        >
          <Prose body={term.long_def} theme="dark" />
        </section>
      )}

      <div className="px-7 pb-7 pt-5">
        {term.see_also && term.see_also.length > 0 && (
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
            {term.see_also.map((r, i) => {
              // Glossary cross-refs: open the term in this popup (push to
              // history stack) instead of navigating away.
              if (r.kind === "glossary" && openTerm) {
                return (
                  <span key={`${r.kind}-${r.id}`}>
                    {i > 0 && ", "}
                    <button
                      type="button"
                      onClick={() => openTerm(r.id)}
                      className="underline hover:no-underline"
                      style={{
                        color: "var(--color-calc-lookup-border)",
                        background: "none",
                        border: "none",
                        padding: 0,
                        font: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      {r.id}
                    </button>
                  </span>
                );
              }
              return (
                <span key={`${r.kind}-${r.id}`}>
                  {i > 0 && ", "}
                  <Link
                    to={relatedRefPath(r.kind, r.id)}
                    className="underline hover:no-underline"
                    style={{ color: "var(--color-calc-lookup-border)" }}
                    onClick={onClose}
                  >
                    {r.id}
                  </Link>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ---- Context plumbing for inline links --------------------------------

interface OpenTermOptions {
  /**
   * Label of the surface that opened this term (e.g. a formula popup name).
   * When provided, the glossary popup shows a back button that closes the
   * glossary and reveals the originating popup, even though there is no
   * previous glossary in the stack.
   */
  externalBackLabel?: string;
}

interface GlossaryPopupContextValue {
  /** Open the popup for a glossary term by id. No-ops if id is unknown. */
  openTerm: (termId: string, opts?: OpenTermOptions) => void;
}

const GlossaryPopupContext = createContext<GlossaryPopupContextValue | null>(null);

interface ProviderProps {
  glossary: GlossaryTerm[];
  children: React.ReactNode;
}

/**
 * Wrap a page in this provider so any descendant can call `useGlossaryPopup()`
 * to open a term popup. Renders the popup itself; only one popup is visible
 * at a time.
 *
 * Maintains a navigation stack: opening a new term while a popup is open
 * pushes onto the stack. The back button in the header pops one level.
 * Closing the popup clears the entire stack.
 *
 * Callers can pass `externalBackLabel` in the open options to enable a
 * back button on the FIRST glossary popup that closes the glossary
 * (revealing whatever modal opened it). Used by the formula explanation
 * popup so the user sees `Tilbake til <formula>` instead of just an X.
 */
export function GlossaryPopupProvider({ glossary, children }: ProviderProps) {
  const [stack, setStack] = useState<string[]>([]);
  const [externalBackLabel, setExternalBackLabel] = useState<string | null>(null);
  const byId = useMemo(() => {
    const m = new Map<string, GlossaryTerm>();
    for (const t of glossary) m.set(t.id, t);
    return m;
  }, [glossary]);

  const openTerm = useCallback(
    (termId: string, opts?: OpenTermOptions) => {
      if (!byId.has(termId)) return;
      setStack((prev) => {
        // Don't push duplicate consecutive entries
        if (prev[prev.length - 1] === termId) return prev;
        // Only register the external back label when starting a fresh
        // glossary stack from outside; if we're navigating between
        // glossary terms (stack non-empty), we keep the old label so
        // the user can still return to the formula popup at the bottom.
        if (prev.length === 0 && opts?.externalBackLabel) {
          setExternalBackLabel(opts.externalBackLabel);
        }
        return [...prev, termId];
      });
    },
    [byId],
  );

  const goBack = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const close = useCallback(() => {
    setStack([]);
    setExternalBackLabel(null);
  }, []);

  const value = useMemo(() => ({ openTerm }), [openTerm]);
  const currentId = stack[stack.length - 1];
  const prevId = stack.length > 1 ? stack[stack.length - 2] : undefined;
  const open = currentId ? byId.get(currentId) ?? null : null;
  const prev = prevId ? byId.get(prevId) ?? null : null;

  // Back button targets, in priority order:
  //  1. Previous glossary term in the stack (in-popup back navigation).
  //  2. External label (close the glossary entirely, reveal the surface
  //     that opened it). Only shown on the bottom of the stack.
  const backTo = prev?.term_no ?? (stack.length === 1 ? externalBackLabel : null);
  const handleBack = prev ? goBack : close;

  return (
    <GlossaryPopupContext.Provider value={value}>
      {children}
      {open && (
        <GlossaryPopup
          term={open}
          onClose={close}
          onBack={backTo ? handleBack : undefined}
          backToLabel={backTo ?? undefined}
        />
      )}
    </GlossaryPopupContext.Provider>
  );
}

/**
 * Hook for descendants of GlossaryPopupProvider. Returns null if no
 * provider is mounted (allows components to be reused outside the
 * popup-aware context — they'll just render plain text).
 */
export function useGlossaryPopup(): GlossaryPopupContextValue | null {
  return useContext(GlossaryPopupContext);
}
