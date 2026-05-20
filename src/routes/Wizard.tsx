import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw, HelpCircle } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";
import { scoreEntries, topMatches, type WizardAnswer } from "@/data/wizard-score";
import type { WizardQuestion } from "@/data/schema";

export function Wizard() {
  const data = loadAllContent();
  const wizard = data.wizard;

  const [answers, setAnswers] = useState<WizardAnswer[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const matches = useMemo(() => {
    if (!wizard) return [];
    return topMatches(scoreEntries(data.entries, wizard, answers), 5);
  }, [data.entries, wizard, answers]);

  if (!wizard) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="p-12 text-center font-serif text-ink-3">
          Veiviseren er ikke tilgjengelig.
        </main>
      </div>
    );
  }

  const total = wizard.questions.length;
  const question = wizard.questions[index];

  function answer(optionIndex: number) {
    const next: WizardAnswer = { questionId: question.id, optionIndex };
    setAnswers((prev) => {
      const others = prev.filter((a) => a.questionId !== question.id);
      return [...others, next];
    });
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setAnswers([]);
    setIndex(0);
    setDone(false);
  }

  function back() {
    if (done) {
      setDone(false);
      return;
    }
    if (index > 0) setIndex(index - 1);
  }

  const answeredCount = answers.length;
  const answeredHere = answers.find((a) => a.questionId === question?.id);

  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="bg-card px-8 py-8 md:px-12">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Veiviser
        </h1>
        <p className="mb-6 max-w-prose font-serif italic text-ink-3">
          Svar på det du er trygg på, hopp over resten med «Vet ikke». Du blir
          ikke utelukket fra noe — vi viser de 5 beste treffene basert på
          poengsum.
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-2 text-[12px]">
          <button
            type="button"
            onClick={back}
            disabled={index === 0 && !done}
            className="rounded-md border border-line bg-paper-2 px-2 py-1 disabled:opacity-50"
          >
            <ChevronLeft size={12} className="inline" /> Forrige
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 rounded-md border border-line bg-paper-2 px-2 py-1"
          >
            <RotateCcw size={12} /> Start på nytt
          </button>
          {!done && answeredCount >= 3 && (
            <button
              type="button"
              onClick={() => setDone(true)}
              className="rounded-md border border-primary-2 bg-primary-soft px-2 py-1 font-medium text-primary"
            >
              Vis forslag nå ({matches.length})
            </button>
          )}
          <span className="ml-auto text-ink-3">
            {done
              ? `Ferdig · ${answeredCount} svar`
              : `Spørsmål ${index + 1} av ${total} · ${answeredCount} svart`}
          </span>
        </div>

        {done ? (
          <Results matches={matches} answeredCount={answeredCount} onBack={() => setDone(false)} />
        ) : (
          <QuestionCard
            question={question}
            selectedIndex={answeredHere?.optionIndex}
            onPick={answer}
          />
        )}
      </main>
    </div>
  );
}

function QuestionCard({
  question,
  selectedIndex,
  onPick,
}: {
  question: WizardQuestion;
  selectedIndex?: number;
  onPick: (optionIndex: number) => void;
}) {
  return (
    <section>
      <div className="mb-1 font-serif text-[22px] font-medium leading-snug text-ink">
        {question.text}
      </div>
      {question.why && (
        <div className="mb-4 max-w-prose text-[13px] italic text-ink-3">
          {question.why}
        </div>
      )}
      <ul className="m-0 list-none space-y-2 p-0">
        {question.options.map((opt, i) => {
          const isSkip = opt.skip === true;
          const isSelected = selectedIndex === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onPick(i)}
                className={
                  "flex w-full items-center gap-2 rounded-md border px-4 py-3 text-left text-[14px] transition-colors " +
                  (isSelected
                    ? "border-primary-2 bg-primary-soft text-ink"
                    : isSkip
                      ? "border-line bg-paper-2 italic text-ink-3 hover:border-ink-3"
                      : "border-line bg-paper-2 hover:border-primary-2")
                }
              >
                {isSkip ? (
                  <HelpCircle size={16} className="text-ink-3" />
                ) : (
                  <ChevronRight size={16} className="text-primary-2" />
                )}
                {isSkip ? "Vet ikke / hopp over" : opt.label}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Results({
  matches,
  answeredCount,
  onBack,
}: {
  matches: ReturnType<typeof topMatches>;
  answeredCount: number;
  onBack: () => void;
}) {
  if (matches.length === 0) {
    return (
      <section className="rounded-lg border border-line bg-paper-2 px-6 py-5 text-ink-3">
        Ingen entries fikk noe match-poeng fra svarene dine. Prøv å svare på
        flere spørsmål, eller{" "}
        <button onClick={onBack} className="underline">
          gå tilbake
        </button>{" "}
        og endre et svar.
      </section>
    );
  }
  return (
    <section className="rounded-lg border border-primary-2 bg-primary-soft px-6 py-5">
      <div className="mb-3 font-serif text-[18px] font-semibold text-primary">
        Topp {matches.length} forslag (basert på {answeredCount}{" "}
        {answeredCount === 1 ? "svar" : "svar"}):
      </div>
      <ul className="m-0 list-none space-y-2 p-0">
        {matches.map((m) => {
          const absPct = Math.round(m.matchPct * 100);
          return (
            <li key={m.entry.id}>
              <Link
                to={`/entry/${m.entry.id}`}
                className="flex items-center gap-3 rounded-md border border-line bg-card px-4 py-2 no-underline hover:border-primary-2"
              >
                <span className="min-w-[44px] rounded bg-paper-2 px-1.5 py-0.5 text-center font-mono text-[11px] font-semibold text-primary">
                  {absPct}%
                </span>
                <span className="flex-1 font-serif text-[15px] font-semibold text-ink">
                  {m.entry.name_no}
                </span>
                <span className="font-mono text-[11px] text-ink-3">
                  {m.score}/{m.maxScore}
                </span>
                <ChevronRight size={16} className="text-primary-2" />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[12px] italic text-ink-3">
        Prosent = matchet evidens / mulig evidens fra svarene dine. «8/17»
        betyr at entryen matchet 8 av 17 tag-spor.
      </p>
    </section>
  );
}
