import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Banner } from "./Banner";

describe("Banner", () => {
  it("renders the title", () => {
    render(<Banner />);
    expect(screen.getByText("Statistikk-kompendium")).toBeInTheDocument();
  });
  it("renders the σ logo glyph", () => {
    render(<Banner />);
    expect(screen.getByText("σ")).toBeInTheDocument();
  });
  it("renders a theme toggle button", () => {
    render(<Banner />);
    expect(screen.getByRole("button", { name: /tema/i })).toBeInTheDocument();
  });
});
