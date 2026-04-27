import { ArrowRight, Table2 } from "lucide-react";

export function ToolCards({ tools }: { tools: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {tools.map((t, i) => (
        <div
          key={i}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-paper-2 px-4 py-3 transition-colors hover:border-primary-2"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
            <Table2 size={18} />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-semibold text-ink">{t}</div>
          </div>
          <ArrowRight size={16} className="text-ink-4" />
        </div>
      ))}
    </div>
  );
}
