import type { ReactNode } from "react";
import type { Entry } from "@/data/schema";

const SHAPES: Record<string, ReactNode> = {
  poisson: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      {[3, 8, 16, 24, 18, 10, 5, 2].map((h, i) => (
        <rect key={i} x={i * 12 + 4} y={50 - h * 1.6} width={9} height={h * 1.6} fill="currentColor" />
      ))}
    </svg>
  ),
  binomial: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      {[2, 6, 14, 22, 22, 14, 6, 2].map((h, i) => (
        <rect key={i} x={i * 12 + 4} y={50 - h * 1.6} width={9} height={h * 1.6} fill="currentColor" />
      ))}
    </svg>
  ),
  hypergeometric: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      {[1, 4, 12, 22, 22, 12, 4, 1].map((h, i) => (
        <rect key={i} x={i * 12 + 4} y={50 - h * 1.6} width={9} height={h * 1.6} fill="currentColor" />
      ))}
    </svg>
  ),
  normal: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      <path d="M 5 55 Q 50 -20 95 55" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  exponential: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      <path d="M 5 5 Q 30 50 95 55" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  t_distribution: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      <path d="M 5 50 Q 50 -10 95 50" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  chi_squared: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      <path d="M 5 55 Q 25 5 50 30 Q 75 50 95 55" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
};

export function DistributionThumbnail({ entry }: { entry: Entry }) {
  const dist = entry.filters.distribution_assumption?.[0];
  if (!dist || !SHAPES[dist]) return null;
  return (
    <div className="flex items-center gap-2 text-primary-2" title={`Form: ${dist}`}>
      {SHAPES[dist]}
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
        {dist}
      </span>
    </div>
  );
}
