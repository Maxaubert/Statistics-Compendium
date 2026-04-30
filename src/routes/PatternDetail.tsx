import { useParams, Link, useNavigate } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { StepByStep } from "@/components/detail/StepByStep";
import { Search, ClipboardList, Link2 } from "lucide-react";
import { loadAllContent } from "@/data/loadContent";

export function PatternDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();
  const p = data.patterns.find((x) => x.id === id);
  if (!p) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="mx-auto max-w-[820px] p-12 text-center">
          <p className="font-serif text-2xl text-ink-2">
            Fant ingen mønster med id "{id}".
          </p>
          <Link to="/monstre" className="text-primary-2 underline">
            Tilbake til mønstre
          </Link>
        </main>
      </div>
    );
  }
  const refs = p.entry_refs.map((rid) => ({
    id: rid,
    name: data.entries.find((e) => e.id === rid)?.name_no ?? rid,
  }));
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <article className="mx-auto max-w-[820px] bg-card px-12 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-[13px] font-medium text-primary-2"
        >
          ← Tilbake til mønstre
        </button>
        <header className="mb-6 border-b-2 border-paper-2 pb-4">
          <h1 className="m-0 font-serif text-[32px] font-semibold text-ink">
            {p.name_no}
          </h1>
        </header>
        <Section title="Når kjenner du dette mønsteret?" icon={Search}>
          <p className="m-0 font-serif text-base leading-relaxed text-ink">
            {p.cue}
          </p>
        </Section>
        <Section title="Prosedyre" icon={ClipboardList}>
          <StepByStep steps={p.procedure} />
        </Section>
        {p.example && (
          <Section title="Eksempel">
            <p className="m-0 font-serif italic text-ink-2">{p.example}</p>
          </Section>
        )}
        <Section title="Tilhørende formler" icon={Link2}>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {refs.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/entry/${r.id}`}
                  className="rounded-full border border-line bg-paper-2 px-3 py-1 text-[13px] no-underline hover:border-primary-2"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </div>
  );
}
