import { useParams, useNavigate, Link } from "react-router-dom";
import { Info, Search, Link2, FileText } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { RecognitionCues } from "@/components/detail/RecognitionCues";
import { ExampleCard } from "@/components/detail/ExampleCard";
import { RelatedPills } from "@/components/detail/RelatedPills";
import { Prose } from "@/components/detail/Prose";
import { GlossaryPopupProvider } from "@/components/detail/GlossaryPopup";
import { loadAllContent } from "@/data/loadContent";

export function ConceptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();
  const concept = data.concepts.find((c) => c.id === id);

  if (!concept) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="mx-auto max-w-screen-md p-12 text-center">
          <p className="font-serif text-2xl text-ink-2">
            Fant ingen konsept med id "{id}".
          </p>
          <Link to="/" className="text-primary-2 underline">
            Tilbake til søkeresultater
          </Link>
        </main>
      </div>
    );
  }

  const related = (concept.related ?? []).map((r) => {
    let name = r.id;
    if (r.kind === "entry")
      name = data.entries.find((x) => x.id === r.id)?.name_no ?? r.id;
    if (r.kind === "concept")
      name = data.concepts.find((x) => x.id === r.id)?.name_no ?? r.id;
    if (r.kind === "table")
      name = data.tables.find((x) => x.id === r.id)?.name_no ?? r.id;
    return { ...r, name };
  });

  return (
    <GlossaryPopupProvider glossary={data.glossary}>
    <div data-testid="concept-detail" className="min-h-screen bg-paper">
      <Banner />
      <article className="mx-auto max-w-[920px] bg-card px-14 py-8 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 py-1.5 text-[13px] font-medium text-primary-2"
          >
            ← Tilbake
          </button>
          <div className="font-mono text-[12px] text-ink-3">
            Konsepter / {concept.name_no}
          </div>
        </div>

        <header className="mb-7 border-b-2 border-paper-2 pb-5">
          <h1 className="m-0 font-serif text-[38px] font-semibold leading-tight tracking-tight text-ink">
            {concept.name_no}
          </h1>
          <p className="mt-2 font-serif text-base italic text-ink-3">
            {concept.tagline}
          </p>
        </header>

        <Section title="Hva det betyr" icon={Info}>
          <Prose body={concept.what_it_means} glossary={data.glossary} />
        </Section>

        <Section title="Slik gjenkjenner du det" icon={Search}>
          <RecognitionCues cues={concept.recognition_cues} />
        </Section>

        {concept.examples && (
          <Section title="Eksempler" icon={FileText}>
            {concept.examples.map((ex, i) => (
              <ExampleCard
                key={i}
                source={ex.source}
                excerpt={ex.excerpt}
                solutionSketch={ex.solution_sketch}
              />
            ))}
          </Section>
        )}

        {related.length > 0 && (
          <Section title="Relaterte oppføringer" icon={Link2}>
            <RelatedPills related={related} />
          </Section>
        )}
      </article>
    </div>
    </GlossaryPopupProvider>
  );
}
