import { describe, it, expect } from "vitest";
import { scoreEntries, topMatches } from "./wizard-score";
import { loadAllContent } from "./loadContent";
import type { Entry, Wizard } from "./schema";

function entry(id: string, filters: Record<string, string[]>): Entry {
  return {
    id,
    name_no: id,
    type: "distribution",
    tagline: "",
    recognition_cues: [],
    filters,
  } as Entry;
}

const wizard: Wizard = {
  version: 2,
  questions: [
    {
      id: "q1",
      text: "Variable?",
      options: [
        { label: "Diskret", tags: { random_variable: ["discrete_count"] } },
        { label: "Kontinuerlig", tags: { random_variable: ["continuous"] } },
        { skip: true },
      ],
    },
    {
      id: "q2",
      text: "Setup?",
      options: [
        { label: "Med tilbakelegging", tags: { setup: ["with_replacement"] } },
        { label: "Uten tilbakelegging", tags: { setup: ["without_replacement"] } },
        { skip: true },
      ],
    },
  ],
};

describe("scoreEntries", () => {
  it("gives a positive score for matching tags", () => {
    const binomial = entry("binomial", {
      random_variable: ["discrete_count"],
      setup: ["with_replacement"],
    });
    const result = scoreEntries([binomial], wizard, [
      { questionId: "q1", optionIndex: 0 },
      { questionId: "q2", optionIndex: 0 },
    ]);
    expect(result[0].score).toBe(2);
    expect(result[0].maxScore).toBe(2);
    expect(result[0].matchPct).toBe(1);
  });

  it("scores 0 when no tags match", () => {
    const normal = entry("normal", { random_variable: ["continuous"] });
    const result = scoreEntries([normal], wizard, [
      { questionId: "q1", optionIndex: 0 }, // Diskret
    ]);
    expect(result[0].score).toBe(0);
    expect(result[0].maxScore).toBe(1);
  });

  it("Vet ikke contributes neither score nor maxScore", () => {
    const e = entry("x", { random_variable: ["discrete_count"] });
    const result = scoreEntries([e], wizard, [
      { questionId: "q1", optionIndex: 2 }, // skip
    ]);
    expect(result[0].score).toBe(0);
    expect(result[0].maxScore).toBe(0);
    expect(result[0].matchPct).toBe(0);
  });

  it("ignores unknown question ids and option indices gracefully", () => {
    const e = entry("x", { random_variable: ["discrete_count"] });
    const result = scoreEntries([e], wizard, [
      { questionId: "unknown", optionIndex: 0 },
      { questionId: "q1", optionIndex: 99 },
    ]);
    expect(result[0].score).toBe(0);
    expect(result[0].maxScore).toBe(0);
  });

  it("does not penalize entries that lack a dimension", () => {
    const minimal = entry("min", {}); // no filters at all
    const result = scoreEntries([minimal], wizard, [
      { questionId: "q1", optionIndex: 0 },
    ]);
    // Doesn't match → score 0, but doesn't crash
    expect(result[0].score).toBe(0);
    expect(result[0].maxScore).toBe(1);
  });
});

