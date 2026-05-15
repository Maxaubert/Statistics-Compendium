import { useState } from "react";
import { jStat } from "jstat";
import { clsx } from "clsx";
import { Maximize2, Minimize2 } from "lucide-react";
import type { Table } from "@/data/schema";
import {
  MWW_TABLES,
  MWW_ALPHA_KEYS,
  MWW_N_MIN,
  MWW_N_MAX,
  snapMwwAlpha,
  type MwwAlphaKey,
} from "./mann-whitney-table";

type DistributionKey = Table["distribution"];

interface Props {
  distribution: DistributionKey;
  inputs: Record<string, number>;
}

export function PrintedTable({ distribution, inputs }: Props) {
  switch (distribution) {
    case "poisson":
      return <PoissonPrintedTable inputs={inputs} />;
    case "normal_cumulative":
      return <ZPrintedTable inputs={inputs} />;
    case "normal_quantile":
      return <ZQuantilePrintedTable />;
    case "t_quantile":
      return <TPrintedTable inputs={inputs} />;
    case "chi_squared_quantile":
      return <ChiSquaredPrintedTable inputs={inputs} />;
    case "binomial":
      return <BinomialPrintedTable inputs={inputs} />;
    case "mann_whitney_quantile":
      return <MannWhitneyPrintedTable inputs={inputs} />;
    default:
      return (
        <p className="px-4 py-3 italic text-ink-3">
          Trykt tabell ikke implementert for denne fordelingen – bruk det interaktive oppslaget over.
        </p>
      );
  }
}

