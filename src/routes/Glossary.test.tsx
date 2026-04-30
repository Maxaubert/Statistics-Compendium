import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Glossary } from "./Glossary";

describe("Glossary", () => {
  it("renders glossary terms with definitions", () => {
    render(
      <MemoryRouter>
        <Glossary />
      </MemoryRouter>
    );
    expect(screen.getByText(/Ordliste/i)).toBeInTheDocument();
    expect(screen.getByText("P-verdi")).toBeInTheDocument();
  });
});
