import { Link } from "react-router-dom";

type Kind = "entry" | "concept" | "table" | "glossary" | "pattern";

const KIND_LABEL: Record<Kind, string> = {
  entry: "distr.",
  concept: "konsept",
  table: "verktøy",
  glossary: "ordliste",
  pattern: "mønster",
};

function pathFor(kind: Kind, id: string): string {
  switch (kind) {
    case "entry":
      return `/entry/${id}`;
    case "concept":
      return `/concept/${id}`;
    case "table":
      return `/table/${id}`;
    case "glossary":
      return `/ordliste#${id}`;
    case "pattern":
      return `/monstre/${id}`;
  }
}

interface RelatedItem {
  id: string;
  kind: Kind;
  name: string;
}

export function RelatedPills({ related }: { related: RelatedItem[] }) {
  if (related.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {related.map((r) => (
        <Link
          key={`${r.kind}:${r.id}`}
          to={pathFor(r.kind, r.id)}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-transparent bg-primary-soft px-3 py-1.5 text-[13px] font-medium text-primary hover:border-primary-2"
        >
          {r.name} <small className="text-ink-3">({KIND_LABEL[r.kind]})</small>
        </Link>
      ))}
    </div>
  );
}
