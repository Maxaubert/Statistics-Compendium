import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Banner } from "./Banner";

function renderBanner() {
  return render(
    <MemoryRouter>
      <Banner />
    </MemoryRouter>
  );
}

function renderAt(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Banner />
    </MemoryRouter>,
  );
}

describe("Banner", () => {
  it("renders the title", () => {
    renderBanner();
    expect(screen.getByText("Statistikk-kompendium")).toBeInTheDocument();
  });
  it("renders the σ logo glyph", () => {
    renderBanner();
    expect(screen.getByText("σ")).toBeInTheDocument();
  });
  it("renders a theme toggle button", () => {
    renderBanner();
    expect(screen.getByRole("button", { name: /tema/i })).toBeInTheDocument();
  });
  it("logo links back to home", () => {
    renderBanner();
    const link = screen.getByRole("link", { name: /forsiden/i });
    expect(link).toHaveAttribute("href", "/");
  });
  it("renders secondary navigation links to helper pages", () => {
    renderBanner();
    expect(screen.getByRole("link", { name: /Veiviser/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ordliste/i })).toBeInTheDocument();
  });
});

describe("Banner — category tabs", () => {
  it("renders the merged Formler-og-konsepter and Tabeller links", () => {
    renderAt("/");
    expect(
      screen.getByRole("link", { name: /Formler og konsepter/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tabeller/i })).toBeInTheDocument();
  });

  it("does not render a separate Konsepter link", () => {
    renderAt("/");
    expect(
      screen.queryByRole("link", { name: /^Konsepter$/i }),
    ).not.toBeInTheDocument();
  });

  it("category tabs come before helper pages in the DOM", () => {
    renderAt("/");
    const labels = Array.from(document.querySelectorAll("nav a"))
      .map((a) => (a.textContent ?? "").replace(/\s+/g, " ").trim());
    expect(
      labels.indexOf("Formler og konsepter"),
    ).toBeLessThan(labels.indexOf("Veiviser"));
    // Ordliste sits between Formler-og-konsepter and Tabeller in the
    // category group; Veiviser is after all category tabs.
    expect(labels.indexOf("Ordliste")).toBeLessThan(labels.indexOf("Veiviser"));
    expect(labels.indexOf("Tabeller")).toBeLessThan(labels.indexOf("Veiviser"));
  });

  it("marks Formler-og-konsepter as current on the bare home path", () => {
    renderAt("/");
    const link = screen.getByRole("link", { name: /Formler og konsepter/i });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("marks Tabeller as current when ?tab=tabeller", () => {
    renderAt("/?tab=tabeller");
    const link = screen.getByRole("link", { name: /Tabeller/i });
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
