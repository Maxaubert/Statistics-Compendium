import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/shell/Modal";
import type { GlossaryTerm } from "@/data/schema";

function relatedRefPath(kind: string, id: string): string {
  switch (kind) {
    case "entry":     return `/entry/${id}`;
    case "concept":   return `/concept/${id}`;
    case "table":     return `/table/${id}`;
    case "pattern":   return `/monstre/${id}`;
    case "glossary":  return `/ordliste#${id}`;
    default:          return "/";
  }
}

interface PopupProps {
  term: GlossaryTerm;
  onClose: () => void;
}

/**
 * Shared dark-card popup that shows a glossary term's full definition.
 * Used by the Glossary index page and by the inline link auto-linker on
 * entry/concept detail pages.
 */
export function GlossaryPopup({ term, onClose }: PopupProps) {
  return (
    <Modal ariaLabel={`Detaljer for termen ${term.term_no}`} onClose={onClose}>
      <header
        className="border-b px-7 py-5"
        style={{ borderColor: "var(--color-calc-border)" }}
      >
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

      <section className="px-7 pt-5">
        <p
          className="m-0 text-[15px] leading-relaxed"
          style={{ color: "var(--color-calc-text)" }}
        >
          {term.short_def}
        </p>
      </section>

      {term.long_def && (
        <section className="px-7 pt-4">
          <p
            className="m-0 whitespace-pre-line text-[14px] leading-relaxed"
            style={{ color: "var(--color-calc-text)", opacity: 0.85 }}
          >
            {term.long_def}
          </p>
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
            {term.see_also.map((r, i) => (
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
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ---- Context plumbing for inline links --------------------------------

interface GlossaryPopupContextValue {
  /** Open the popup for a glossary term by id. No-ops if id is unknown. */
  openTerm: (termId: string) => void;
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
 */
export function GlossaryPopupProvider({ glossary, children }: ProviderProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const byId = useMemo(() => {
    const m = new Map<string, GlossaryTerm>();
    for (const t of glossary) m.set(t.id, t);
    return m;
  }, [glossary]);
  const openTerm = useCallback(
    (termId: string) => {
      if (byId.has(termId)) setOpenId(termId);
    },
    [byId],
  );
  const value = useMemo(() => ({ openTerm }), [openTerm]);
  const open = openId ? byId.get(openId) ?? null : null;
  return (
    <GlossaryPopupContext.Provider value={value}>
      {children}
      {open && <GlossaryPopup term={open} onClose={() => setOpenId(null)} />}
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
