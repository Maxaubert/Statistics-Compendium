import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Prose } from "./Prose";
import { GlossaryPopupProvider } from "./GlossaryPopup";
import type { GlossaryTerm } from "@/data/schema";

const glossary: GlossaryTerm[] = [
  {
    id: "sv",
    term_no: "Stokastisk variabel",
    short_def: "En tallverdi-variabel.",
    aliases: ["stokastisk variabel", "stokastisk", "stokastiske"],
  },
  {
    id: "varians",
    term_no: "Varians",
    short_def: "Spredning kvadrert.",
  },
];

function renderInProvider(node: React.ReactNode) {
  return render(
    <MemoryRouter>
      <GlossaryPopupProvider glossary={glossary}>{node}</GlossaryPopupProvider>
    </MemoryRouter>,
  );
}

describe("Prose", () => {
  it("renders a single paragraph for plain text", () => {
    const { container } = render(<Prose body="Hei verden" />);
    const ps = container.querySelectorAll("p");
    expect(ps).toHaveLength(1);
    expect(ps[0].textContent).toBe("Hei verden");
  });

  it("splits paragraphs on blank lines and joins wrapped lines with a space", () => {
    const { container } = render(
      <Prose body={"Linje en\nlinje to.\n\nNytt avsnitt"} />,
    );
    const ps = container.querySelectorAll("p");
    expect(ps).toHaveLength(2);
    expect(ps[0].textContent).toBe("Linje en linje to.");
    expect(ps[1].textContent).toBe("Nytt avsnitt");
  });

  it("renders bullet lists", () => {
    const { container } = render(
      <Prose body={"- Første\n- Andre\n- Tredje"} />,
    );
    const lis = container.querySelectorAll("li");
    expect(lis).toHaveLength(3);
    expect(lis[0].textContent).toBe("Første");
  });

  it("renders numbered lists", () => {
    const { container } = render(
      <Prose body={"Prosedyre:\n\n1. Første steg\n2. Andre steg\n3. Tredje steg"} />,
    );
    const ol = container.querySelector("ol");
    expect(ol).not.toBeNull();
    const lis = ol!.querySelectorAll("li");
    expect(lis).toHaveLength(3);
    expect(lis[0].textContent).toBe("Første steg");
    expect(lis[2].textContent).toBe("Tredje steg");
    // Heading paragraph still rendered
    expect(container.querySelector("p")?.textContent).toBe("Prosedyre:");
  });

  it("breaks paragraph when a numbered list begins on the next line", () => {
    const { container } = render(
      <Prose body={"Prosedyre:\n1. Første\n2. Andre"} />,
    );
    expect(container.querySelector("p")?.textContent).toBe("Prosedyre:");
    expect(container.querySelectorAll("ol li")).toHaveLength(2);
  });

  it("renders horizontal rule for ---", () => {
    const { container } = render(
      <Prose body={"En linje\n\n---\n\nNeste avsnitt"} />,
    );
    expect(container.querySelector("hr")).not.toBeNull();
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  it("renders 4-space indented lines as a code block", () => {
    const body = "Formel:\n\n    P(B) = Σ P(Aᵢ)·P(B|Aᵢ)\n\nEtterpå.";
    const { container } = render(<Prose body={body} />);
    const pre = container.querySelector("pre");
    expect(pre).not.toBeNull();
    expect(pre!.textContent).toBe("P(B) = Σ P(Aᵢ)·P(B|Aᵢ)");
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  it("renders *italic* spans without breaking **bold** or `code`", () => {
    const { container } = render(
      <Prose body="engelsk *degrees of freedom* og **bold** og `code`" />,
    );
    expect(container.querySelector("em")?.textContent).toBe("degrees of freedom");
    expect(container.querySelector("strong")?.textContent).toBe("bold");
    expect(container.querySelector("code")?.textContent).toBe("code");
  });

  it("renders ## headers as <h2> and ### as <h3>", () => {
    const body = "## Stor seksjon\n\nNoe tekst.\n\n### Mindre seksjon\n\nMer.";
    const { container } = render(<Prose body={body} />);
    expect(container.querySelector("h2")?.textContent).toBe("Stor seksjon");
    expect(container.querySelector("h3")?.textContent).toBe("Mindre seksjon");
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  it("renders [label](href) markdown links as router links", () => {
    render(
      <MemoryRouter>
        <Prose body="se [Poissonfordeling](/entry/poisson-fordeling) for detaljer" />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /Poissonfordeling/ });
    expect(link).toHaveAttribute("href", "/entry/poisson-fordeling");
  });

  it("renders inline bold and code", () => {
    const { container } = render(
      <Prose body="Pass på **fortegnet** i `(x − μ)²`." />,
    );
    expect(container.querySelector("strong")?.textContent).toBe("fortegnet");
    expect(container.querySelector("code")?.textContent).toBe("(x − μ)²");
  });

  it("does not render markdown when no special tokens are present", () => {
    const { container } = render(<Prose body="Bare ren tekst her." />);
    expect(container.querySelector("strong")).toBeNull();
    expect(container.querySelector("code")).toBeNull();
  });

  it("auto-links glossary terms when provider + glossary is present", () => {
    renderInProvider(
      <Prose body="En stokastisk variabel har varians." glossary={glossary} />,
    );
    expect(screen.getByRole("button", { name: /stokastisk variabel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /varians/i })).toBeInTheDocument();
  });

  it("does not link inside code spans", () => {
    renderInProvider(
      <Prose body="Bruk `varians` direkte." glossary={glossary} />,
    );
    expect(screen.queryByRole("button", { name: /varians/i })).toBeNull();
  });

  it("renders plain text when glossary provided but no provider mounted", () => {
    render(<Prose body="En stokastisk variabel" glossary={glossary} />);
    // Without provider, no button is rendered.
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("dedupes same-term links in one paragraph and keeps the longest form", () => {
    const dfGlossary = [
      {
        id: "frihetsgrader-glos",
        term_no: "Frihetsgrader (df, ν)",
        short_def: "x",
        aliases: ["frihetsgrader", "ν"],
      },
    ];
    renderInProvider(
      <Prose body="t-fordelt med ν = n − 1 frihetsgrader" glossary={dfGlossary} />,
    );
    const buttons = screen.queryAllByRole("button");
    // Only the longer form ("frihetsgrader") should remain a link.
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toBe("frihetsgrader");
  });
});
