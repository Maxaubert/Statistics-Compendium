import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Calculator as CalcIcon, ChevronDown, ChevronUp } from "lucide-react";
import { ScientificCalculator } from "./ScientificCalculator";
import { useCalculatorStyle } from "./calculator-style";

const STORAGE_OPEN = "calc-widget-open";
const STORAGE_ROUND = "calc-widget-round";
const STORAGE_DECIMALS = "calc-widget-decimals";

function loadStr(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}
function saveStr(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

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
  const [, , style] = useCalculatorStyle();
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

  // Round-output controls live in the header; the result is wrapped in
  // `round(expr, decimals)` when the toggle is on. State persisted so
  // it survives reload and reopen.
  const [rounded, setRounded] = useState<boolean>(
    () => loadStr(STORAGE_ROUND) === "1",
  );
  const [decimals, setDecimals] = useState<number>(() => {
    const raw = loadStr(STORAGE_DECIMALS);
    const n = raw ? Number(raw) : 2;
    return Number.isInteger(n) && n >= 0 && n <= 15 ? n : 2;
  });
  useEffect(() => {
    saveStr(STORAGE_ROUND, rounded ? "1" : "0");
  }, [rounded]);
  useEffect(() => {
    saveStr(STORAGE_DECIMALS, String(decimals));
  }, [decimals]);

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
          style={style.backdrop}
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
            "pointer-events-auto relative overflow-hidden rounded-[18px]",
            closing
              ? "animate-[calc-pop-out_180ms_ease-out_forwards]"
              : "animate-[calc-pop_180ms_ease-out]",
          )}
          style={{
            width: `${PANEL_WIDTH}px`,
            maxWidth: "calc(100vw - 40px)",
            ...style.panel,
          }}
        >
          {style.topAccent && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 top-0"
              style={{
                height: `${style.topAccent.height}px`,
                background: style.topAccent.gradient,
                boxShadow: style.topAccent.glow,
                zIndex: 1,
              }}
            />
          )}
          <header
            className="flex select-none items-center justify-between px-5 py-3.5"
            style={{ borderBottom: style.headerDivider }}
          >
            <div className="flex items-center gap-2">
              <CalcIcon size={16} style={{ color: style.headerInk }} />
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: style.headerInk }}
              >
                Kalkulator
              </span>
            </div>
            <RoundPill
              rounded={rounded}
              decimals={decimals}
              onToggle={() => setRounded((v) => !v)}
              onChangeDecimals={setDecimals}
              ink={style.headerInk}
            />
          </header>
          <div className="px-5 pb-5 pt-4">
            <ScientificCalculator rounded={rounded} decimals={decimals} />
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

/**
 * Round-output control for the calculator header.
 *
 * Layout: iOS-style toggle switch + "Avrund" label + a number cell
 * with stacked chevron-up/chevron-down stepper buttons on the right
 * for adjusting the decimal count. The native number-input arrows
 * are hidden via CSS; the chevrons live above/below a flush number
 * input so the row stays compact.
 */
function RoundPill({
  rounded,
  decimals,
  onToggle,
  onChangeDecimals,
  ink,
}: {
  rounded: boolean;
  decimals: number;
  onToggle: () => void;
  onChangeDecimals: (n: number) => void;
  ink: string;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(15, Math.floor(n)));
  return (
    <div className="flex items-center gap-2">
      {/* Toggle switch */}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={rounded}
        aria-label={rounded ? "Skru av avrunding" : "Skru på avrunding"}
        className="relative inline-flex h-[18px] w-[32px] items-center rounded-full transition-colors"
        style={{
          background: rounded ? "rgb(34, 211, 238)" : "rgba(255,255,255,0.15)",
        }}
      >
        <span
          aria-hidden
          className="inline-block h-[14px] w-[14px] rounded-full bg-white transition-transform"
          style={{
            transform: rounded ? "translateX(16px)" : "translateX(2px)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        />
      </button>
      {/* Label */}
      <span
        className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: ink, opacity: rounded ? 1 : 0.55 }}
      >
        Avrund
      </span>
      {/* Number + custom stepper */}
      <div
        className="flex h-7 items-stretch rounded-md border"
        style={{
          borderColor: rounded ? "rgba(34, 211, 238, 0.45)" : "rgba(255,255,255,0.15)",
          background: rounded ? "rgba(34, 211, 238, 0.08)" : "transparent",
          opacity: rounded ? 1 : 0.5,
          transition: "background 140ms, border-color 140ms, opacity 140ms",
        }}
      >
        <input
          type="number"
          min={0}
          max={15}
          step={1}
          value={decimals}
          disabled={!rounded}
          onChange={(e) => onChangeDecimals(clamp(Number(e.target.value) || 0))}
          className="calc-no-spin w-7 bg-transparent px-1 text-center font-mono text-[13px] font-bold outline-none disabled:cursor-not-allowed"
          style={{ color: ink }}
          aria-label="Antall desimaler"
        />
        <div
          className="flex flex-col"
          style={{
            borderLeft: rounded
              ? "1px solid rgba(34, 211, 238, 0.25)"
              : "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <button
            type="button"
            onClick={() => rounded && onChangeDecimals(clamp(decimals + 1))}
            disabled={!rounded || decimals >= 15}
            aria-label="Øk desimaler"
            className="flex h-[14px] w-5 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: ink }}
            onMouseEnter={(e) => {
              if (rounded && decimals < 15)
                e.currentTarget.style.background = "rgba(34, 211, 238, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <ChevronUp size={11} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={() => rounded && onChangeDecimals(clamp(decimals - 1))}
            disabled={!rounded || decimals <= 0}
            aria-label="Reduser desimaler"
            className="flex h-[14px] w-5 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              color: ink,
              borderTop: rounded
                ? "1px solid rgba(34, 211, 238, 0.25)"
                : "1px solid rgba(255,255,255,0.10)",
            }}
            onMouseEnter={(e) => {
              if (rounded && decimals > 0)
                e.currentTarget.style.background = "rgba(34, 211, 238, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <ChevronDown size={11} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
