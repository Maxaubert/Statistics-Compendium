import { useEffect, useState, type CSSProperties } from "react";

/**
 * Visual skin for the floating calculator widget. Stored in
 * localStorage so the user's choice survives reloads and page
 * navigations. The skin affects both the outer panel (handled in
 * CalculatorWidget) and the inner input + result rows (handled in
 * ScientificCalculator) — they read the same active style id.
 */

export type CalculatorStyleId = "monochrome" | "acrylic-rainbow";

export interface CalculatorStyleConfig {
  id: CalculatorStyleId;
  label: string;
  description: string;

  /** Outer panel — applied to the dialog shell. */
  panel: CSSProperties;
  /** Optional decorative pseudo-stripe drawn at the top of the panel
   *  via a top-bordered absolute element. Used by acrylic-rainbow. */
  topAccent?: { gradient: string; height: number; glow?: string };
  /** Header bottom divider color. */
  headerDivider: string;
  /** Header text + icon color. */
  headerInk: string;
  /** Close button colors at rest, hover. */
  closeRest: string;
  closeHoverBg: string;
  closeHoverInk: string;

  /** Input row inner box. */
  inputRow: CSSProperties;
  inputInk: string;
  inputCaret: string;

  /** Result row inner box. */
  resultRow: CSSProperties;
  /** "=" sign color. */
  resultEq: string;
  /** Final value color (when expression is valid and non-empty). */
  resultValueInk: string;
  /** Placeholder when expression is empty. */
  resultPlaceholder: string;
}

export const CALCULATOR_STYLES: Record<CalculatorStyleId, CalculatorStyleConfig> = {
  monochrome: {
    id: "monochrome",
    label: "Monokrom",
    description: "Standard mørk monokrom — solid #111 panel, hårtynn hvit kant og dyp svart skygge.",

    panel: {
      background: "#111111",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 24px 70px rgba(0,0,0,0.7)",
    },
    headerDivider: "1px solid rgba(255,255,255,0.08)",
    headerInk: "rgba(255,255,255,0.95)",
    closeRest: "rgba(255,255,255,0.55)",
    closeHoverBg: "rgba(255,255,255,0.08)",
    closeHoverInk: "white",

    inputRow: {
      background: "#151515",
      border: "1px solid rgba(255,255,255,0.08)",
    },
    inputInk: "rgba(255,255,255,0.95)",
    inputCaret: "white",

    resultRow: {
      background: "#151515",
      border: "1px solid rgba(255,255,255,0.14)",
    },
    resultEq: "rgba(255,255,255,0.6)",
    resultValueInk: "white",
    resultPlaceholder: "rgba(255,255,255,0.4)",
  },

  "acrylic-rainbow": {
    id: "acrylic-rainbow",
    label: "Akrylglass + regnbue-stripe",
    description:
      "macOS-style frostet akryl med backdrop-blur og en regnbue-aksent øverst på panelet.",

    panel: {
      background: "rgba(20, 20, 30, 0.55)",
      backdropFilter: "blur(40px) saturate(200%)",
      WebkitBackdropFilter: "blur(40px) saturate(200%)",
      boxShadow:
        "0 30px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
    },
    topAccent: {
      gradient:
        "linear-gradient(90deg, transparent 0%, #a855f7 18%, #22d3ee 38%, #4ade80 55%, #fcd34d 72%, #f472b6 88%, transparent 100%)",
      height: 3,
      glow: "0 0 10px rgba(168, 85, 247, 0.55)",
    },
    headerDivider: "1px solid rgba(255,255,255,0.10)",
    headerInk: "rgba(255,255,255,0.95)",
    closeRest: "rgba(255,255,255,0.65)",
    closeHoverBg: "rgba(255,255,255,0.12)",
    closeHoverInk: "white",

    inputRow: {
      background: "rgba(0, 0, 0, 0.20)",
      backdropFilter: "blur(12px) saturate(150%)",
      WebkitBackdropFilter: "blur(12px) saturate(150%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
    },
    inputInk: "rgba(255, 255, 255, 0.95)",
    inputCaret: "white",

    resultRow: {
      background: "rgba(0, 0, 0, 0.30)",
      backdropFilter: "blur(12px) saturate(150%)",
      WebkitBackdropFilter: "blur(12px) saturate(150%)",
      border: "1px solid rgba(255, 255, 255, 0.18)",
    },
    resultEq: "rgba(255, 255, 255, 0.65)",
    resultValueInk: "white",
    resultPlaceholder: "rgba(255, 255, 255, 0.45)",
  },
};

const STORAGE_KEY = "calc-widget-style";
const STYLE_EVENT = "calc-widget-style-change";

function readStored(): CalculatorStyleId {
  if (typeof window === "undefined") return "monochrome";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v && v in CALCULATOR_STYLES) return v as CalculatorStyleId;
  } catch {
    // ignore
  }
  return "monochrome";
}

/**
 * Subscribe to the active calculator style. Returns a tuple of the
 * current id, a setter, and the resolved config. The setter persists
 * to localStorage and broadcasts a custom event so every mounted
 * calculator consumer (panel, rows, picker preview) updates in lockstep.
 */
export function useCalculatorStyle(): [
  CalculatorStyleId,
  (id: CalculatorStyleId) => void,
  CalculatorStyleConfig,
] {
  const [id, setId] = useState<CalculatorStyleId>(() => readStored());

  useEffect(() => {
    function onChange() {
      setId(readStored());
    }
    window.addEventListener(STYLE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(STYLE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  function update(next: CalculatorStyleId) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    setId(next);
    window.dispatchEvent(new CustomEvent(STYLE_EVENT));
  }

  return [id, update, CALCULATOR_STYLES[id]];
}
