import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { evaluate } from "mathjs";
import { clsx } from "clsx";

interface CalcEntry {
  expr: string;
  result: string;
}

const STORAGE_EXPR = "calc-widget-expr";
const STORAGE_HISTORY = "calc-widget-history";

function loadString(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function loadHistory(): CalcEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is CalcEntry =>
        x && typeof x.expr === "string" && typeof x.result === "string",
    );
  } catch {
    return [];
  }
}

function saveString(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable; fail silently.
  }
}

function saveHistory(entries: CalcEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_HISTORY, JSON.stringify(entries));
  } catch {
    // ignore quota / private mode errors
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

const KEYS: Array<{ label: string; insert?: string; action?: "backspace" | "clear"; accent?: boolean; span?: number }> = [
  { label: "7", insert: "7" }, { label: "8", insert: "8" }, { label: "9", insert: "9" },
  { label: "÷", insert: "/" }, { label: "(", insert: "(" }, { label: ")", insert: ")" },

  { label: "4", insert: "4" }, { label: "5", insert: "5" }, { label: "6", insert: "6" },
  { label: "×", insert: "*" }, { label: "√", insert: "√" }, { label: "π", insert: "pi" },

  { label: "1", insert: "1" }, { label: "2", insert: "2" }, { label: "3", insert: "3" },
  { label: "−", insert: "-" }, { label: "x²", insert: "^2" }, { label: "xʸ", insert: "^" },

  { label: "0", insert: "0" }, { label: ".", insert: "." }, { label: "%", insert: "%" },
  { label: "+", insert: "+" }, { label: "sin", insert: "sin(" }, { label: "cos", insert: "cos(" },

  { label: "tan", insert: "tan(" }, { label: "log", insert: "log10(" }, { label: "ln", insert: "log(" },
  { label: "eˣ", insert: "exp(" }, { label: "e", insert: "e" }, { label: "!", insert: "!" },

  { label: "⌫", action: "backspace", span: 3 },
  { label: "C", action: "clear", accent: true, span: 3 },
];

export function ScientificCalculator() {
  const [expr, setExpr] = useState<string>(() => loadString(STORAGE_EXPR));
  const [history, setHistory] = useState<CalcEntry[]>(() => loadHistory());
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist expression and history to localStorage so the calculator
  // remembers state across closes and page navigations.
  useEffect(() => {
    saveString(STORAGE_EXPR, expr);
  }, [expr]);
  useEffect(() => {
    saveHistory(history);
  }, [history]);

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

  function commit() {
    if (!expr.trim() || !evaluation.ok || !evaluation.value) return;
    setHistory((prev) => [{ expr, result: evaluation.value }, ...prev].slice(0, 12));
    setExpr("");
    inputRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
  }

  function appendKey(s: string) {
    const input = inputRef.current;
    if (!input) {
      setExpr((prev) => prev + s);
      return;
    }
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const newValue = input.value.slice(0, start) + s + input.value.slice(end);
    setExpr(newValue);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      const pos = start + s.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function clear() {
    setExpr("");
    inputRef.current?.focus();
  }

  function backspace() {
    setExpr((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  }

  function recall(entry: CalcEntry) {
    setExpr(entry.expr);
    inputRef.current?.focus();
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
          stable as content swaps between placeholder/error/value, so
          the panel above doesn't shift when the user types. */}
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

      {/* Keypad */}
      <div className="mt-3 grid grid-cols-6 gap-1.5">
        {KEYS.map((k, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (k.action === "backspace") return backspace();
              if (k.action === "clear") return clear();
              if (k.insert !== undefined) appendKey(k.insert);
            }}
            title={k.insert}
            className={clsx(
              "rounded-md border py-2 font-mono text-[13px] font-semibold transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
              k.accent
                ? "border-warn/40 bg-warn-soft/60 text-warn hover:bg-warn-soft hover:border-warn/60"
                : "border-line bg-card text-ink-2 hover:border-primary-2/40 hover:bg-paper-2",
            )}
            style={k.span ? { gridColumn: `span ${k.span}` } : undefined}
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* History */}
      <div className="mt-3 flex max-h-[160px] flex-col gap-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="rounded-md bg-paper-2/60 px-3 py-2 text-center font-serif text-[12px] italic text-ink-3">
            Trykk Enter for å lagre resultatet i historikken.
          </div>
        ) : (
          history.map((h, i) => (
            <button
              key={i}
              type="button"
              onClick={() => recall(h)}
              title="Klikk for å bruke på nytt"
              className="flex items-baseline justify-between gap-3 rounded-md border border-line bg-card px-3 py-1.5 text-left font-mono text-[12px] transition-colors hover:border-primary-2/40 hover:bg-paper-2"
            >
              <span className="truncate text-ink-2">{h.expr}</span>
              <span className="flex-shrink-0 font-semibold text-cyan-deep">= {h.result}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
