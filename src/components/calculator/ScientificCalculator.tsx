import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { evaluate } from "mathjs";
import { useCalculatorStyle } from "./calculator-style";

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
 * the user can type or paste √, π, ÷, ×, − directly. Also rewrites
 * textbook shorthand mathjs doesn't know natively:
 *   `C(n, k)`  →  `combinations(n, k)`
 *   `P(n, k)`  →  `permutations(n, k)`
 *   `ln(x)`    →  `log(x)`     (mathjs `log` defaults to natural log)
 */
function normalizeExpression(input: string): string {
  const s = input
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/−/g, "-") // unicode minus to ASCII hyphen
    .replace(/π/g, "pi")
    // Only rewrites the call form `C(...)`, not bare `C` used as a
    // variable. Word boundary keeps things like `aC(` from being
    // hijacked.
    .replace(/\bC\s*\(/g, "combinations(")
    // Same shorthand for permutations: `P(n, k)` = n!/(n-k)!. Note
    // that this also rewrites `P(x) = ...` assignments — users who
    // want a variable named P should pick a non-conflicting name.
    .replace(/\bP\s*\(/g, "permutations(")
    // ln is not a mathjs function; map it to the single-argument
    // `log(...)` form which IS the natural logarithm in mathjs.
    .replace(/\bln\s*\(/g, "log(");

  return s
    // `√(...)` — let the existing `(` serve as the function-call opener so
    // the user's matching `)` closes it. Works for any nesting depth,
    // unlike a paren-balanced regex.
    .replace(/√\s*\(/g, "sqrt(")
    // `√<number>` or `√<identifier>` — wrap the bare operand.
    .replace(/√\s*(\d+(?:\.\d+)?|[a-zA-Z_][a-zA-Z0-9_]*)/g, "sqrt($1)")
    // Trailing `√` (user is still typing) — open a sqrt call.
    .replace(/√/g, "sqrt(");
}

/**
 * Minimal expression-evaluator calculator: just an input field and a
 * live result row. No keypad, no history. The user types whatever
 * mathjs accepts (plus the unicode shortcuts `√`, `π`, `÷`, `×`, `−`).
 *
 * The expression is persisted to localStorage so it survives close-
 * and-reopen and page navigation.
 */
interface Props {
  rounded: boolean;
  decimals: number;
}

export function ScientificCalculator({ rounded, decimals }: Props) {
  const [, , style] = useCalculatorStyle();
  const [expr, setExpr] = useState<string>(() => loadString(STORAGE_EXPR));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveString(STORAGE_EXPR, expr);
  }, [expr]);

  function tryEvaluate(
    input: string,
  ):
    | { ok: true; value: string; approx: boolean }
    | { ok: false; error: string } {
    if (!input.trim()) return { ok: true, value: "", approx: false };
    try {
      const normalized = normalizeExpression(input);
      const raw = evaluate(normalized);
      if (typeof raw === "function") {
        return { ok: true, value: "(funksjon)", approx: false };
      }
      if (rounded && typeof raw === "number" && Number.isFinite(raw)) {
        const roundedRaw = evaluate(`round(${normalized}, ${decimals})`);
        const approx = roundedRaw !== raw;
        return { ok: true, value: String(roundedRaw), approx };
      }
      return { ok: true, value: String(raw), approx: false };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Feil i uttrykket" };
    }
  }

  const evaluation = tryEvaluate(expr);
  const liveResult = evaluation.ok ? evaluation.value : null;
  const isApprox = evaluation.ok ? evaluation.approx : false;
  const errorMsg = !evaluation.ok ? evaluation.error : null;

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // No-op; left in place so a future Enter-action can plug in here.
    void e;
  }

  return (
    <div className="flex flex-col">
      {/* Input */}
      <div
        className="flex items-center rounded-md px-3 py-3"
        style={style.inputRow}
      >
        <input
          ref={inputRef}
          className="w-full bg-transparent font-mono text-[16px] outline-none"
          style={{
            color: style.inputInk,
            caretColor: style.inputCaret,
          }}
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
      <div
        className="mt-2 flex h-[52px] items-center gap-2.5 rounded-md px-3"
        style={style.resultRow}
      >
        <span
          className="font-mono text-[15px] font-bold leading-none"
          style={{ color: style.resultEq }}
          aria-label={isApprox ? "tilnærmet lik" : "lik"}
        >
          {isApprox ? "≈" : "="}
        </span>
        {errorMsg ? (
          <span className="font-mono text-[12px] font-semibold leading-none" style={{ color: "#f87171" }}>
            {errorMsg}
          </span>
        ) : !expr.trim() ? (
          <span className="font-mono text-[12px] italic leading-none" style={{ color: style.resultPlaceholder }}>
            resultat vises her
          </span>
        ) : (
          <span
            className="break-all font-mono text-[20px] font-bold leading-none"
            style={{ color: style.resultValueInk }}
          >
            {liveResult || "—"}
          </span>
        )}
      </div>
    </div>
  );
}
