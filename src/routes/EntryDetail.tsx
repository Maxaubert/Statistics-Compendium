import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Info, Search, AlertTriangle, Pi, BarChart3, ClipboardList,
  FileText, AlertCircle, Code2, Table2, Link2,
} from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { HeroFormula } from "@/components/detail/HeroFormula";
import { DistributionThumbnail } from "@/components/detail/DistributionThumbnail";
import { RecognitionCues } from "@/components/detail/RecognitionCues";
import { SymbolGrid } from "@/components/detail/SymbolGrid";
import { PropertyCards } from "@/components/detail/PropertyCards";
import { StepByStep } from "@/components/detail/StepByStep";
import { StepByStepTabs } from "@/components/detail/StepByStepTabs";
import { ExampleCard } from "@/components/detail/ExampleCard";
import { ExampleVariantsTabs } from "@/components/detail/ExampleVariantsTabs";
import { DetailedSolution } from "@/components/detail/DetailedSolution";
import { TrapAlert } from "@/components/detail/TrapAlert";
import { PythonSnippet } from "@/components/detail/PythonSnippet";
import { ToolCards } from "@/components/detail/ToolCards";
import { RelatedPills } from "@/components/detail/RelatedPills";
import { Pager } from "@/components/detail/Pager";
import { loadAllContent } from "@/data/loadContent";

export function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();
  const entry = data.entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="mx-auto max-w-screen-md p-12 text-center">
          <p className="font-serif text-2xl text-ink-2">
            Fant ingen oppføring med id "{id}".
          </p>
          <Link to="/" className="text-primary-2 underline">
            Tilbake til søkeresultater
          </Link>
        </main>
      </div>
    );
  }

  const related = (entry.related ?? []).map((r) => {
    let name = r.id;
    if (r.kind === "entry")
      name = data.entries.find((x) => x.id === r.id)?.name_no ?? r.id;
    if (r.kind === "concept")
      name = data.concepts.find((x) => x.id === r.id)?.name_no ?? r.id;
    if (r.kind === "table")
      name = data.tables.find((x) => x.id === r.id)?.name_no ?? r.id;
    return { ...r, name };
  });

  const sameType = data.entries.filter((e) => e.type === entry.type);
  const idx = sameType.findIndex((e) => e.id === entry.id);
  const prev = idx > 0 ? sameType[idx - 1] : undefined;
  const next = idx >= 0 && idx < sameType.length - 1 ? sameType[idx + 1] : undefined;

  return (
    <div data-testid="entry-detail" className="min-h-screen bg-paper">
      <Banner />
      <article className="mx-auto max-w-[920px] bg-card px-14 py-8 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 py-1.5 text-[13px] font-medium text-primary-2 hover:text-primary"
          >
            ← Tilbake til søkeresultater
          </button>
          <div className="font-mono text-[12px] text-ink-3">
            Formler / {entry.category ?? entry.type} / {entry.name_no}
          </div>
        </div>

        <header className="mb-7 border-b-2 border-paper-2 pb-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h1 className="m-0 font-serif text-[38px] font-semibold leading-tight tracking-tight text-ink">
                {entry.name_no}
              </h1>
              <p className="mt-2 font-serif text-base italic text-ink-3">
                {entry.tagline}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="inline-block rounded-xl bg-indigo-100 px-2.5 py-0.5 text-[11px] font-medium text-indigo-800">
                {entry.type}
              </span>
            </div>
          </div>
        </header>

        <DistributionThumbnail entry={entry} />
        <HeroFormula latex={entry.formula_latex} />

        <Section title="Hva den gjør" icon={Info}>
          <p className="m-0 font-serif text-base leading-relaxed text-ink">
            {entry.what_it_does}
          </p>
        </Section>

        <Section title="Slik gjenkjenner du den i en oppgave" icon={Search}>
          <RecognitionCues cues={entry.recognition_cues} />
        </Section>

        {entry.when_NOT_to_use && entry.when_NOT_to_use.length > 0 && (
          <Section title="IKKE bruk når" icon={AlertTriangle}>
            <RecognitionCues cues={entry.when_NOT_to_use} variant="warn" />
          </Section>
        )}

        {entry.symbols && (
          <Section title="Symboler" icon={Pi}>
            <SymbolGrid symbols={entry.symbols} />
          </Section>
        )}

        {entry.properties && (
          <Section title="Egenskaper" icon={BarChart3}>
            <PropertyCards properties={entry.properties} />
          </Section>
        )}

        {(entry.solution_variants?.length ?? 0) > 0 ? (
          <Section title="Steg for steg" icon={ClipboardList}>
            <StepByStepTabs variants={entry.solution_variants!} />
          </Section>
        ) : entry.solution_template ? (
          <Section title="Steg for steg" icon={ClipboardList}>
            <StepByStep steps={entry.solution_template} />
          </Section>
        ) : null}

        {(entry.example_variants?.length ?? 0) > 0 ? (
          <Section title="Eksempler fra obliger og eksamener" icon={FileText}>
            <ExampleVariantsTabs variants={entry.example_variants!} />
          </Section>
        ) : entry.examples ? (
          <Section title="Eksempler fra obliger og eksamener" icon={FileText}>
            {entry.examples.map((ex, i) => (
              <ExampleCard
                key={i}
                source={ex.source}
                excerpt={ex.excerpt}
                solutionSketch={ex.solution_sketch}
              />
            ))}
          </Section>
        ) : null}

        {entry.detailed_solutions && (
          <Section title="Detaljerte oppgaveløsninger" icon={FileText}>
            {entry.detailed_solutions.map((s, i) => (
              <DetailedSolution key={i} solution={s} />
            ))}
          </Section>
        )}

        {entry.common_traps && (
          <Section title="Vanlige feller" icon={AlertCircle}>
            <TrapAlert body={entry.common_traps} />
          </Section>
        )}

        {entry.python_snippet && (
          <Section title="Python (scipy.stats)" icon={Code2}>
            <PythonSnippet code={entry.python_snippet} />
          </Section>
        )}

        {entry.tools && (
          <Section title="Verktøy / tabeller" icon={Table2}>
            <ToolCards tools={entry.tools} tables={data.tables} />
          </Section>
        )}

        {related.length > 0 && (
          <Section title="Relaterte oppføringer" icon={Link2}>
            <RelatedPills related={related} />
          </Section>
        )}

        <Pager
          prev={prev && { id: prev.id, name: prev.name_no }}
          next={next && { id: next.id, name: next.name_no }}
        />
      </article>
    </div>
  );
}
