import { describe, it, expect } from "vitest";
import { scoreEntries, topMatches } from "./wizard-score";
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
