import type { Entry, Wizard, WizardOption, WizardQuestion } from "./schema";

/**
 * One user answer in the v2 wizard flow: which question, and which
 * option-index within that question they picked.
 */
export interface WizardAnswer {
  questionId: string;
  optionIndex: number;
}

export interface EntryMatch {
  entry: Entry;
  score: number;
  maxScore: number;
  /** score / maxScore, between 0 and 1. 0 if no scoring evidence yet. */
  matchPct: number;
  /**
   * Total per-value overlap across all matched dimensions. Used as a
   * tie-breaker: when two entries score equally, the one whose filters
   * cover MORE of the picked option's tag values wins. E.g., an option
   * tagged `{computes: [a, b, c]}` against an entry that contains all
   * three contributes coverage 3, while an entry with only `[a]` gets 1.
   * Lets specific-match entries beat broad-match entries.
   */
  coverage: number;
  /**
   * Inverse-filter-size weighted match. For each matched (dim, value),
   * contributes 1 / |entry.filters[dim]|. Tie-break #3: rewards entries
   * with NARROWER filter lists (more specialized). An entry with
   * `computes: [parameter_estimate, std_dev]` (size 2) beats one with
   * `computes: [parameter_estimate, std_dev, expected_value, ...]`
   * (size 5) when both match the same value, because the first is more
   * unambiguously about that concept.
   */
  specificity: number;
}

/**
 * Score a single option against an entry. Each tag DIMENSION inside the
 * option contributes one evidence unit (weighted by `weight`, default 1):
 *   - score += weight if the entry has ANY of the option's values for that dim
 *   - maxScore += weight regardless
 * `skip: true` and untagged options contribute zero — they don't penalize.
 */
function scoreOption(
  entry: Entry,
  option: WizardOption,
): { score: number; max: number; coverage: number; specificity: number } {
  if (option.skip || !option.tags) {
    return { score: 0, max: 0, coverage: 0, specificity: 0 };
  }
  const weight = option.weight ?? 1;
  let score = 0;
  let max = 0;
  let coverage = 0;
  let specificity = 0;
  for (const [dim, values] of Object.entries(option.tags)) {
    if (values.length === 0) continue;
    max += weight;
    const entryValues = (entry.filters[dim] ?? []) as string[];
    const overlap = values.filter((v) => entryValues.includes(v)).length;
    if (overlap > 0) {
      score += weight;
      coverage += overlap;
      specificity += overlap / entryValues.length;
    }
  }
  return { score, max, coverage, specificity };
}

/**
 * Look up a (question, option) pair from a wizard, returning the typed
 * option object or null if the answer references something that doesn't
 * exist (stale state after a config change, etc).
 */
function resolveAnswer(
  wizard: Wizard,
  answer: WizardAnswer,
): { question: WizardQuestion; option: WizardOption } | null {
  const question = wizard.questions.find((q) => q.id === answer.questionId);
  if (!question) return null;
  const option = question.options[answer.optionIndex];
  if (!option) return null;
  return { question, option };
}

/** Score every entry against the answers given so far. */
export function scoreEntries(
  entries: Entry[],
  wizard: Wizard,
  answers: WizardAnswer[],
): EntryMatch[] {
  const resolvedOptions = answers
    .map((a) => resolveAnswer(wizard, a))
    .filter((r): r is { question: WizardQuestion; option: WizardOption } => r !== null)
    .map((r) => r.option);

  return entries.map((entry) => {
    let score = 0;
    let max = 0;
    let coverage = 0;
    let specificity = 0;
    for (const option of resolvedOptions) {
      const r = scoreOption(entry, option);
      score += r.score;
      max += r.max;
      coverage += r.coverage;
      specificity += r.specificity;
    }
    return {
      entry,
      score,
      maxScore: max,
      matchPct: max > 0 ? score / max : 0,
      coverage,
      specificity,
    };
  });
}

/**
 * Return the top N matching entries sorted by score (desc). Entries with
 * score 0 are dropped — they have no positive evidence. Ties break by
 * match percentage, then by entry name for stability.
 */
export function topMatches(matches: EntryMatch[], n: number = 5): EntryMatch[] {
  return matches
    .filter((m) => m.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-break 1: per-value coverage — entries that cover MORE of the
      // option's listed tag values win over ones that cover fewer.
      if (b.coverage !== a.coverage) return b.coverage - a.coverage;
      // Tie-break 2: specificity — entries with NARROWER filter lists
      // win (more focused entries score higher per-value). Catches the
      // case where utvalgsvarians-radata (computes size 2) should beat
      // ki-mu-og-varians (computes size 5) on a punktestimat question.
      if (b.specificity !== a.specificity) return b.specificity - a.specificity;
      if (b.matchPct !== a.matchPct) return b.matchPct - a.matchPct;
      return a.entry.name_no.localeCompare(b.entry.name_no);
    })
    .slice(0, n);
}