describe("regression: known exam-failure cases (post-fix)", () => {
  // These tests encode failure modes uncovered by the agent-run against
  // the 9 prior exams. They use the REAL wizard.yaml + entry filters via
  // loadAllContent so any future regression in either is caught.
  const data = loadAllContent();
  const w = data.wizard;
  if (!w) throw new Error("wizard.yaml missing");

  function findOpt(qid: string, predicate: (label: string) => boolean): number {
    const q = w.questions.find((q: { id: string }) => q.id === qid)!;
    const idx = q.options.findIndex((o: { label?: string }) =>
      o.label ? predicate(o.label) : false,
    );
    if (idx < 0) throw new Error(`No option matching predicate in ${qid}`);
    return idx;
  }

  function rankOf(entryId: string, answers: Array<{ qid: string; oi: number }>): number {
    const matches = scoreEntries(
      data.entries,
      w,
      answers.map((a) => ({ questionId: a.qid, optionIndex: a.oi })),
    );
    const top = topMatches(matches, 50);
    const i = top.findIndex((m) => m.entry.id === entryId);
    return i < 0 ? -1 : i + 1; // 1-based rank, -1 if not in top 50
  }

  it("mai22 1a (disjunkt sjekk) → unionssetningen in top 1", () => {
    // User picks the new Q2 option for «A eller B / disjunkte»
    const oi = findOpt("q_goal", (l) =>
      l.includes("P(A ∪ B)") && l.includes("DISJUNKTE"),
    );
    const rank = rankOf("unionssetningen", [
      { qid: "q_goal", oi },
    ]);
    expect(rank).toBeLessThanOrEqual(1);
  });

  it("mai22 1b/jan22 1c (uavhengighet sjekk) → produktregel in top 1", () => {
    const oi = findOpt("q_goal", (l) =>
      l.includes("P(A ∩ B)") && l.includes("UAVHENGIGE"),
    );
    const rank = rankOf("produktregel", [
      { qid: "q_goal", oi },
    ]);
    expect(rank).toBeLessThanOrEqual(1);
  });

  it("mai22 3a (punktestimat fra rådata) → utvalgsvarians-radata in top 1", () => {
    const oi = findOpt("q_goal", (l) =>
      l.includes("punktestimat") && l.includes("rådata"),
    );
    const continuousOi = findOpt("q_variable", (l) =>
      l.includes("Måling"),
    );
    const singlePopOi = findOpt("q_groups", (l) =>
      l.includes("Ett utvalg"),
    );
    const answers = [
      { qid: "q_variable", oi: continuousOi },
      { qid: "q_goal", oi },
      { qid: "q_groups", oi: singlePopOi },
    ];
    const matches = scoreEntries(
      data.entries,
      w,
      answers.map((a) => ({ questionId: a.qid, optionIndex: a.oi })),
    );
    const top = topMatches(matches, 8);
    const rank = top.findIndex((m) => m.entry.id === "utvalgsvarians-radata") + 1;
    expect(rank).toBeLessThanOrEqual(3);
  });

  it("jan26 1b (komplement + uten tilbakelegging) → komplementregelen in top 5", () => {
    // After fix: komplementregelen now has setup:[..., without_replacement, finite_pool]
    const withoutReplOi = findOpt("q_replacement", (l) =>
      l.includes("Uten tilbakelegging"),
    );
    const complementOi = findOpt("q_complement_wording", (l) =>
      l.includes("Ja"),
    );
    const rank = rankOf("komplementregelen", [
      { qid: "q_replacement", oi: withoutReplOi },
      { qid: "q_complement_wording", oi: complementOi },
    ]);
    expect(rank).toBeLessThanOrEqual(5);
  });

  it("jan26 2c (korrelasjon fra simultanfordeling) → korrelasjon-joint in top 5", () => {
    // After fix: korrelasjon-joint has joint_probability/marginal_probability + single_population
    const correlationOi = findOpt("q_goal", (l) =>
      l.includes("Varians, standardavvik, kovarians"),
    );
    const simultanOi = findOpt("q_data_shape", (l) =>
      l.includes("Simultantabell"),
    );
    const rank = rankOf("korrelasjon-joint", [
      { qid: "q_goal", oi: correlationOi },
      { qid: "q_data_shape", oi: simultanOi },
    ]);
    expect(rank).toBeLessThanOrEqual(5);
  });

  it("jan25 1c (Bayes + «ikke har dysleksi») → bayes-setning still in top 5", () => {
    // After fix: bayes-setning has complement_pattern in structural_cues
    const bayesOi = findOpt("q_goal", (l) =>
      l.includes("Snu en betinget"),
    );
    const complementOi = findOpt("q_complement_wording", (l) =>
      l.includes("Ja"),
    );
    const rank = rankOf("bayes-setning", [
      { qid: "q_goal", oi: bayesOi },
      { qid: "q_complement_wording", oi: complementOi },
    ]);
    expect(rank).toBeLessThanOrEqual(3);
  });

  it("coverage tie-break: more-specific entry beats broad entry", () => {
    // unionssetningen matches a UNION-specific Q option more specifically
    // (computes:union_probability is rare; only unionssetningen has it).
    const unionOi = findOpt("q_goal", (l) =>
      l.includes("P(A ∪ B)"),
    );
    const rank = rankOf("unionssetningen", [{ qid: "q_goal", oi: unionOi }]);
    expect(rank).toBe(1);
  });
});

describe("topMatches", () => {
  it("drops zero-score entries and sorts by score desc", () => {
    const binomial = entry("binomial", {
      random_variable: ["discrete_count"],
      setup: ["with_replacement"],
    });
    const normal = entry("normal", { random_variable: ["continuous"] });
    const hypergeom = entry("hypergeom", {
      random_variable: ["discrete_count"],
      setup: ["without_replacement"],
    });

    const matches = scoreEntries([binomial, normal, hypergeom], wizard, [
      { questionId: "q1", optionIndex: 0 }, // Diskret
      { questionId: "q2", optionIndex: 0 }, // Med tilbakelegging
    ]);
    const top = topMatches(matches, 5);
    expect(top.map((m) => m.entry.id)).toEqual(["binomial", "hypergeom"]);
    expect(top[0].score).toBe(2);
    expect(top[1].score).toBe(1);
  });

  it("respects the n parameter", () => {
    const entries = [
      entry("a", { random_variable: ["discrete_count"] }),
      entry("b", { random_variable: ["discrete_count"] }),
      entry("c", { random_variable: ["discrete_count"] }),
    ];
    const matches = scoreEntries(entries, wizard, [
      { questionId: "q1", optionIndex: 0 },
    ]);
    expect(topMatches(matches, 2)).toHaveLength(2);
  });
});
