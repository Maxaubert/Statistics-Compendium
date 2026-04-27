import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PagerEntry {
  id: string;
  name: string;
}

interface Props {
  prev?: PagerEntry;
  next?: PagerEntry;
}

export function Pager({ prev, next }: Props) {
  return (
    <div className="mt-12 flex justify-between gap-3 border-t border-line pt-7">
      {prev ? (
        <Link
          to={`/entry/${prev.id}`}
          className="flex-1 rounded-lg border border-line bg-card px-5 py-3.5 transition-colors hover:border-primary-2"
        >
          <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            <ChevronLeft size={11} />
            Forrige
          </div>
          <div className="mt-1 font-serif text-base font-semibold text-ink">
            {prev.name}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          to={`/entry/${next.id}`}
          className="flex-1 rounded-lg border border-line bg-card px-5 py-3.5 transition-colors hover:border-primary-2"
        >
          <div className="flex items-center justify-end gap-1 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            Neste
            <ChevronRight size={11} />
          </div>
          <div className="mt-1 text-right font-serif text-base font-semibold text-ink">
            {next.name}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
