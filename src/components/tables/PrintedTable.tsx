import { jStat } from "jstat";
import { clsx } from "clsx";
import type { Table } from "@/data/schema";

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
    default:
      return (
        <p className="px-4 py-3 italic text-ink-3">
          Trykt tabell ikke implementert for denne fordelingen – bruk det interaktive oppslaget over.
        </p>
      );
  }
}

// ===================== Poisson =====================
function PoissonPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const μ = inputs.μ ?? 0;
  const k = Math.max(0, Math.round(inputs.k ?? 0));
  const μValues = Array.from(new Set(
    [-3, -2, -1, 0, 1, 2, 3]
      .map((d) => +(Math.max(0.1, μ + d * 0.1)).toFixed(2))
  ));
  const ks = [0, 1, 2, 3, 4, 5, 6, 7];

  const closestμ = μValues.reduce((a, b) =>
    Math.abs(b - μ) < Math.abs(a - μ) ? b : a
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Tabellverdier P(X ≤ k) for ulike μ og k</span>
        <span className="font-serif italic text-primary">
          Markert celle: μ ≈ {closestμ.toFixed(1)}, k = {k}
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12.5px] text-ink-2">
        <thead className="bg-paper-2">
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
    </div>
  );
}

// ===================== Z-tabell (kumulativ standardnormal) =====================
function ZPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const z = inputs.z ?? 0;
  // Standard textbook convention: rows are z to one decimal of |z|, with sign;
  // columns are the second decimal of |z| (0.00..0.09).
  const sign = z >= 0 ? 1 : -1;
  const absZ = Math.abs(z);
  const absRow = Math.floor(absZ * 10 + 1e-9) / 10;
  const zRow = +(sign * absRow).toFixed(1);
  const zCol = +(absZ - absRow).toFixed(2);

  // Show 7 rows centered on the user's z (one decimal). Clamp the
  // window center to ±2.7 so all 7 offsets stay inside the [-3, 3]
  // table range — otherwise typing z >= 3.4 would yield an empty
  // window and crash on `reduce` below.
  const rowOffsets = [-3, -2, -1, 0, 1, 2, 3];
  const clampedRow = Math.max(-2.7, Math.min(2.7, zRow));
  const zRows = rowOffsets
    .map((d) => +(clampedRow + d * 0.1).toFixed(1))
    .filter((v) => v >= -3.0 && v <= 3.0);
  const zCols = [0.0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09].map((v) => +v.toFixed(2));

  // Find the closest second-decimal column
  const closestCol = zCols.reduce((a, b) =>
    Math.abs(b - zCol) < Math.abs(a - zCol) ? b : a
  );
  const closestRow = zRows.reduce((a, b) =>
    Math.abs(b - zRow) < Math.abs(a - zRow) ? b : a
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Tabellverdier G(z) = P(Z ≤ z), Gauss-funksjonen</span>
        <span className="font-serif italic text-primary">
          Markert celle: z ≈ {(closestRow + closestCol).toFixed(2)}
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12px] text-ink-2">
        <thead className="bg-paper-2">
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
    </div>
  );
}

// ===================== Z-kvantiltabell (kort statisk) =====================
function ZQuantilePrintedTable() {
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
  const df = Math.max(1, Math.round(inputs.df ?? 1));
  const α = inputs.α ?? 0.05;
  const αs = [0.25, 0.1, 0.05, 0.025, 0.01, 0.005];

  // Show df ± 3 rows around input
  const dfRows = [-3, -2, -1, 0, 1, 2, 3]
    .map((d) => df + d)
    .filter((v) => v >= 1);

  const closestα = αs.reduce((a, b) =>
    Math.abs(b - α) < Math.abs(a - α) ? b : a
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Kritiske t-verdier t_(α, df) for ulike frihetsgrader og halefordelinger</span>
        <span className="font-serif italic text-primary">
          Markert: df = {df}, α = {closestα}
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12.5px] text-ink-2">
        <thead className="bg-paper-2">
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
    </div>
  );
}

// ===================== Kjikvadratfordelingens kvantiltabell =====================
function ChiSquaredPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const df = Math.max(1, Math.round(inputs.df ?? 1));
  const α = inputs.α ?? 0.05;
  const αs = [0.995, 0.975, 0.950, 0.100, 0.050, 0.025, 0.010, 0.005];

  const dfRows = [-3, -2, -1, 0, 1, 2, 3]
    .map((d) => df + d)
    .filter((v) => v >= 1);

  const closestα = αs.reduce((a, b) =>
    Math.abs(b - α) < Math.abs(a - α) ? b : a
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Kritiske χ²-verdier χ²_(α, df) for ulike frihetsgrader og halefordelinger</span>
        <span className="font-serif italic text-primary">
          Markert: df = {df}, α = {closestα}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12.5px] text-ink-2">
          <thead className="bg-paper-2">
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
      </div>
    </div>
  );
}

// ===================== Binomialtabell =====================
function BinomialPrintedTable({ inputs }: { inputs: Record<string, number> }) {
  const n = Math.max(2, Math.round(inputs.n ?? 10));
  const p = inputs.p ?? 0.5;
  const k = Math.max(0, Math.round(inputs.k ?? 0));
  const ps = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95];
  const ks = Array.from({ length: Math.min(n + 1, 11) }, (_, i) => i);

  const closestp = ps.reduce((a, b) =>
    Math.abs(b - p) < Math.abs(a - p) ? b : a
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Tabellverdier P(X ≤ k) for binomial(n = {n}, p)</span>
        <span className="font-serif italic text-primary">
          Markert: p ≈ {closestp}, k = {k}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12px] text-ink-2">
          <thead className="bg-paper-2">
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
      </div>
    </div>
  );
}
