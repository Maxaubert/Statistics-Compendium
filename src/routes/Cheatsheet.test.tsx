import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Cheatsheet } from "./Cheatsheet";

describe("Cheatsheet", () => {
  it("renders all entries compactly", () => {
    render(
      <MemoryRouter>
        <Cheatsheet />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cheat-?sheet/i)).toBeInTheDocument();
    // Should contain at least poisson and normal entry names
    expect(screen.getByText("Poissonfordeling")).toBeInTheDocument();
    expect(screen.getByText("Normalfordeling")).toBeInTheDocument();
  });
});
