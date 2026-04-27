import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroFormula } from "./HeroFormula";

describe("HeroFormula", () => {
  it("renders a HOVEDFORMEL label and the formula content", () => {
    const { container } = render(
      <HeroFormula latex="P(X = k) = \\frac{1}{k!}" />
    );
    expect(screen.getByText("Hovedformel")).toBeInTheDocument();
    expect(container.querySelector(".katex")).toBeInTheDocument();
  });
});
