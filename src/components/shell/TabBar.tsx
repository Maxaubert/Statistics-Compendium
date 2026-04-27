import { Sigma, Lightbulb, Table2 } from "lucide-react";
import { clsx } from "clsx";

export interface Tab {
  key: string;
  label: string;
  count: number;
}

const ICON_BY_KEY: Record<string, typeof Sigma> = {
  formler: Sigma,
  konsepter: Lightbulb,
  tabeller: Table2,
};

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export function TabBar({ tabs, active, onChange }: Props) {
  return (
    <div role="tablist" className="mb-4 flex gap-0.5 border-b-2 border-line">
      {tabs.map((t) => {
        const Icon = ICON_BY_KEY[t.key];
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.key)}
            className={clsx(
              "-mb-0.5 flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13.5px] font-medium",
              isActive
                ? "border-primary-2 text-primary font-semibold"
                : "border-transparent text-ink-3 hover:text-ink"
            )}
          >
            {Icon && <Icon size={16} />}
            {t.label}
            <span
              className={clsx(
                "rounded-lg px-1.5 py-px font-mono text-[11px]",
                isActive ? "bg-primary-soft text-primary" : "bg-paper-2 text-ink-3"
              )}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
