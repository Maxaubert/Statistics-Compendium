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
      screen.getByText(/Er den tilfeldige variabelen.*diskret.*eller kontinuerlig/i)
    ).toBeInTheDocument();
  });

  it("navigates to terminal entry recommendations", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>
    );
    // pick "Kontinuerlig" then "Tid TIL første hendelse"
    fireEvent.click(screen.getByText(/Kontinuerlig/));
    fireEvent.click(screen.getByText(/Tid TIL første/i));
    expect(
      screen.getByText(/Eksponentialfordeling/i, { exact: false })
    ).toBeInTheDocument();
  });
});
