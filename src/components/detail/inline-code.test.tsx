import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderInlineCode } from "./inline-code";

function renderInRouter(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

describe("renderInlineCode", () => {
  it("renders plain text", () => {
    const { container } = renderInRouter(<>{renderInlineCode("Hei verden")}</>);
    expect(container.textContent).toBe("Hei verden");
  });

  it("renders bold spans", () => {
    const { container } = renderInRouter(
      <>{renderInlineCode("Test **bold** ord")}</>,
    );
    const strong = container.querySelector("strong");
    expect(strong).not.toBeNull();
    expect(strong!.textContent).toBe("bold");
    // No literal asterisks should leak into the text content
    expect(container.textContent).not.toContain("**");
  });

  it("renders inline code as a <code> pill", () => {
    const { container } = renderInRouter(
      <>{renderInlineCode("var `x = 5` is set")}</>,
    );
    const code = container.querySelector("code");
    expect(code).not.toBeNull();
    expect(code!.textContent).toBe("x = 5");
  });

  it("renders bold containing inline code (the regression case)", () => {
    const { container } = renderInRouter(
      <>{renderInlineCode("Test **`X̄` er normalfordelt** ✓")}</>,
    );
    const strong = container.querySelector("strong");
    expect(strong).not.toBeNull();
    // Bold should contain a code pill, not literal asterisks
    expect(strong!.querySelector("code")?.textContent).toBe("X̄");
    expect(strong!.textContent).toContain("er normalfordelt");
    // The original string had no leftover literal `**`
    expect(container.textContent).not.toContain("**");
  });

  it("renders bold containing inline code multiple times", () => {
    const { container } = renderInRouter(
      <>
        {renderInlineCode(
          "**`σ` kjent** ⇒ z-test, **`σ` ukjent** ⇒ t-test",
        )}
      </>,
    );
    const strongs = container.querySelectorAll("strong");
    expect(strongs).toHaveLength(2);
    expect(strongs[0].querySelector("code")?.textContent).toBe("σ");
    expect(strongs[1].querySelector("code")?.textContent).toBe("σ");
    expect(container.textContent).not.toContain("**");
  });

  it("renders markdown links", () => {
    const { container } = renderInRouter(
      <>{renderInlineCode("Se [forventningsverdi](/glossary/forventningsverdi)")}</>,
    );
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link!.getAttribute("href")).toBe("/glossary/forventningsverdi");
    expect(link!.textContent).toBe("forventningsverdi");
  });

  it("renders bold containing a markdown link", () => {
    const { container } = renderInRouter(
      <>
        {renderInlineCode(
          "**Se [her](/entry/x) for mer**",
        )}
      </>,
    );
    const strong = container.querySelector("strong");
    expect(strong).not.toBeNull();
    const link = strong!.querySelector("a");
    expect(link).not.toBeNull();
    expect(link!.getAttribute("href")).toBe("/entry/x");
    expect(container.textContent).not.toContain("**");
  });

  it("auto-links tabell E.X references", () => {
    const { container } = renderInRouter(
      <>{renderInlineCode("Slå opp i tabell E.3")}</>,
    );
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link!.getAttribute("href")).toBe("/table/E3-z-tabell");
  });

  it("handles asterisks that are not bold pairs (text fall-through)", () => {
    const { container } = renderInRouter(
      <>{renderInlineCode("Multiply: 3 * 4 = 12")}</>,
    );
    expect(container.textContent).toBe("Multiply: 3 * 4 = 12");
  });
});
