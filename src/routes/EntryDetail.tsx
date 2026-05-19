import { useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import {
  Info, Search, AlertTriangle, Pi, BarChart3, ClipboardList,
  FileText, AlertCircle, Code2, Table2, Link2,
} from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { renderInlineCode } from "@/components/detail/inline-code";
import { HeroFormula } from "@/components/detail/HeroFormula";
import { DistributionThumbnail } from "@/components/detail/DistributionThumbnail";
import { RecognitionCues } from "@/components/detail/RecognitionCues";
import { SymbolGrid } from "@/components/detail/SymbolGrid";
import { PropertyCards } from "@/components/detail/PropertyCards";
import { PROPERTY_EXPLANATIONS } from "@/components/detail/property-explanations";
import { FormulaExplanationCards } from "@/components/detail/FormulaExplanationCards";
import { FORMULA_EXPLANATIONS } from "@/components/detail/formula-explanations";
import { StepByStep } from "@/components/detail/StepByStep";
import { StepByStepTabs, RecognitionBanner } from "@/components/detail/StepByStepTabs";
import { DetailedSolution } from "@/components/detail/DetailedSolution";
import { DetailedSolutionVariantsTabs } from "@/components/detail/DetailedSolutionVariantsTabs";
import { TrapAlert } from "@/components/detail/TrapAlert";
import { PythonSnippet } from "@/components/detail/PythonSnippet";
import { ToolCards } from "@/components/detail/ToolCards";
import { RelatedPills } from "@/components/detail/RelatedPills";
import { Pager } from "@/components/detail/Pager";
import { Prose } from "@/components/detail/Prose";
import { OversiktCardGrid, OversiktSectionedGrid } from "@/components/detail/OversiktCardGrid";
import { GlossaryPopupProvider } from "@/components/detail/GlossaryPopup";
import { QuickNav, type QuickNavItem } from "@/components/detail/QuickNav";
import { loadAllContent } from "@/data/loadContent";
import { recallVariant, rememberVariant } from "@/data/variant-memory";

/**
 * The 6 regression entries (estimat-alpha-beta, residualvarians,
 * standardfeil-stigningstall, test-stigningstall, prediksjonsintervall,
 * korrelasjonskoeffisient) were folded into the single `lineaer-regresjon`
 * entry which uses tabbed variants for each sub-procedure. Old URLs and any
 * stale `kind: entry` cross-refs that still point at the old ids redirect
 * here.
 */
const ENTRY_ID_REMAP: Record<string, string> = {
  "regresjon-estimat-alpha-beta": "lineaer-regresjon",
  "regresjon-residualvarians": "lineaer-regresjon",
  "regresjon-standardfeil-stigningstall": "lineaer-regresjon",
  "regresjon-test-stigningstall": "lineaer-regresjon",
  "regresjon-prediksjonsintervall": "lineaer-regresjon",
  "regresjon-korrelasjonskoeffisient": "lineaer-regresjon",
  // E[X] og Var(X) for diskret stokastisk variabel — slått sammen til
  // én entry med to faner.
  "forventningsverdi-diskret": "diskret-stokastisk-variabel",
  "varians-standardavvik-diskret": "diskret-stokastisk-variabel",
  // KI for μ (kjent σ), μ (ukjent σ), og σ² — slått sammen til én entry med 3 faner.
  "ki-mu-kjent-sigma": "ki-mu-og-varians",
  "ki-mu-ukjent-sigma": "ki-mu-og-varians",
  "ki-varians": "ki-mu-og-varians",
};

export function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();

  if (id && ENTRY_ID_REMAP[id]) {
    return <Navigate to={`/entry/${ENTRY_ID_REMAP[id]}`} replace />;
  }

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

  // Filter out any stale `kind: concept` refs — the concept content type
  // has been retired (concepts are now glossary terms or `type: overview`
  // entries). Surviving content shouldn't reference them, but we drop any
  // leftovers defensively rather than crash the page.
  const related = (entry.related ?? [])
    .filter((r) => r.kind !== "concept")
    .map((r) => {
      let name = r.id;
      if (r.kind === "entry")
        name = data.entries.find((x) => x.id === r.id)?.name_no ?? r.id;
      if (r.kind === "table")
        name = data.tables.find((x) => x.id === r.id)?.name_no ?? r.id;
      return { ...r, kind: r.kind as "entry" | "table" | "glossary" | "pattern", name };
    });

  const sameType = data.entries.filter((e) => e.type === entry.type);
  const idx = sameType.findIndex((e) => e.id === entry.id);
  const prev = idx > 0 ? sameType[idx - 1] : undefined;
  const next = idx >= 0 && idx < sameType.length - 1 ? sameType[idx + 1] : undefined;

  // Overview / method entries are prose-first: they have a `what_it_means`
  // markdown body instead of a hero formula + `what_it_does` row. The rest
  // of the page (recognition cues, related-pills, common_traps, …) still
  // applies, so we just swap the lead-in section.
  const isProseEntry = entry.type === "overview" || entry.type === "method";

  // Pair the "Steg for steg" and "Detaljerte oppgaveløsninger" tab strips:
  // clicking a variant in either side jumps the other to the same labelled
  // variant (if present). Labels are usually identical across the two
  // sections; when they aren't (e.g. detailed solutions only cover a subset
  // of the step variants) the unmatched click is a no-op for the other side.
  //
  // The active indices are also persisted to localStorage so coming back
  // to a recently-viewed entry restores the variant the user was looking
  // at instead of snapping back to index 0 (see data/variant-memory.ts).
  const stepLabels = useMemo(
    () => entry.solution_variants?.map((v) => v.label) ?? [],
    [entry.solution_variants],
  );
  const solutionLabels = useMemo(
    () => entry.detailed_solution_variants?.map((v) => v.label) ?? [],
    [entry.detailed_solution_variants],
  );
  const initialMemory = useMemo(
    () => recallVariant(entry.id) ?? { step: 0, solution: 0 },
    [entry.id],
  );
  const [activeStep, setActiveStep] = useState(initialMemory.step);
  const [activeSolution, setActiveSolution] = useState(initialMemory.solution);

  // Router reuses this component when only the :id param changes, so we
  // can't rely on remount to reset state. Re-sync during render when the
  // entry id changes — React handles this pattern safely (the immediate
  // state updates trigger an extra render with the new values).
  const lastIdRef = useRef(entry.id);
  if (lastIdRef.current !== entry.id) {
    lastIdRef.current = entry.id;
    setActiveStep(initialMemory.step);
    setActiveSolution(initialMemory.solution);
  }

  const onStepSelect = (i: number) => {
    const match = solutionLabels.indexOf(stepLabels[i]);
    const nextSolution = match >= 0 ? match : activeSolution;
    setActiveStep(i);
    setActiveSolution(nextSolution);
    rememberVariant(entry.id, { step: i, solution: nextSolution });
  };
  const onSolutionSelect = (i: number) => {
    const match = stepLabels.indexOf(solutionLabels[i]);
    const nextStep = match >= 0 ? match : activeStep;
    setActiveSolution(i);
    setActiveStep(nextStep);
    rememberVariant(entry.id, { step: nextStep, solution: i });
  };

  // Right-rail QuickNav items — only include anchors that actually
  // exist on this entry, so the rail doesn't show dead links.
  const hasSteps =
    (entry.solution_variants?.length ?? 0) > 0 || !!entry.solution_template;
  const hasSolutions =
    (entry.detailed_solution_variants?.length ?? 0) > 0 ||
    !!entry.detailed_solutions;
  const quickNavItems: QuickNavItem[] = [
    { id: "nav-formel", label: "Formel" },
    ...(hasSteps ? [{ id: "nav-steg", label: "Steg for steg" }] : []),
    ...(hasSolutions
      ? [{ id: "nav-losninger", label: "Løsninger" }]
      : []),
    ...(entry.tools ? [{ id: "nav-tabeller", label: "Tabeller" }] : []),
  ];

  return (
    <GlossaryPopupProvider glossary={data.glossary}>
    <div data-testid="entry-detail" className="min-h-screen bg-paper">
      <Banner />
      {!isProseEntry && <QuickNav items={quickNavItems} />}
      <article className={`mx-auto bg-card px-14 py-8 pb-12 ${isProseEntry ? "max-w-[1200px]" : "max-w-[920px]"}`}>
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

        <header id="nav-formel" className="mb-7 scroll-mt-6 border-b-2 border-paper-2 pb-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h1 className="m-0 font-serif text-[38px] font-semibold leading-tight tracking-tight text-ink">
                {entry.name_no}
              </h1>
              <p className="mt-2 font-serif text-base italic text-ink-3">
                {renderInlineCode(entry.tagline, "light")}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="inline-block rounded-xl bg-indigo-100 px-2.5 py-0.5 text-[11px] font-medium text-indigo-800">
                {entry.type}
              </span>
            </div>
          </div>
        </header>

        {isProseEntry ? (
          <>
            {entry.what_it_means && (
              <Section title="Hva det betyr" icon={Info}>
                <Prose body={entry.what_it_means} glossary={data.glossary} />
              </Section>
            )}
            {entry.form_sections && entry.form_sections.length > 0 && (
              <Section title="Former" icon={BarChart3}>
                <OversiktSectionedGrid sections={entry.form_sections} />
              </Section>
            )}
            {entry.forms && entry.forms.length > 0 && (
              <Section title="Former" icon={BarChart3}>
                <OversiktCardGrid forms={entry.forms} />
              </Section>
            )}
          </>
        ) : (
          <>
            <DistributionThumbnail entry={entry} />
            {entry.formula_latex && (
              <HeroFormula latex={entry.formula_latex} />
            )}
            {FORMULA_EXPLANATIONS[entry.id] && (
              <Section title="Formelforklaring" icon={Pi}>
                <FormulaExplanationCards
                  explanations={FORMULA_EXPLANATIONS[entry.id]!}
                  glossary={data.glossary}
                  entries={data.entries}
                  tables={data.tables}
                />
              </Section>
            )}
            {entry.what_it_does && (
              <Section title="Hva den gjør" icon={Info}>
                <Prose body={entry.what_it_does} glossary={data.glossary} />
              </Section>
            )}
          </>
        )}

        {entry.type !== "overview" && entry.recognition_cues && entry.recognition_cues.length > 0 && (
          <Section title="Slik gjenkjenner du den i en oppgave" icon={Search}>
            <RecognitionCues cues={entry.recognition_cues} />
          </Section>
        )}

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
            <PropertyCards
              properties={entry.properties}
              explanations={PROPERTY_EXPLANATIONS[entry.id]}
            />
          </Section>
        )}

        {(entry.solution_variants?.length ?? 0) > 0 ? (
          <Section id="nav-steg" title="Steg for steg" icon={ClipboardList}>
            <StepByStepTabs
              variants={entry.solution_variants!}
              active={activeStep}
              onSelect={onStepSelect}
            />
          </Section>
        ) : entry.solution_template ? (
          <Section id="nav-steg" title="Steg for steg" icon={ClipboardList}>
            {entry.recognition && (
              <div className="mb-4">
                <RecognitionBanner text={entry.recognition} />
              </div>
            )}
            <StepByStep steps={entry.solution_template} />
          </Section>
        ) : null}

        {(entry.detailed_solution_variants?.length ?? 0) > 0 ? (
          <Section
            id="nav-losninger"
            title="Detaljerte oppgaveløsninger"
            icon={FileText}
          >
            <DetailedSolutionVariantsTabs
              variants={entry.detailed_solution_variants!}
              active={activeSolution}
              onSelect={onSolutionSelect}
            />
          </Section>
        ) : entry.detailed_solutions ? (
          <Section
            id="nav-losninger"
            title="Detaljerte oppgaveløsninger"
            icon={FileText}
          >
            {entry.detailed_solutions.map((s, i) => (
              <DetailedSolution key={i} solution={s} />
            ))}
          </Section>
        ) : null}

        {entry.common_traps && (
          <Section title="Vanlige feller" icon={AlertCircle}>
            <TrapAlert body={entry.common_traps} glossary={data.glossary} />
          </Section>
        )}

        {entry.python_snippet && (
          <Section title="Python (scipy.stats)" icon={Code2}>
            <PythonSnippet code={entry.python_snippet} />
          </Section>
        )}

        {entry.tools && (
          <Section id="nav-tabeller" title="Verktøy / tabeller" icon={Table2}>
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
    </GlossaryPopupProvider>
  );
}
