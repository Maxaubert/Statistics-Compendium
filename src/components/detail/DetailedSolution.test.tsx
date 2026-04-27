import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DetailedSolution } from "./DetailedSolution";
import type { z } from "zod";
import type { DetailedSolutionSchema } from "@/data/schema";

type DS = z.infer<typeof DetailedSolutionSchema>;

const sample: DS = {
  source: "Eksamen jan26 · 4a",
  question: "Find P(X=0).",
  sections: [
    { label: "Formel", lines: [{ text: "P(X=k) = ..." }] },
    {
      label: "Innsatt",
      lines: [
        { text: "μ = 1.68" },
        { comment: "spørres om P(X=0)" },
        { table_lookup: { ref: "E.2", text: "Slå opp P(X≤2) → 0.7681" } },
        { indent: "= e^(-1.68)" },
      ],
    },
  ],
  result: "P(X=0) ≈ 0.186",
};

describe("DetailedSolution", () => {
  it("renders source, question, sections, lines, and result", () => {
    render(<DetailedSolution solution={sample} />);
    expect(screen.getByText(/Eksamen jan26 · 4a/)).toBeInTheDocument();
    expect(screen.getByText(/Find P\(X=0\)/)).toBeInTheDocument();
    expect(screen.getByText("Formel")).toBeInTheDocument();
    expect(screen.getByText("P(X=k) = ...")).toBeInTheDocument();
    expect(screen.getByText("# spørres om P(X=0)")).toBeInTheDocument();
    expect(screen.getByText("Slå opp P(X≤2) → 0.7681")).toBeInTheDocument();
    expect(screen.getByText("E.2")).toBeInTheDocument();
    expect(screen.getByText("P(X=0) ≈ 0.186")).toBeInTheDocument();
  });
});
