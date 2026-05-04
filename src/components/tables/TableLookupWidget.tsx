import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import type { Table } from "@/data/schema";
import {
  lookupCumulative,
  lookupInverse,
  computeBonus,
  computeInverseBonus,
} from "./distributions";

interface Props {
  table: Table;
  vals: Record<string, number>;
  setVals: (next: Record<string, number>) => void;
}

type Mode = "forward" | "inverse";

const MODE_RESULT_PREFIX: Record<Mode, (t: Table) => string> = {
  forward: (t) => t.output,
  inverse: (t) => t.inverse?.output ?? "",
};

function toggleLabelFor(table: Table, mode: Mode): string {
  if (mode === "forward") {
    return table.toggle_label ?? "z → p";
  }
  return table.inverse?.toggle_label ?? "p → z";
}

function hintFor(table: Table, mode: Mode): string | undefined {
  return mode === "forward" ? table.input_hint : table.inverse?.input_hint;
}

export function TableLookupWidget({ table, vals, setVals }: Props) {
  const supportsInverse = !!table.inverse;
  const [mode, setMode] = useState<Mode>("forward");

  // Pick the active input set + default values per mode. The forward `vals`
  // is owned by the parent (so the printed table can highlight the right
  // row); the inverse mode keeps its own local state since the user is
  // entering a probability rather than scanning the printed grid.
  const activeInputs = mode === "inverse" && table.inverse ? table.inverse.inputs : table.inputs;

  const inverseDefaults = useMemo(
    () =>
      Object.fromEntries(
        (table.inverse?.inputs ?? []).map((i) => [i.name, defaultValueFor(i.name)]),
      ),
    [table.inverse],
  );
  const [inverseVals, setInverseVals] = useState<Record<string, number>>(inverseDefaults);
  // When the table changes (route swap), reset inverse state.
  useEffect(() => {
    setInverseVals(inverseDefaults);
    setMode("forward");
  }, [table.id, inverseDefaults]);

  const liveVals = mode === "inverse" ? inverseVals : vals;
  const writeVals = mode === "inverse" ? setInverseVals : setVals;

  // Local string state per input so the user can temporarily clear/edit
  // without forcing a numeric value back into the field.
  const [text, setText] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(liveVals).map(([k, v]) => [k, String(v)])),
  );
  useEffect(() => {
    setText((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(liveVals)) {
        if (Number(prev[k]) !== v) next[k] = String(v);
      }
      // Clear stale keys from the other mode so the input field doesn't
      // render a value that doesn't belong to the active mode.
      for (const k of Object.keys(prev)) {
        if (!(k in liveVals)) delete next[k];
      }
      return next;
    });
  }, [liveVals]);

  const handleChange = (name: string, raw: string) => {
    setText((prev) => ({ ...prev, [name]: raw }));
    if (raw === "" || raw === "-" || raw === "." || raw === "-.") return;
    const num = Number(raw);
    if (!Number.isNaN(num)) {
      writeVals({ ...liveVals, [name]: num });
    }
  };

  let result: number;
  let bonuses: ReturnType<typeof computeBonus>;
  try {
    if (mode === "inverse") {
      result = lookupInverse({ distribution: table.distribution, inputs: liveVals });
      bonuses = computeInverseBonus({ distribution: table.distribution, inputs: liveVals });
    } else {
      result = lookupCumulative({ distribution: table.distribution, inputs: liveVals });
      bonuses = computeBonus({ distribution: table.distribution, inputs: liveVals });
    }
  } catch {
    result = NaN;
    bonuses = [];
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border px-7 py-6 font-mono"
      style={{
        background: "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
        borderColor: "var(--color-calc-border)",
        color: "var(--color-calc-text)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-7 -top-7 h-[180px] w-[180px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div
          className="font-mono text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-calc-label)" }}
        >
          <Search size={12} className="mr-1.5 inline-block align-text-bottom" />
          Slå opp
        </div>
        {supportsInverse && (
          <div
            role="tablist"
            aria-label="Lookup-retning"
            className="inline-flex rounded-md border border-white/15 bg-white/5 p-0.5"
          >
            {(["forward", "inverse"] as Mode[]).map((m) => {
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setMode(m)}
                  className="rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
                  style={{
                    background: isActive ? "rgba(34, 211, 238, 0.18)" : "transparent",
                    color: isActive ? "#bef264" : "var(--color-calc-label)",
                  }}
                >
                  {toggleLabelFor(table, m)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {activeInputs.map((inp) => (
          <label key={inp.name} className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[12px] font-medium opacity-90">
              <span className="font-math text-base" style={{ color: "#c7d2fe" }}>
                {inp.name}
              </span>
            </span>
            <input
              type="number"
              value={text[inp.name] ?? ""}
              min={inp.min}
              max={inp.max}
              step={inp.type === "integer" ? 1 : "any"}
              onChange={(e) => handleChange(inp.name, e.target.value)}
              onFocus={(e) => e.target.select()}
              className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-[15px] font-medium text-white focus:border-cyan focus:outline-none focus:bg-cyan/5"
            />
          </label>
        ))}
      </div>

      {hintFor(table, mode) && (
        <div
          className="-mt-3 mb-4 rounded-md border-l-2 px-3 py-2 text-[12px] leading-relaxed"
          style={{
            borderColor: "#818cf8",
            background: "rgba(129, 140, 248, 0.06)",
            color: "var(--color-calc-text)",
          }}
        >
          <span className="opacity-70">↳ </span>
          {hintFor(table, mode)}
        </div>
      )}

      <hr
        className="my-4 border-0"
        style={{ height: 1, background: "var(--color-calc-divider)" }}
      />

      <div
        className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-calc-label)" }}
      >
        Resultat
      </div>
      <div
        className="text-[26px] font-bold tracking-wide"
        style={{ color: "var(--color-calc-result)" }}
      >
        {MODE_RESULT_PREFIX[mode](table)} ≈{" "}
        {Number.isFinite(result) ? result.toFixed(4) : "—"}
      </div>

      {bonuses.length > 0 && (
        <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {bonuses.map((b, i) => (
            <div
              key={i}
              className="rounded-r border-l-2 bg-white/5 px-3 py-2"
              style={{ borderColor: "#818cf8" }}
            >
              <div
                className="mb-1 font-mono text-[10px] uppercase tracking-wider"
                style={{ color: "var(--color-calc-label)" }}
              >
                {b.label}
              </div>
              <div className="text-[15px]">{b.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function defaultValueFor(name: string): number {
  if (name === "p") return 0.95;
  return 0;
}
