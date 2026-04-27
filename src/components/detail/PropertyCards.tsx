const LABELS: Record<string, string> = {
  expected_value: "Forventningsverdi",
  variance: "Varians",
  std_dev: "Standardavvik",
};

interface Props {
  properties: Partial<Record<keyof typeof LABELS, string>>;
}

export function PropertyCards({ properties }: Props) {
  const entries = Object.entries(properties).filter(([, v]) => Boolean(v));
  if (entries.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-lg border border-line bg-card px-4 py-3.5"
        >
          <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            {LABELS[key]}
          </div>
          <div className="font-math text-lg font-medium text-ink">{value}</div>
        </div>
      ))}
    </div>
  );
}
