interface Props {
  reference: string;
  text: string;
}

export function TableLookupCallout({ reference, text }: Props) {
  return (
    <div
      className="my-2 rounded-r-md border-l-2 px-3 py-2 text-[13px]"
      style={{
        background: "var(--color-calc-lookup-bg)",
        borderColor: "var(--color-calc-lookup-border)",
        color: "var(--color-calc-lookup-text)",
      }}
    >
      <div
        className="mb-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-calc-lookup-border)" }}
      >
        <span>Tabell </span>
        <span>{reference}</span>
      </div>
      {text}
    </div>
  );
}
