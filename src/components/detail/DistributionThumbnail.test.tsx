import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { Entry } from "@/data/schema";
import { DistributionThumbnail } from "./DistributionThumbnail";

function makeEntry(distribution?: string): Entry {
  return {
    id: "test-entry",
    name_no: "Test",
    type: "distribution",
    tagline: "tag",
    formula_main: "x",
    formula_latex: "x",
    what_it_does: "does",
    recognition_cues: ["cue"],
    filters: distribution ? { distribution_assumption: [distribution] } : {},
  } as Entry;
}

describe("DistributionThumbnail", () => {
  it("renders an SVG when entry has a known distribution_assumption", () => {
    const { container } = render(<DistributionThumbnail entry={makeEntry("poisson")} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.textContent).toContain("poisson");
  });

  it("renders nothing when distribution_assumption is missing", () => {
    const { container } = render(<DistributionThumbnail entry={makeEntry(undefined)} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing for an unknown distribution", () => {
    const { container } = render(<DistributionThumbnail entry={makeEntry("unknown_dist")} />);
    expect(container.firstChild).toBeNull();
  });
});
