import { jStat } from "jstat";
import { clsx } from "clsx";

interface Props {
  distribution: "poisson" | "binomial";
  inputs: Record<string, number>;
}

// For now, only render a slice of the Poisson cumulative table around the input μ.
// Other distributions follow the same shape and are added later when their
// content is extracted (separate plan).
export function PrintedTable({ distribution, inputs }: Props) {
  if (distribution !== "poisson") {
    return (
      <p className="px-4 py-3 italic text-ink-3">
        Trykt tabell for denne fordelingen kommer i innholdsutvidelsen.
      </p>
    );
  }

  const μ = inputs.μ;
  const k = inputs.k;
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
          Den markerte cellen matcher inputene over (μ ≈ {closestμ}, k = {k}).
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
                  kv === k ? "bg-cyan text-ink" : "bg-primary-soft text-primary"
                )}
              >
                {kv}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {μValues.map((μv) => (
            <tr
              key={μv}
              className={clsx(
                "border-b border-line",
                μv === closestμ && "bg-primary-2/[0.04]"
              )}
            >
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
                        ? "bg-cyan font-bold text-ink shadow-[inset_0_0_0_2px_var(--color-warn)]"
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
