import { ArrowRight, Table2, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";
import type { Table } from "@/data/schema";

interface Props {
  tools: string[];
  tables: Table[];
}

// Match patterns like "E.2", "E1", "Tabell E.5"
const TABLE_CODE_REGEX = /\bE\.?(\d)\b/i;

function findTableForTool(tool: string, tables: Table[]): Table | undefined {
  const m = tool.match(TABLE_CODE_REGEX);
  if (!m) return undefined;
  const code = `E.${m[1]}`;
  return tables.find((t) => t.code === code);
}

function isCalculator(tool: string): boolean {
  return /kalkulator/i.test(tool);
}

export function ToolCards({ tools, tables }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {tools.map((t, i) => {
        const table = findTableForTool(t, tables);
        const isCalc = isCalculator(t);
        const Icon = isCalc ? Calculator : Table2;

        const inner = (
          <>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Icon size={18} />
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold text-ink">{t}</div>
            </div>
            {table && <ArrowRight size={16} className="text-ink-4" />}
          </>
        );

        const baseClasses = "flex items-center gap-3 rounded-lg border border-line bg-paper-2 px-4 py-3";

        if (table) {
          return (
            <Link
              key={i}
              to={`/table/${table.id}`}
              className={clsx(baseClasses, "cursor-pointer transition-colors hover:border-primary-2")}
            >
              {inner}
            </Link>
          );
        }
        return (
          <div key={i} className={baseClasses}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