// ===================== Mann-Whitney U-tabell =====================
function MannWhitneyPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const rawN1 = inputs["n₁"];
  const rawN2 = inputs["n₂"];
  const rawα = inputs.α;

  const selN1 = Number.isFinite(rawN1)
    ? Math.max(MWW_N_MIN, Math.min(MWW_N_MAX, Math.round(rawN1)))
    : null;
  const selN2 = Number.isFinite(rawN2)
    ? Math.max(MWW_N_MIN, Math.min(MWW_N_MAX, Math.round(rawN2)))
    : null;
  const activeKey: MwwAlphaKey = Number.isFinite(rawα)
    ? snapMwwAlpha(rawα)
    : "0.025";

  const table = MWW_TABLES[activeKey];
  const ns = Array.from(
    { length: MWW_N_MAX - MWW_N_MIN + 1 },
    (_, i) => i + MWW_N_MIN,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>
          Forkast H₀ hvis `U ≤ U_(α, n₁, n₂)`. «−» = ikke signifikans mulig.
        </span>
        <div className="font-serif italic text-primary">
          Markert: n₁ = {selN1 ?? "—"}, n₂ = {selN2 ?? "—"}, α = {activeKey}
        </div>
      </div>
      <div className="overflow-auto">
        <div className="px-5 pt-3 font-serif text-[13px] italic text-ink-3">
          {table.label}
        </div>
        <table className="w-full border-collapse font-mono text-[12.5px] text-ink-2">
          <thead className="bg-paper-2">
            <tr>
              <th className="px-2.5 py-1.5 text-center text-[11px] font-semibold text-ink-3">
                n₁ ↓ &nbsp; n₂ →
              </th>
              {ns.map((n2) => {
                const isCol = n2 === selN2;
                return (
                  <th
                    key={n2}
                    className={clsx(
                      "px-2.5 py-1.5 text-center text-[11px] font-semibold",
                      isCol
                        ? "bg-primary text-white"
                        : "bg-primary-soft text-primary",
                    )}
                  >
                    {n2}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => {
              const n1 = ns[i];
              const isRow = n1 === selN1;
              return (
                <tr
                  key={n1}
                  className={clsx(
                    "border-b border-line",
                    isRow && "bg-primary-2/[0.04]",
                  )}
                >
                  <td
                    className={clsx(
                      "bg-paper-2 px-2.5 py-1.5 text-center font-medium text-ink-3",
                      isRow && "bg-primary-soft font-bold text-primary",
                    )}
                  >
                    {n1}
                  </td>
                  {row.map((val, j) => {
                    const n2 = ns[j];
                    const isCol = n2 === selN2;
                    const isCell = isRow && isCol;
                    return (
                      <td
                        key={j}
                        className={clsx(
                          "px-2.5 py-1.5 text-center",
                          isCell
                            ? "bg-primary font-bold text-white shadow-[inset_0_0_0_2px_var(--color-warn)]"
                            : isCol
                              ? "bg-primary-2/[0.04]"
                              : "",
                        )}
                      >
                        {val === null ? (
                          <span className="text-ink-3">−</span>
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Silence unused-import warning for re-exports kept available to consumers.
void MWW_ALPHA_KEYS;

// ===================== Shared expand footer =====================
function ExpandFooter({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = expanded ? Minimize2 : Maximize2;
  return (
    <div className="flex justify-end border-t border-line bg-paper-2 px-3 py-2">
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          "inline-flex items-center gap-2 rounded-md border px-3 py-1.5",
          "font-mono text-[11px] font-semibold uppercase tracking-wider",
          "transition-colors",
          expanded
            ? "border-primary-3 bg-primary-soft text-primary"
            : "border-line bg-card text-primary-2 hover:border-primary-3 hover:bg-primary-soft",
        )}
      >
        <Icon size={11} aria-hidden />
        {expanded ? "Skjul hele tabellen" : "Vis hele tabellen"}
      </button>
    </div>
  );
}

// Common shell: scrollable body when expanded, no fixed cap when windowed.
function ExpandableShell({
  children,
  expanded,
  onToggle,
}: {
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div
        className={clsx(
          "overflow-auto",
          expanded && "max-h-[70vh]",
        )}
      >
        {children}
      </div>
      <ExpandFooter expanded={expanded} onToggle={onToggle} />
    </div>
  );
}

// ===================== Poisson =====================
function PoissonPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const [expanded, setExpanded] = useState(false);
  const rawMu = inputs.μ;
  const μ = Number.isFinite(rawMu) ? rawMu : 0;
  const rawK = inputs.k;
  const k = Math.max(0, Math.round(Number.isFinite(rawK) ? rawK : 0));

  // Windowed: 7 μ-values centered on input. Expanded: μ from 0.1 to 10.0 in 0.1 steps.
  const μValues = expanded
    ? Array.from({ length: 100 }, (_, i) => +((i + 1) * 0.1).toFixed(2))
    : Array.from(new Set(
        [-3, -2, -1, 0, 1, 2, 3]
          .map((d) => +(Math.max(0.1, μ + d * 0.1)).toFixed(2))
      ));
  // Always 0..15 for k columns; expanded shows a few more.
  const ks = expanded
    ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    : [0, 1, 2, 3, 4, 5, 6, 7];

  const closestμ = μValues.reduce((a, b) =>
    Math.abs(b - μ) < Math.abs(a - μ) ? b : a,
  );

  return (
    <ExpandableShell expanded={expanded} onToggle={() => setExpanded((v) => !v)}>
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Tabellverdier P(X ≤ k) for ulike μ og k</span>
        <span className="font-serif italic text-primary">
          Markert celle: μ ≈ {closestμ.toFixed(1)}, k = {k}
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12.5px] text-ink-2">
        <thead className="sticky top-0 z-[1] bg-paper-2">
          <tr>
            <th className="px-2.5 py-1.5 text-center text-[11px] font-semibold text-ink-3">
              μ ↓ &nbsp; k →
            </th>
            {ks.map((kv) => (
              <th
                key={kv}
                className={clsx(
                  "px-2.5 py-1.5 text-center text-[11px] font-semibold",
                  kv === k ? "bg-primary text-white" : "bg-primary-soft text-primary"
                )}
              >
                {kv}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {μValues.map((μv) => (
            <tr key={μv} className={clsx("border-b border-line", μv === closestμ && "bg-primary-2/[0.04]")}>
              <td
                className={clsx(
                  "bg-paper-2 px-2.5 py-1.5 text-center font-medium text-ink-3",
                  μv === closestμ && "bg-primary-soft font-bold text-primary"
                )}
              >
                {μv.toFixed(1)}
              </td>
              {ks.map((kv) => {
                const val = jStat.poisson.cdf(kv, μv);
                const isCell = μv === closestμ && kv === k;
                const isCol = kv === k;
                return (
                  <td
                    key={kv}
                    className={clsx(
                      "px-2.5 py-1.5 text-center",
                      isCell
                        ? "bg-primary font-bold text-white shadow-[inset_0_0_0_2px_var(--color-warn)]"
                        : isCol
                          ? "bg-primary-2/[0.04]"
                          : ""
                    )}
                  >
                    {val.toFixed(4).slice(1)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ExpandableShell>
  );
}

// ===================== Z-tabell (kumulativ standardnormal) =====================
function ZPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const [expanded, setExpanded] = useState(false);
  const rawZ = inputs.z ?? 0;
  const z = Number.isFinite(rawZ) ? rawZ : 0;
  const sign = z >= 0 ? 1 : -1;
  const absZ = Math.abs(z);
  const absRow = Math.floor(absZ * 10 + 1e-9) / 10;
  const zRow = +(sign * absRow).toFixed(1);
  const zCol = +(absZ - absRow).toFixed(2);

  const Z_MAX = 3.9;
  const zRows = expanded
    ? // Full table: -3.9 to 3.9 step 0.1 (79 rows)
      Array.from({ length: Math.round(Z_MAX * 20) + 1 }, (_, i) =>
        +((i / 10) - Z_MAX).toFixed(1),
      )
    : (() => {
        const rowOffsets = [-3, -2, -1, 0, 1, 2, 3];
        const clampedRow = Math.max(-(Z_MAX - 0.3), Math.min(Z_MAX - 0.3, zRow));
        return rowOffsets
          .map((d) => +(clampedRow + d * 0.1).toFixed(1))
          .filter((v) => v >= -Z_MAX && v <= Z_MAX);
      })();
  const zCols = [0.0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09].map((v) => +v.toFixed(2));

  const closestCol = zCols.reduce((a, b) =>
    Math.abs(b - zCol) < Math.abs(a - zCol) ? b : a
  );
  const closestRow = zRows.reduce((a, b) =>
    Math.abs(b - zRow) < Math.abs(a - zRow) ? b : a,
    zRows[0],
  );

  return (
    <ExpandableShell expanded={expanded} onToggle={() => setExpanded((v) => !v)}>
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Tabellverdier G(z) = P(Z ≤ z), Gauss-funksjonen</span>
        <span className="font-serif italic text-primary">
          Markert celle: z ≈ {(closestRow + closestCol).toFixed(2)}
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12px] text-ink-2">
        <thead className="sticky top-0 z-[1] bg-paper-2">
          <tr>
            <th className="px-1.5 py-1.5 text-center text-[11px] font-semibold text-ink-3">z</th>
            {zCols.map((c) => (
              <th
                key={c}
                className={clsx(
                  "px-1.5 py-1.5 text-center text-[11px] font-semibold",
                  Math.abs(c - closestCol) < 0.005 ? "bg-primary text-white" : "bg-primary-soft text-primary"
                )}
              >
                {c.toFixed(2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zRows.map((r) => (
            <tr key={r} className={clsx("border-b border-line", Math.abs(r - closestRow) < 0.05 && "bg-primary-2/[0.04]")}>
              <td
                className={clsx(
                  "bg-paper-2 px-2 py-1.5 text-center font-medium text-ink-3",
                  Math.abs(r - closestRow) < 0.05 && "bg-primary-soft font-bold text-primary"
                )}
              >
                {r.toFixed(1)}
              </td>
              {zCols.map((c) => {
                const zv = +(r + (r >= 0 ? c : -c)).toFixed(2);
                const val = jStat.normal.cdf(zv, 0, 1);
                const isRow = Math.abs(r - closestRow) < 0.05;
                const isCol = Math.abs(c - closestCol) < 0.005;
                const isCell = isRow && isCol;
                return (
                  <td
                    key={c}
                    className={clsx(
                      "px-1.5 py-1.5 text-center",
                      isCell
                        ? "bg-primary font-bold text-white shadow-[inset_0_0_0_2px_var(--color-warn)]"
                        : isCol
                          ? "bg-primary-2/[0.04]"
                          : ""
                    )}
                  >
                    {val.toFixed(4)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ExpandableShell>
  );
}

// ===================== Z-kvantiltabell (kort statisk) =====================
function ZQuantilePrintedTable() {
  // Already short by design — no expand needed.
  const rows = [
    { α: 0.100, z: 1.282 },
    { α: 0.050, z: 1.645 },
    { α: 0.025, z: 1.960 },
    { α: 0.010, z: 2.326 },
    { α: 0.005, z: 2.576 },
    { α: 0.001, z: 3.090 },
  ];
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Kritiske z-verdier z_α slik at P(Z &gt; z_α) = α</span>
      </div>
      <table className="w-full border-collapse font-mono text-[13px] text-ink-2">
        <thead className="bg-paper-2">
          <tr>
            <th className="px-3 py-2 text-center text-[11px] font-semibold text-primary uppercase">α</th>
            <th className="px-3 py-2 text-center text-[11px] font-semibold text-primary uppercase">z<sub>α</sub></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.α} className="border-b border-line">
              <td className="bg-paper-2 px-3 py-1.5 text-center font-medium text-ink-3">{r.α.toFixed(3)}</td>
              <td className="px-3 py-1.5 text-center">{r.z.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===================== t-fordelingens kvantiltabell =====================
function TPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const [expanded, setExpanded] = useState(false);
  const rawDf = inputs.df;
  const df = Math.max(1, Math.round(Number.isFinite(rawDf) ? rawDf : 1));
  const rawα = inputs.α;
  const α = Number.isFinite(rawα) ? rawα : 0.05;
  const αs = [0.25, 0.1, 0.05, 0.025, 0.01, 0.005];

  // Windowed: df ± 3 around input. Expanded: 1..30 then 40, 60, 120 (textbook spread).
  const dfRows = expanded
    ? [...Array.from({ length: 30 }, (_, i) => i + 1), 40, 60, 80, 120, 200]
    : [-3, -2, -1, 0, 1, 2, 3]
        .map((d) => df + d)
        .filter((v) => v >= 1);

  const closestα = αs.reduce((a, b) =>
    Math.abs(b - α) < Math.abs(a - α) ? b : a
  );

  return (
    <ExpandableShell expanded={expanded} onToggle={() => setExpanded((v) => !v)}>
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Kritiske t-verdier t_(α, df) for ulike frihetsgrader og halefordelinger</span>
        <span className="font-serif italic text-primary">
          Markert: df = {df}, α = {closestα}
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12.5px] text-ink-2">
        <thead className="sticky top-0 z-[1] bg-paper-2">
          <tr>
            <th className="px-2.5 py-1.5 text-center text-[11px] font-semibold text-ink-3">df ↓ &nbsp; α →</th>
            {αs.map((a) => (
              <th
                key={a}
                className={clsx(
                  "px-2.5 py-1.5 text-center text-[11px] font-semibold",
                  Math.abs(a - closestα) < 1e-6 ? "bg-primary text-white" : "bg-primary-soft text-primary"
                )}
              >
                {a}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dfRows.map((dfv) => (
            <tr key={dfv} className={clsx("border-b border-line", dfv === df && "bg-primary-2/[0.04]")}>
              <td
                className={clsx(
                  "bg-paper-2 px-2.5 py-1.5 text-center font-medium text-ink-3",
                  dfv === df && "bg-primary-soft font-bold text-primary"
                )}
              >
                {dfv}
              </td>
              {αs.map((a) => {
                const val = jStat.studentt.inv(1 - a, dfv);
                const isCol = Math.abs(a - closestα) < 1e-6;
                const isCell = dfv === df && isCol;
                return (
                  <td
                    key={a}
                    className={clsx(
                      "px-2.5 py-1.5 text-center",
                      isCell
                        ? "bg-primary font-bold text-white shadow-[inset_0_0_0_2px_var(--color-warn)]"
                        : isCol
                          ? "bg-primary-2/[0.04]"
                          : ""
                    )}
                  >
                    {val.toFixed(3)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ExpandableShell>
  );
}

// ===================== Kjikvadratfordelingens kvantiltabell =====================
function ChiSquaredPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const [expanded, setExpanded] = useState(false);
  const rawDf = inputs.df;
  const df = Math.max(1, Math.round(Number.isFinite(rawDf) ? rawDf : 1));
  const rawα = inputs.α;
  const α = Number.isFinite(rawα) ? rawα : 0.05;
  const αs = [0.995, 0.975, 0.950, 0.100, 0.050, 0.025, 0.010, 0.005];

  // Windowed: df ± 3. Expanded: 1..30, then 40, 50, 60, 80, 100.
  const dfRows = expanded
    ? [...Array.from({ length: 30 }, (_, i) => i + 1), 40, 50, 60, 80, 100]
    : [-3, -2, -1, 0, 1, 2, 3]
        .map((d) => df + d)
        .filter((v) => v >= 1);

  const closestα = αs.reduce((a, b) =>
    Math.abs(b - α) < Math.abs(a - α) ? b : a
  );

  return (
    <ExpandableShell expanded={expanded} onToggle={() => setExpanded((v) => !v)}>
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Kritiske χ²-verdier χ²_(α, df) for ulike frihetsgrader og halefordelinger</span>
        <span className="font-serif italic text-primary">
          Markert: df = {df}, α = {closestα}
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12.5px] text-ink-2">
        <thead className="sticky top-0 z-[1] bg-paper-2">
          <tr>
            <th className="px-2.5 py-1.5 text-center text-[11px] font-semibold text-ink-3">df ↓ &nbsp; α →</th>
            {αs.map((a) => (
              <th
                key={a}
                className={clsx(
                  "px-2.5 py-1.5 text-center text-[11px] font-semibold",
                  Math.abs(a - closestα) < 1e-6 ? "bg-primary text-white" : "bg-primary-soft text-primary"
                )}
              >
                {a}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dfRows.map((dfv) => (
            <tr key={dfv} className={clsx("border-b border-line", dfv === df && "bg-primary-2/[0.04]")}>
              <td
                className={clsx(
                  "bg-paper-2 px-2.5 py-1.5 text-center font-medium text-ink-3",
                  dfv === df && "bg-primary-soft font-bold text-primary"
                )}
              >
                {dfv}
              </td>
              {αs.map((a) => {
                const val = jStat.chisquare.inv(1 - a, dfv);
                const isCol = Math.abs(a - closestα) < 1e-6;
                const isCell = dfv === df && isCol;
                return (
                  <td
                    key={a}
                    className={clsx(
                      "px-2.5 py-1.5 text-center",
                      isCell
                        ? "bg-primary font-bold text-white shadow-[inset_0_0_0_2px_var(--color-warn)]"
                        : isCol
                          ? "bg-primary-2/[0.04]"
                          : ""
                    )}
                  >
                    {val.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ExpandableShell>
  );
}

// ===================== Binomialtabell =====================
function BinomialPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const [expanded, setExpanded] = useState(false);
  const rawN = inputs.n;
  const n = Math.max(2, Math.round(Number.isFinite(rawN) ? rawN : 10));
  const rawP = inputs.p;
  const p = Number.isFinite(rawP) ? rawP : 0.5;
  const rawK = inputs.k;
  const k = Math.max(0, Math.round(Number.isFinite(rawK) ? rawK : 0));
  const ps = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95];
  const maxK = expanded ? Math.min(n + 1, 26) : Math.min(n + 1, 11);
  const ks = Array.from({ length: maxK }, (_, i) => i);

  const closestp = ps.reduce((a, b) =>
    Math.abs(b - p) < Math.abs(a - p) ? b : a
  );

  return (
    <ExpandableShell expanded={expanded} onToggle={() => setExpanded((v) => !v)}>
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Tabellverdier P(X ≤ k) for binomial(n = {n}, p)</span>
        <span className="font-serif italic text-primary">
          Markert: p ≈ {closestp}, k = {k}
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12px] text-ink-2">
        <thead className="sticky top-0 z-[1] bg-paper-2">
          <tr>
            <th className="px-1.5 py-1.5 text-center text-[11px] font-semibold text-ink-3">p ↓ &nbsp; k →</th>
            {ks.map((kv) => (
              <th
                key={kv}
                className={clsx(
                  "px-1.5 py-1.5 text-center text-[11px] font-semibold",
                  kv === k ? "bg-primary text-white" : "bg-primary-soft text-primary"
                )}
              >
                {kv}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ps.map((pv) => (
            <tr
              key={pv}
              className={clsx("border-b border-line", Math.abs(pv - closestp) < 1e-6 && "bg-primary-2/[0.04]")}
            >
              <td
                className={clsx(
                  "bg-paper-2 px-2 py-1.5 text-center font-medium text-ink-3",
                  Math.abs(pv - closestp) < 1e-6 && "bg-primary-soft font-bold text-primary"
                )}
              >
                {pv}
              </td>
              {ks.map((kv) => {
                const val = jStat.binomial.cdf(kv, n, pv);
                const isCol = kv === k;
                const isRow = Math.abs(pv - closestp) < 1e-6;
                const isCell = isCol && isRow;
                return (
                  <td
                    key={kv}
                    className={clsx(
                      "px-1.5 py-1.5 text-center",
                      isCell
                        ? "bg-primary font-bold text-white shadow-[inset_0_0_0_2px_var(--color-warn)]"
                        : isCol
                          ? "bg-primary-2/[0.04]"
                          : ""
                    )}
                  >
                    {val.toFixed(3).slice(1)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ExpandableShell>
  );
}
