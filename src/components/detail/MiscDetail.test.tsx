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
    render(<ToolCards tools={["Tabell E.2", "Kalkulator"]} />);
    expect(screen.getByText("Tabell E.2")).toBeInTheDocument();
    expect(screen.getByText("Kalkulator")).toBeInTheDocument();
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
