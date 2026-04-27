import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Info } from "lucide-react";
import { Section } from "./Section";

describe("Section", () => {
  it("renders title and children", () => {
    render(
      <Section title="Hva den gjør" icon={Info}>
        <p>body</p>
      </Section>
    );
    expect(screen.getByText("Hva den gjør")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });
});
