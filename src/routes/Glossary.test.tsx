import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Glossary } from "./Glossary";

describe("Glossary", () => {
  it("renders glossary terms as cards", () => {
    render(
      <MemoryRouter>
        <Glossary />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /Ordliste/i })).toBeInTheDocument();
    expect(screen.getByText("P-verdi")).toBeInTheDocument();
  });

  it("opens a modal when a card is clicked and closes via the X button", () => {
    render(
      <MemoryRouter>
        <Glossary />
      </MemoryRouter>
    );
    const card = screen.getByRole("button", { name: /Vis definisjon av P-verdi/i });
    fireEvent.click(card);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const closeButtons = screen.getAllByRole("button", { name: /Lukk/i });
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
