import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { evaluate } from "mathjs";

const STORAGE_EXPR = "calc-widget-expr";

function loadString(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function saveString(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable; fail silently.
  }
}

/**
 * Translate user-friendly unicode math symbols into mathjs syntax so
 * the user can type or paste √, π, ÷, ×, − directly. Mirrors the
 * Dashboard-react calculator's normaliser; copied verbatim so behaviour
 * is identical between the two products.
 */
function normalizeExpression(input: string): string {
  const s = input
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/−/g, "-") // unicode minus to ASCII hyphen
    .replace(/π/g, "pi");

  return s.replace(
    /√\s*(\([^()]*\)|\d+(?:\.\d+)?|[a-zA-Z_][a-zA-Z0-9_]*)?/g,
    (_match, operand?: string) => {
      if (!operand) return "sqrt(";
      if (operand.startsWith("(")) return `sqrt${operand}`;
      return `sqrt(${operand})`;
    },
  );
}

/**
 * Minimal expression-evaluator calculator: just an input field and a
 * live result row. No keypad, no history. The user types whatever
 * mathjs accepts (plus the unicode shortcuts `√`, `π`, `÷`, `×`, `−`).
 *
 * The expression is persisted to localStorage so it survives close-
 * and-reopen and page navigation.
 */
export function ScientificCalculator() {
  const [expr, setExpr] = useState<string>(() => loadString(STORAGE_EXPR));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveString(STORAGE_EXPR, expr);
  }, [expr]);

  function tryEvaluate(input: string): { ok: true; value: string } | { ok: false; error: string } {
    if (!input.trim()) return { ok: true, value: "" };
    try {
      const result = evaluate(normalizeExpression(input));
      const out = typeof result === "function" ? "(funksjon)" : String(result);
      return { ok: true, value: out };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Feil i uttrykket" };
    }
  }

  const evaluation = tryEvaluate(expr);
  const liveResult = evaluation.ok ? evaluation.value : null;
  const errorMsg = !evaluation.ok ? evaluation.error : null;

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // No-op; left in place so a future Enter-action can plug in here.
    void e;
  }

  return (
    <div className="flex flex-col">
      {/* Input */}
      <div className="flex items-center rounded-md border border-line bg-paper-2 px-3 py-2.5">
        <input
          ref={inputRef}
          className="w-full bg-transparent font-mono text-[15px] text-ink outline-none placeholder:italic placeholder:text-ink-3"
          type="text"
          spellCheck={false}
          autoComplete="off"
          placeholder="Skriv et uttrykk…"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
        />
      </div>

      {/* Live result. Fixed height + items-center keeps the row size
          stable as content swaps between placeholder/error/value. */}
      <div className="mt-1.5 flex h-[44px] items-center gap-2.5 rounded-md border border-cyan-2/30 bg-cyan-soft/30 px-3">
        <span className="font-mono text-[14px] font-bold leading-none text-cyan-deep/70">=</span>
        {errorMsg ? (
          <span className="font-mono text-[12px] font-semibold leading-none text-warn">{errorMsg}</span>
        ) : !expr.trim() ? (
          <span className="font-mono text-[12px] italic leading-none text-ink-3">resultat vises her</span>
        ) : (
          <span className="break-all font-mono text-[18px] font-bold leading-none text-cyan-deep">{liveResult || "—"}</span>
        )}
      </div>
    </div>
  );
}
