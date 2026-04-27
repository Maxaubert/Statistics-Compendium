import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StepByStep } from "./StepByStep";

describe("StepByStep", () => {
  it("renders steps in order", () => {
    const { container } = render(
      <StepByStep steps={["First", "Second", "Third"]} />
    );
    const items = container.querySelectorAll("li");
    expect(items[0]).toHaveTextContent("First");
    expect(items[2]).toHaveTextContent("Third");
  });
});
