import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Calculator as CalcIcon, X } from "lucide-react";
import { ScientificCalculator } from "./ScientificCalculator";

const STORAGE_KEY = "calc-widget-open";

/**
 * Floating calculator widget pinned to the bottom-right of the
 * viewport. Closed it shows just a small button with a calculator
 * glyph; click to open a panel that holds the full ScientificCalculator
 * (mathjs-backed expression evaluator, keypad, history). The panel
 * sits above all routes and is mounted at the App root, so the
 * calculator is reachable from any page.
 *
 * Open/close state is persisted across navigations and reloads via
 * localStorage so the user keeps the calculator handy once opened.
 */
export function CalculatorWidget() {
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
    } catch {
      // localStorage may be unavailable (private mode, quota); fail silently.
    }
  }, [open]);

  // ESC closes the panel.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Kalkulator"
          className={clsx(
            "w-[360px] max-w-[calc(100vw-40px)] rounded-xl border border-line bg-card",
            "shadow-2xl shadow-primary/15",
            "animate-[calc-pop_180ms_ease-out]",
          )}
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2">
              <CalcIcon size={16} className="text-primary-2" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-2">
                Kalkulator
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Lukk kalkulator"
              className="flex h-7 w-7 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <X size={16} />
            </button>
          </header>
          <div className="px-4 pb-4 pt-3">
            <ScientificCalculator />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Lukk kalkulator" : "Åpne kalkulator"}
        aria-expanded={open}
        className={clsx(
          "flex h-12 w-12 items-center justify-center rounded-full transition-all",
          "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
          open
            ? "border border-line bg-card text-ink-2 hover:bg-paper-2"
            : "border border-primary-2/20 bg-primary-2 text-white hover:bg-primary-3",
        )}
      >
        {open ? <X size={20} /> : <CalcIcon size={20} />}
      </button>
    </div>
  );
}
