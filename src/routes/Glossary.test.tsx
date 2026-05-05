import { render, screen, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
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

  it("opens a modal when a card is clicked and closes via the X button", async () => {
    render(
      <MemoryRouter>
        <Glossary />
      </MemoryRouter>
    );
    const card = screen.getByRole("button", { name: /Vis definisjon av P-verdi/i });
    fireEvent.click(card);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    const closeButtons = screen.getAllByRole("button", { name: /Lukk/i });
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    // Modal exit animation delays the actual unmount; wait for it.
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  });
});
