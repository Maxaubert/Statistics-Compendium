import { useParams, useNavigate, Link } from "react-router-dom";
import { Search, Table2, Link2 } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { RelatedPills } from "@/components/detail/RelatedPills";
import { TableLookupWidget } from "@/components/tables/TableLookupWidget";
import { PrintedTable } from "@/components/tables/PrintedTable";
import { loadAllContent } from "@/data/loadContent";

export function TableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();
  const table = data.tables.find((t) => t.id === id);

  // Initial inputs only — TableLookupWidget tracks live values internally.
  // Sharing live state will be wired in the content-extraction phase.
  const inputs: Record<string, number> = Object.fromEntries(
    (table?.inputs ?? []).map((i) => [i.name, i.min ?? 0])
  );

  if (!table) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="mx-auto max-w-screen-md p-12 text-center">
          <p className="font-serif text-2xl text-ink-2">
            Fant ingen tabell med id "{id}".
          </p>
          <Link to="/" className="text-primary-2 underline">
            Tilbake til søkeresultater
          </Link>
        </main>
      </div>
    );
  }

  const related = (table.related_entries ?? []).map((rid) => ({
    id: rid,
    kind: "entry" as const,
    name: data.entries.find((e) => e.id === rid)?.name_no ?? rid,
  }));

  return (
    <div data-testid="table-detail" className="min-h-screen bg-paper">
      <Banner />
      <article className="mx-auto max-w-[920px] bg-card px-14 py-8 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[13px] font-medium text-primary-2"
          >
            ← Tilbake til tabeller
          </button>
          <div className="font-mono text-[12px] text-ink-3">
            Tabeller / {table.name_no}
          </div>
        </div>

        <header className="mb-7 flex items-start justify-between gap-5 border-b-2 border-paper-2 pb-5">
          <div>
            <h1 className="m-0 font-serif text-[36px] font-semibold leading-tight text-ink">
              {table.name_no}
            </h1>
            <div className="mt-2 font-mono text-[13px] text-ink-3">
              {table.formal_name_no}
            </div>
            <p className="mt-2 font-serif text-base italic text-ink-3">
              {table.description}
            </p>
          </div>
          <span className="rounded-md bg-primary-soft px-2.5 py-1 font-mono text-[13px] font-semibold tracking-wider text-primary">
            {table.code}
          </span>
        </header>

        <Section title="Interaktivt oppslag" icon={Search}>
          <TableLookupWidget table={table} />
        </Section>

        <Section title="Trykt tabell" icon={Table2}>
          <PrintedTable distribution={table.distribution} inputs={inputs} />
        </Section>

        {related.length > 0 && (
          <Section title="Brukes av disse formlene" icon={Link2}>
            <RelatedPills related={related} />
          </Section>
        )}
      </article>
    </div>
  );
}
