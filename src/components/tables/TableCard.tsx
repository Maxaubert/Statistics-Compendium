import type { Table } from "@/data/schema";
import { DistributionSparkline } from "./DistributionSparkline";

interface Props {
  table: Table;
  onClick: () => void;
}

export function TableCard({ table, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group flex cursor-pointer flex-col rounded-xl border border-line bg-card transition-all hover:-translate-y-0.5 hover:border-primary-3 hover:shadow-lg hover:shadow-primary-2/10"
    >
      <div className="flex items-baseline justify-between gap-3 px-5 pt-4">
        <h3 className="m-0 font-serif text-[19px] font-semibold leading-tight text-ink">
          {table.name_no}
        </h3>
        <span className="flex-shrink-0 rounded-md bg-primary-soft px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider text-primary">
          {table.code}
        </span>
      </div>
      <div className="px-5 pb-3 pt-0.5 font-mono text-[11.5px] tracking-wider text-ink-3">
        {table.formal_name_no}
      </div>
      <div className="flex h-[120px] items-end justify-center border-y border-line bg-gradient-to-b from-paper-2 to-card px-4 pb-3 pt-3">
        <DistributionSparkline distribution={table.distribution} />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <p className="m-0 font-serif text-[13.5px] leading-snug text-ink-2">
          {table.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 font-mono text-[11.5px]">
          {table.inputs.map((i) => (
            <span
              key={i.name}
              className="rounded-full bg-warn-soft px-2 py-0.5 font-semibold text-amber-900"
            >
              {i.name}
            </span>
          ))}
          <span className="text-ink-4">→</span>
          <span className="font-medium text-primary-2">{table.output}</span>
        </div>
      </div>
    </div>
  );
}
