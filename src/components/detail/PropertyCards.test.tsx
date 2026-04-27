import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PropertyCards } from "./PropertyCards";

describe("PropertyCards", () => {
  it("renders provided properties only", () => {
    render(
      <PropertyCards
        properties={{ expected_value: "E[X] = λt", variance: "Var[X] = λt" }}
      />
    );
    expect(screen.getByText("Forventningsverdi")).toBeInTheDocument();
    expect(screen.getByText("E[X] = λt")).toBeInTheDocument();
    expect(screen.getByText("Varians")).toBeInTheDocument();
    expect(screen.queryByText("Standardavvik")).not.toBeInTheDocument();
  });
});
