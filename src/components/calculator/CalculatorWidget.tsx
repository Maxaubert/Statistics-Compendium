import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Calculator as CalcIcon, X } from "lucide-react";
import { ScientificCalculator } from "./ScientificCalculator";

const STORAGE_OPEN = "calc-widget-open";

const PANEL_WIDTH = 460;
const BUTTON_RIGHT = 20;
const BUTTON_BOTTOM = 20;

/**
 * Floating calculator widget.
 *
 * Layout rules:
 *  - The closed-state button is pinned to the bottom-right corner.
 *  - The open panel is locked to the centre of the viewport. No drag.
 *  - A blurred backdrop dims the page when the panel is open;
 *    clicking it closes the calculator.
 *  - Open/closed state and the typed expression survive page
 *    navigations and reloads via localStorage.
 *
 * The widget is mounted at the App root so it overlays every page.
 */
export function CalculatorWidget() {
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_OPEN) === "1";
    } catch {
      return false;
    }
  });

  // Persist open state
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_OPEN, open ? "1" : "0");
    } catch {
      // ignore
    }
  }, [open]);

  // ESC closes the panel; Ctrl/Cmd+K toggles it.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      const isToggleHotkey =
        (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k";
      if (isToggleHotkey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Full-page backdrop with blur. Click to close. Sits behind the
          calculator panel but above the page content. */}
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Lukk kalkulator"
          className="fixed inset-0 z-30 cursor-default animate-[calc-fade_180ms_ease-out]"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "rgba(15, 12, 41, 0.45)",
          }}
        />
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kalkulator"
          className={clsx(
            "fixed z-40 overflow-hidden rounded-2xl",
            "animate-[calc-pop_180ms_ease-out]",
          )}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${PANEL_WIDTH}px`,
            maxWidth: "calc(100vw - 40px)",
            background: "linear-gradient(180deg, #0a0a0e 0%, #050507 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          <header
            className="flex select-none items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <CalcIcon size={16} style={{ color: "rgba(245,158,11,0.85)" }} />
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "rgba(245,158,11,0.85)" }}
              >
                Kalkulator
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Lukk kalkulator"
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }}
            >
              <X size={16} />
            </button>
          </header>
          <div className="px-5 pb-5 pt-4">
            <ScientificCalculator />
          </div>
        </div>
      )}

      {/* Closed-state button: pinned to bottom-right. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Åpne kalkulator"
          aria-expanded={false}
          className={clsx(
            "fixed z-40 flex h-12 w-12 select-none items-center justify-center rounded-full transition-all",
            "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
            "border border-primary-2/20 bg-primary-2 text-white hover:bg-primary-3",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
          )}
          style={{ right: `${BUTTON_RIGHT}px`, bottom: `${BUTTON_BOTTOM}px` }}
          title="Åpne kalkulator (Ctrl/Cmd + K)"
        >
          <CalcIcon size={20} />
        </button>
      )}
    </>
  );
}
