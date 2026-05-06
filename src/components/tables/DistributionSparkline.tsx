import type { Table } from "@/data/schema";

interface Props {
  distribution: Table["distribution"];
}

/**
 * A small (200×60 viewBox) silhouette of the distribution's PDF, rendered
 * inline on a TableCard so the user can recognize the table at a glance.
 *
 * - Continuous distributions (normal, t, chi²) → smooth filled curve
 * - Discrete distributions (binomial, poisson) → bar chart
 *
 * For t-distribution we overlay a dashed normal-curve outline so the
 * heavier tails are immediately visible (Student-t with df=3 vs N(0,1)).
 */
export function DistributionSparkline({ distribution }: Props) {
  return (
    <svg
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      className="block h-full w-full"
      aria-hidden
    >
      {renderCurve(distribution)}
    </svg>
  );
}

const FILL = "#6366f1";
const OUTLINE_GRAY = "#a8a29e";
const TAIL_CYAN = "#22d3ee";

function renderCurve(distribution: Table["distribution"]): React.ReactNode {
  switch (distribution) {
    case "normal_cumulative":
      return (
        <path
          d={buildPath(sampleNormal())}
          fill={FILL}
          opacity={0.85}
        />
      );
    case "normal_quantile": {
      const samples = sampleNormal();
      // Tail beyond z ≈ 1.645 (α = 0.05) — index 44 of 60 samples.
      const tailFrom = 44;
      return (
        <>
          <path d={buildPath(samples)} fill={OUTLINE_GRAY} opacity={0.35} />
          <path
            d={buildTailPath(samples, tailFrom)}
            fill={TAIL_CYAN}
            opacity={0.9}
          />
        </>
      );
    }
    case "t_quantile":
      return (
        <>
          <path d={buildPath(sampleT())} fill={FILL} opacity={0.85} />
          <path
            d={buildPath(sampleNormal())}
            fill="none"
            stroke={OUTLINE_GRAY}
            strokeWidth={1}
            strokeDasharray="3,3"
            opacity={0.55}
          />
        </>
      );
    case "chi_squared_quantile":
      return (
        <path d={buildPath(sampleChi2())} fill={FILL} opacity={0.85} />
      );
    case "poisson":
      return renderBars(barsPoisson());
    case "binomial":
      return renderBars(barsBinomial());
    default:
      return null;
  }
}

// ===== Continuous: PDF-driven path generation =====

type Sample = [svgX: number, density: number];

function buildPath(samples: Sample[]): string {
  if (samples.length === 0) return "";
  const peak = samples.reduce((m, s) => Math.max(m, s[1]), 0);
  if (peak === 0) return "";
  const pts = samples
    .map((s) => `${s[0].toFixed(1)},${(60 - (s[1] / peak) * 50).toFixed(1)}`)
    .join(" L ");
  return `M ${samples[0][0].toFixed(1)},60 L ${pts} L ${samples[samples.length - 1][0].toFixed(1)},60 Z`;
}

function buildTailPath(samples: Sample[], fromIndex: number): string {
  const slice = samples.slice(fromIndex);
  if (slice.length === 0) return "";
  const peak = samples.reduce((m, s) => Math.max(m, s[1]), 0);
  if (peak === 0) return "";
  const pts = slice
    .map((s) => `${s[0].toFixed(1)},${(60 - (s[1] / peak) * 50).toFixed(1)}`)
    .join(" L ");
  return `M ${slice[0][0].toFixed(1)},60 L ${pts} L ${slice[slice.length - 1][0].toFixed(1)},60 Z`;
}

function densityNormal(x: number) {
  return Math.exp(-(x * x) / 2);
}

function densityT(x: number, df = 3) {
  return Math.pow(1 + (x * x) / df, -(df + 1) / 2);
}

function densityChi2(x: number, df = 4) {
  if (x <= 0) return 0;
  return Math.pow(x, df / 2 - 1) * Math.exp(-x / 2);
}

function sampleNormal(): Sample[] {
  const out: Sample[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = -3.5 + (i / 60) * 7;
    const svgX = (i / 60) * 200;
    out.push([svgX, densityNormal(x)]);
  }
  return out;
}

function sampleT(): Sample[] {
  const out: Sample[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = -3.5 + (i / 60) * 7;
    const svgX = (i / 60) * 200;
    out.push([svgX, densityT(x, 3)]);
  }
  return out;
}

function sampleChi2(): Sample[] {
  const out: Sample[] = [];
  const X_MAX = 16;
  for (let i = 0; i <= 80; i++) {
    const x = (i / 80) * X_MAX;
    const svgX = (i / 80) * 200;
    out.push([svgX, densityChi2(x, 4)]);
  }
  return out;
}

// ===== Discrete: precomputed bar charts =====

interface BarData {
  bars: number[]; // height in 0..1, normalized by peak
}

// Binomial(n=8, p=0.5): symmetric, peak at k=4. 9 bars.
function barsBinomial(): BarData {
  const n = 8;
  const p = 0.5;
  const ks = Array.from({ length: n + 1 }, (_, i) => i);
  const C: number[] = [1];
  for (let i = 1; i <= n; i++) {
    C.push((C[i - 1] * (n - i + 1)) / i);
  }
  const probs = ks.map(
    (k) => C[k] * Math.pow(p, k) * Math.pow(1 - p, n - k),
  );
  const peak = Math.max(...probs);
  return { bars: probs.map((p) => p / peak) };
}

// Poisson(λ=2): right-skewed. 8 bars (k=0..7).
function barsPoisson(): BarData {
  const λ = 2;
  const ks = Array.from({ length: 8 }, (_, i) => i);
  function poissonPmf(k: number) {
    let f = 1;
    for (let i = 1; i <= k; i++) f *= i;
    return (Math.pow(λ, k) * Math.exp(-λ)) / f;
  }
  const probs = ks.map(poissonPmf);
  const peak = Math.max(...probs);
  return { bars: probs.map((p) => p / peak) };
}

function renderBars(data: BarData): React.ReactNode {
  const n = data.bars.length;
  const totalWidth = 200;
  const gap = n > 10 ? 2 : 4;
  const barWidth = (totalWidth - gap * (n - 1)) / n;
  return (
    <g>
      {data.bars.map((h, i) => {
        const height = Math.max(1, h * 50);
        const x = i * (barWidth + gap);
        const y = 60 - height;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={height}
            fill={FILL}
            opacity={0.85}
          />
        );
      })}
    </g>
  );
}
