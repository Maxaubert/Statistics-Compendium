import type { Table } from "@/data/schema";

interface Props {
  table: Table;
  onClick: () => void;
}

export function TableCard({ table, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-line bg-card px-5 py-4 transition-all hover:border-primary-2 hover:shadow-md hover:shadow-primary-2/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 font-serif text-lg font-semibold leading-tight text-ink">
            {table.name_no}
          </h3>
          <div className="mt-0.5 font-mono text-[11.5px] tracking-wider text-ink-3">
            {table.formal_name_no}
          </div>
        </div>
        <span className="flex-shrink-0 rounded-md bg-primary-soft px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-primary">
          {table.code}
        </span>
      </div>
      <p className="m-0 font-serif text-[13.5px] leading-snug text-ink-3">
        {table.description}
      </p>
      <div className="flex flex-wrap gap-1.5 border-t border-dashed border-line pt-1.5">
        {table.inputs.map((i) => (
          <span
            key={i.name}
            className="rounded-xl bg-warn-soft px-2 py-0.5 font-mono text-[11px] text-amber-900"
          >
            {i.name}
          </span>
        ))}
        <span className="rounded-xl bg-paper-2 px-2 py-0.5 font-mono text-[11px] text-ink-2">
          → {table.output}
        </span>
      </div>
    </div>
  );
}
