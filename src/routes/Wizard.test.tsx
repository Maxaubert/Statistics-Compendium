import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Wizard } from "./Wizard";

describe("Wizard (v2 soft-scoring)", () => {
  it("renders the first question with its options + Vet ikke", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Hva slags variabel/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Vet ikke/i })).toBeInTheDocument();
  });

  it("advances to the next question after picking an option", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Antall noe/i }));
    expect(screen.getByText(/Hva spør oppgaven om/i)).toBeInTheDocument();
  });

  it("shows the «Vis forslag nå» shortcut after 3 answers", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Antall noe/i }));
    fireEvent.click(screen.getByRole("button", { name: /Beregne en sannsynlighet/i }));
    fireEvent.click(screen.getByRole("button", { name: /Ett utvalg/i }));
    expect(screen.getByRole("button", { name: /Vis forslag nå/i })).toBeInTheDocument();
  });

  it("Vet ikke advances without contributing to scores", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>,
    );
    const skipButtons = screen.getAllByRole("button", { name: /Vet ikke/i });
    fireEvent.click(skipButtons[0]);
    expect(screen.getByText(/Hva spør oppgaven om/i)).toBeInTheDocument();
  });

  it("produces a top-N list with a top match after answering enough questions", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Antall noe/i }));
    fireEvent.click(screen.getByRole("button", { name: /Beregne en sannsynlighet/i }));
    fireEvent.click(screen.getByRole("button", { name: /Ett utvalg/i }));
    fireEvent.click(screen.getByRole("button", { name: /Vis forslag nå/i }));
    expect(screen.getByText(/Topp \d+ forslag/i)).toBeInTheDocument();
  });
});
