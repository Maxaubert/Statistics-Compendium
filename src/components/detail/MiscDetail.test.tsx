import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { TrapAlert } from "./TrapAlert";
import { PythonSnippet } from "./PythonSnippet";
import { ToolCards } from "./ToolCards";
import { RelatedPills } from "./RelatedPills";
import { Pager } from "./Pager";

describe("TrapAlert", () => {
  it("renders body text in a yellow alert box", () => {
    render(<TrapAlert body="husk enheter" />);
    expect(screen.getByText("husk enheter")).toBeInTheDocument();
    expect(screen.getByText(/pass på/i)).toBeInTheDocument();
  });
});

describe("PythonSnippet", () => {
  it("renders code in a pre element", () => {
    render(<PythonSnippet code="from scipy.stats import poisson" />);
    expect(screen.getByText(/from scipy.stats/)).toBeInTheDocument();
  });
});

describe("ToolCards", () => {
  it("renders each tool name", () => {
    render(
      <MemoryRouter>
        <ToolCards tools={["Tabell E.2", "Kalkulator"]} tables={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText("Tabell E.2")).toBeInTheDocument();
    expect(screen.getByText("Kalkulator")).toBeInTheDocument();
  });

  it("links table tools to the corresponding /table route", () => {
    const tables = [{
      id: "E2-poisson-kumulativ",
      name_no: "Poissontabell",
      formal_name_no: "Kumulativ poissonfordeling",
      code: "E.2",
      description: "x",
      inputs: [],
      output: "P(X ≤ k)",
      distribution: "poisson" as const,
    }];
    render(
      <MemoryRouter>
        <ToolCards tools={["Tabell E.2 – Kumulativ poissonfordeling", "Kalkulator: e^x"]} tables={tables} />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /Tabell E\.2/ });
    expect(link).toHaveAttribute("href", "/table/E2-poisson-kumulativ");
    expect(screen.queryByRole("link", { name: /Kalkulator/ })).toBeNull();
  });
});

describe("RelatedPills", () => {
  it("renders a pill per related ref with kind suffix", () => {
    render(
      <MemoryRouter>
        <RelatedPills
          related={[
            { id: "poisson-prosess", kind: "concept", name: "Poissonprosess" },
            { id: "binomial-fordeling", kind: "entry", name: "Binomialfordeling" },
          ]}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Poissonprosess")).toBeInTheDocument();
    expect(screen.getByText("(konsept)")).toBeInTheDocument();
    expect(screen.getByText("Binomialfordeling")).toBeInTheDocument();
  });
});

describe("Pager", () => {
  it("renders prev and next buttons when both provided", () => {
    render(
      <MemoryRouter>
        <Pager
          prev={{ id: "prev-id", name: "Forrige formel" }}
          next={{ id: "next-id", name: "Neste formel" }}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Forrige formel")).toBeInTheDocument();
    expect(screen.getByText("Neste formel")).toBeInTheDocument();
  });
});
