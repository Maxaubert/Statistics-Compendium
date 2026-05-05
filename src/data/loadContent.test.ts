import { describe, it, expect } from "vitest";
import { loadAllContent } from "./loadContent";

describe("loadAllContent", () => {
  it("loads all entries and tables from content/", () => {
    const data = loadAllContent();
    expect(data.entries.length).toBeGreaterThanOrEqual(2);
    expect(data.tables.length).toBeGreaterThanOrEqual(1);
    expect(data.filters.dimensions.length).toBeGreaterThan(0);
  });

  it("validates each entry against the schema", () => {
    const data = loadAllContent();
    const poisson = data.entries.find((e) => e.id === "poisson-fordeling");
    expect(poisson).toBeDefined();
    expect(poisson?.name_no).toBe("Poissonfordeling");
    expect(poisson?.type).toBe("distribution");
  });

  it("ensures every entry id is unique", () => {
    const data = loadAllContent();
    const ids = data.entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves a related ref by kind", () => {
    const data = loadAllContent();
    const poisson = data.entries.find((e) => e.id === "poisson-fordeling")!;
    const rel = poisson.related?.find(
      (r) => r.kind === "glossary" && r.id === "poisson-prosess"
    );
    expect(rel?.id).toBe("poisson-prosess");
    expect(data.glossary.find((g) => g.id === rel!.id)).toBeDefined();
  });

  it("loads glossary, symbols, and wizard", () => {
    const bundle = loadAllContent();
    expect(bundle.glossary).toBeInstanceOf(Array);
    expect(bundle.symbols).toBeInstanceOf(Array);
    expect(bundle.wizard).not.toBeNull();
  });
});
