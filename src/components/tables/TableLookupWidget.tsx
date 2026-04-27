import { useState } from "react";
import { Search } from "lucide-react";
import type { Table } from "@/data/schema";
import { lookupCumulative, computeBonus } from "./distributions";

interface Props {
  table: Table;
}

export function TableLookupWidget({ table }: Props) {
  const initial = Object.fromEntries(
    table.inputs.map((i) => [i.name, i.min ?? 0])
  );
  const [vals, setVals] = useState<Record<string, number>>(initial);

  const result = lookupCumulative({ distribution: table.distribution, inputs: vals });
  const bonuses = computeBonus({ distribution: table.distribution, inputs: vals });

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
      <div
        className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-calc-label)" }}
      >
        <Search size={12} className="mr-1.5 inline-block align-text-bottom" />
        Slå opp
      </div>
      <div className="mb-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {table.inputs.map((inp) => (
          <label key={inp.name} className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[12px] font-medium opacity-90">
              <span
                className="font-math text-base"
                style={{ color: "#c7d2fe" }}
              >
                {inp.name}
              </span>
            </span>
            <input
              type="number"
              value={vals[inp.name]}
              min={inp.min}
              max={inp.max}
              step={inp.type === "integer" ? 1 : "any"}
              onChange={(e) =>
                setVals((v) => ({ ...v, [inp.name]: Number(e.target.value) }))
              }
              className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-[15px] font-medium text-white focus:border-cyan focus:outline-none focus:bg-cyan/5"
            />
          </label>
        ))}
      </div>
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
        {table.output} ≈ {result.toFixed(4)}
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
