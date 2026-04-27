import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Math } from "./Math";

describe("Math", () => {
  it("renders LaTeX content", () => {
    const { container } = render(<Math latex="P(X = k) = \\frac{1}{k!}" />);
    expect(container.querySelector(".katex")).toBeInTheDocument();
  });
  it("falls back to plain text on render error", () => {
    render(<Math latex="\\unknownmacro{}" fallback="plain text" />);
    expect(screen.getByText("plain text")).toBeInTheDocument();
  });
});
