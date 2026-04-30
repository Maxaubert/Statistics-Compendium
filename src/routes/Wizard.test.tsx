import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Wizard } from "./Wizard";

describe("Wizard", () => {
  it("renders the start question", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/Hva slags oppgave er dette/i)
    ).toBeInTheDocument();
  });

  it("navigates from a tilfeldig-variabel branch to a terminal entry", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Tilfeldig variabel med en kjent fordeling/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Kontinuerlig – målinger på en skala/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Tid TIL første hendelse/i })
    );
    expect(
      screen.getByText(/Eksponentialfordeling/i, { exact: false })
    ).toBeInTheDocument();
  });

  it("routes a probability-rules question to the right entry", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Sannsynlighetsregning/i));
    fireEvent.click(screen.getByText(/Bayes/i));
    expect(
      screen.getByText(/Bayes/i, { exact: false })
    ).toBeInTheDocument();
  });

  it("routes a joint-distribution question to korrelasjon", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Simultanfordeling/i));
    fireEvent.click(screen.getByText(/Korrelasjon/i));
    expect(
      screen.getByText(/[Kk]orrelasjon/i, { exact: false })
    ).toBeInTheDocument();
  });
});
