import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}

export function SearchBox({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative mb-4">
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line-2 bg-card py-3 pl-11 pr-3 text-sm text-ink placeholder:text-ink-4 focus:border-primary-2 focus:outline-none focus:ring-2 focus:ring-primary-2/10"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-paper-2 px-1.5 py-px font-mono text-[11px] text-ink-3 sm:inline">
        Ctrl+K
      </span>
    </div>
  );
}
