import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Calculator as CalcIcon, X } from "lucide-react";
import { ScientificCalculator } from "./ScientificCalculator";

const STORAGE_OPEN = "calc-widget-open";

const PANEL_WIDTH = 460;
const BUTTON_RIGHT = 20;
const BUTTON_BOTTOM = 20;

const CLOSE_ANIM_MS = 180;

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

  // `mounted` lags behind `open` during close so the panel and backdrop
  // can play an exit animation before unmounting. `closing` flips on
  // for that brief window so we can swap the keyframe class.
  const [mounted, setMounted] = useState<boolean>(open);
  const [closing, setClosing] = useState<boolean>(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      setMounted(true);
      setClosing(false);
      return;
    }
    if (mounted) {
      setClosing(true);
      closeTimer.current = setTimeout(() => {
        setMounted(false);
        setClosing(false);
        closeTimer.current = null;
      }, CLOSE_ANIM_MS);
    }
  }, [open, mounted]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

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
      {/* Full-page backdrop. Uniform 10px blur + 70% pure black so
          the page becomes a faint texture and focus snaps to the
          monochrome panel. */}
      {mounted && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Lukk kalkulator"
          className={clsx(
            "fixed inset-0 z-30 cursor-default",
            closing
              ? "animate-[calc-fade-out_180ms_ease-out_forwards]"
              : "animate-[calc-fade_180ms_ease-out]",
          )}
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background: "rgba(0, 0, 0, 0.7)",
          }}
        />
      )}

      {mounted && (
        <div
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
        >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kalkulator"
          className={clsx(
            "pointer-events-auto overflow-hidden rounded-[18px]",
            closing
              ? "animate-[calc-pop-out_180ms_ease-out_forwards]"
              : "animate-[calc-pop_180ms_ease-out]",
          )}
          style={{
            width: `${PANEL_WIDTH}px`,
            maxWidth: "calc(100vw - 40px)",
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.7)",
          }}
        >
          <header
            className="flex select-none items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <CalcIcon size={16} style={{ color: "rgba(255,255,255,0.95)" }} />
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.95)" }}
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
        </div>
      )}

      {/* Closed-state button: pinned to bottom-right. Held back until
          the close animation has fully unmounted the panel so the
          two never overlap. Styled to match the panel: solid #111
          with the same hairline white border and a deep black drop
          shadow, so the open and closed states feel like one object. */}
      {!mounted && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Åpne kalkulator"
          aria-expanded={false}
          className={clsx(
            "fixed z-40 flex h-12 w-12 select-none items-center justify-center rounded-full transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          )}
          style={{
            right: `${BUTTON_RIGHT}px`,
            bottom: `${BUTTON_BOTTOM}px`,
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.95)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.55)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1a1a1a";
            e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,0.65)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#111111";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.55)";
          }}
          title="Åpne kalkulator (Ctrl/Cmd + K)"
        >
          <CalcIcon size={20} />
        </button>
      )}
    </>
  );
}
