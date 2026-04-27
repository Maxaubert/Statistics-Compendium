import { Link } from "react-router-dom";

const KIND_LABEL: Record<"entry" | "concept" | "table", string> = {
  entry: "distr.",
  concept: "konsept",
  table: "verktøy",
};

const KIND_ROUTE: Record<"entry" | "concept" | "table", string> = {
  entry: "entry",
  concept: "concept",
  table: "table",
};

interface RelatedItem {
  id: string;
  kind: "entry" | "concept" | "table";
  name: string;
}

export function RelatedPills({ related }: { related: RelatedItem[] }) {
  if (related.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {related.map((r) => (
        <Link
          key={`${r.kind}:${r.id}`}
          to={`/${KIND_ROUTE[r.kind]}/${r.id}`}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-transparent bg-primary-soft px-3 py-1.5 text-[13px] font-medium text-primary hover:border-primary-2"
        >
          {r.name} <small className="text-ink-3">({KIND_LABEL[r.kind]})</small>
        </Link>
      ))}
    </div>
  );
}
