# Banner Nav + Glossary Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Formler/Konsepter/Tabeller tabs into the top banner nav (in front of Veiviser/Ordliste/Symboler), add glossary results to the formler+konsepter cross-search, and make search ignore hyphens (so `p verdi` matches `p-verdi`).

**Architecture:**
- The active list-view "tab" is driven by a `?tab=` URL search param read with `useSearchParams`. The banner nav renders six links — three category tabs first (`/?tab=formler|konsepter|tabeller`) then the three helper pages — and highlights the active one based on current location + param. The inline `TabBar` on ListView is removed because the banner now owns category navigation.
- A new fuse index over the glossary feeds a third `CrossSearchSection` shown when the user types a query in the formler or konsepter tab. Clicking a glossary hit opens the existing `GlossaryPopup` in-place (the route stays on `/`).
- Hyphen-insensitive matching is implemented at the Fuse layer: a custom `getFn` strips hyphens from indexed string values, and a small `searchWith(idx, query)` helper strips hyphens from the query before delegating to `idx.search`. This handles both directions — `"p verdi"` matching `"p-verdi"` content, and `"p-verdi"` matching `"p verdi"` content.

**Tech Stack:** React + TypeScript + Vite, react-router v6 (HashRouter), fuse.js for search, Vitest + Testing Library for tests, Tailwind for styling.

---

## File Structure

**New files:**
- (none)

**Modified files:**
- `src/data/search.ts` — add hyphen-insensitive `getFn`, add `buildGlossarySearchIndex`, add `searchWith(idx, query)` helper.
- `src/data/search.test.ts` — new tests for hyphen-insensitivity and the glossary index.
- `src/components/shell/Banner.tsx` — render six nav links (three category tabs + three helper pages), highlight active.
- `src/components/shell/Banner.test.tsx` — assert the new category-tab links are present and active highlighting works.
- `src/routes/ListView.tsx` — drive `tab` from `?tab=` URL param via `useSearchParams`; drop the inline `TabBar`; wrap in `GlossaryPopupProvider`; add a glossary cross-search section to formler and konsepter tabs.
- `src/routes/ListView.test.tsx` — tests for URL-param tab selection and the glossary cross-search section appearing.
- `src/components/list/EntryTable.tsx` — no changes (just sanity-check it still works).

**Component left in place but unused by ListView:** `src/components/shell/TabBar.tsx`. We deliberately do *not* delete it — there are still mockup routes (`MockupTabsV2`, `MockupTabsV3`, etc.) that consume it. Its tests stay too.

---

## Task 1: Hyphen-insensitive search at the Fuse layer

**Files:**
- Modify: `src/data/search.ts`
- Test: `src/data/search.test.ts`

- [ ] **Step 1: Write a failing test for hyphen-insensitive matching**

Add this case to `src/data/search.test.ts`, inside the existing `describe("buildSearchIndex", ...)` block:

```ts
import { searchEntries } from "./search";

it("matches across hyphens (p verdi finds p-verdi)", () => {
  const items: Entry[] = [
    {
      id: "p-verdi-entry",
      name_no: "P-verdi",
      type: "identity",
      tagline: "Sannsynlighet for å se data minst like ekstreme.",
      formula_main: "",
      formula_latex: "",
      what_it_does: "",
      recognition_cues: [],
      filters: {},
    },
  ];
  const idx = buildSearchIndex(items);
  expect(searchEntries(idx, "p verdi").map((h) => h.item.id)).toContain("p-verdi-entry");
  expect(searchEntries(idx, "p-verdi").map((h) => h.item.id)).toContain("p-verdi-entry");
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `npm test -- search`
Expected: FAIL (`searchEntries` undefined or no matches across hyphens).

- [ ] **Step 3: Implement hyphen-insensitive index + helper**

Replace the body of `src/data/search.ts` with:

```ts
import Fuse from "fuse.js";
import type { Concept, Entry, GlossaryTerm } from "./schema";

/**
 * Treat hyphens like spaces so users can search for "p verdi" and find
 * "P-verdi" (and vice versa). Applied to both indexed values and the
 * query string so the substitution is symmetric.
 */
function normalizeHyphens(s: string): string {
  return s.replace(/-/g, " ");
}

function makeGetFn() {
  // Wrap Fuse's default getter so any string we hand to the index has
  // hyphens turned into spaces. Arrays get mapped element-wise; non-string
  // values pass through unchanged.
  const baseGetFn = Fuse.config.getFn;
  return (obj: unknown, path: string | string[]) => {
    const v = baseGetFn(obj, path);
    if (typeof v === "string") return normalizeHyphens(v);
    if (Array.isArray(v)) {
      return v.map((x) => (typeof x === "string" ? normalizeHyphens(x) : x));
    }
    return v;
  };
}

/** Run a search after normalizing the query to match the indexed form. */
export function searchWith<T>(idx: Fuse<T>, query: string) {
  return idx.search(normalizeHyphens(query));
}

/** Convenience wrappers so callers don't have to remember to normalize. */
export const searchEntries = searchWith;
export const searchConcepts = searchWith;
export const searchGlossary = searchWith;

export function buildSearchIndex(entries: Entry[]) {
  return new Fuse(entries, {
    includeScore: true,
    threshold: 0.4,
    getFn: makeGetFn(),
    keys: [
      { name: "name_no", weight: 1.0 },
      { name: "tagline", weight: 0.7 },
      { name: "recognition_cues", weight: 0.6 },
      { name: "symbols.sym", weight: 0.5 },
      { name: "symbols.means", weight: 0.4 },
      { name: "examples.excerpt", weight: 0.4 },
      { name: "examples.source", weight: 0.3 },
      { name: "what_it_does", weight: 0.3 },
    ],
  });
}

export function buildConceptSearchIndex(concepts: Concept[]) {
  return new Fuse(concepts, {
    includeScore: true,
    threshold: 0.4,
    getFn: makeGetFn(),
    keys: [
      { name: "name_no", weight: 1.0 },
      { name: "tagline", weight: 0.7 },
      { name: "recognition_cues", weight: 0.6 },
      { name: "what_it_means", weight: 0.4 },
      { name: "examples.excerpt", weight: 0.4 },
      { name: "examples.source", weight: 0.3 },
    ],
  });
}

export function buildGlossarySearchIndex(terms: GlossaryTerm[]) {
  return new Fuse(terms, {
    includeScore: true,
    threshold: 0.4,
    getFn: makeGetFn(),
    keys: [
      { name: "term_no", weight: 1.0 },
      { name: "aliases", weight: 0.8 },
      { name: "short_def", weight: 0.6 },
      { name: "long_def", weight: 0.3 },
    ],
  });
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `npm test -- search`
Expected: PASS, all four search tests green.

- [ ] **Step 5: Add a glossary index test**

Append to `src/data/search.test.ts`:

```ts
import { buildGlossarySearchIndex, searchGlossary } from "./search";
import type { GlossaryTerm } from "./schema";

describe("buildGlossarySearchIndex", () => {
  const terms: GlossaryTerm[] = [
    {
      id: "p-verdi-glos",
      term_no: "P-verdi",
      short_def: "Sannsynligheten for ekstreme data gitt H₀.",
    },
    {
      id: "frihetsgrader-glos",
      term_no: "Frihetsgrader (df, ν)",
      short_def: "Antall uavhengige biter informasjon.",
      aliases: ["frihetsgrader", "df", "ν"],
    },
  ];

  it("finds a term by name", () => {
    const idx = buildGlossarySearchIndex(terms);
    expect(searchGlossary(idx, "frihetsgrader").map((h) => h.item.id))
      .toContain("frihetsgrader-glos");
  });

  it("finds a hyphenated term via space query", () => {
    const idx = buildGlossarySearchIndex(terms);
    expect(searchGlossary(idx, "p verdi").map((h) => h.item.id))
      .toContain("p-verdi-glos");
  });

  it("finds a term via an alias", () => {
    const idx = buildGlossarySearchIndex(terms);
    expect(searchGlossary(idx, "df").map((h) => h.item.id))
      .toContain("frihetsgrader-glos");
  });
});
```

- [ ] **Step 6: Run all tests**

Run: `npm test`
Expected: PASS (135 → 138 tests).

- [ ] **Step 7: Commit**

```bash
git add src/data/search.ts src/data/search.test.ts
git commit -m "feat(search): hyphen-insensitive matching + glossary search index"
```

---

## Task 2: Drive ListView tab from URL (`?tab=`)

**Files:**
- Modify: `src/routes/ListView.tsx`
- Test: `src/routes/ListView.test.tsx`

- [ ] **Step 1: Read the existing ListView test**

Run: `cat src/routes/ListView.test.tsx`
Note the existing tests so we don't break them. They render `<ListView />` inside a `MemoryRouter` and check that entries from the fixture appear.

- [ ] **Step 2: Write a failing test for URL-driven tab**

Append to `src/routes/ListView.test.tsx`:

```tsx
it("opens the konsepter tab when ?tab=konsepter is in the URL", async () => {
  render(
    <MemoryRouter initialEntries={["/?tab=konsepter"]}>
      <ListView />
    </MemoryRouter>,
  );
  // The konsepter search placeholder identifies which tab is active.
  expect(
    await screen.findByPlaceholderText(/Søk i konsepter/i),
  ).toBeInTheDocument();
});

it("opens the tabeller tab when ?tab=tabeller is in the URL", async () => {
  render(
    <MemoryRouter initialEntries={["/?tab=tabeller"]}>
      <ListView />
    </MemoryRouter>,
  );
  // Tabeller tab shows a banner-style hint instead of a search input.
  expect(
    await screen.findByText(/Tabellene er interaktive/i),
  ).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the test, verify it fails**

Run: `npm test -- ListView`
Expected: FAIL — current code uses `useState`, ignores URL.

- [ ] **Step 4: Update the existing tabeller test to use URL param**

The existing test on line 33 of `src/routes/ListView.test.tsx` clicks a `role="tab"` element. We're about to remove the `<TabBar>` (which provides those tab roles) in Task 3. Pre-empt that breakage by rewriting the test to navigate via URL param instead:

Replace this block:

```tsx
it("shows the Tabeller tab content when selected", () => {
  render(
    <MemoryRouter>
      <ListView />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole("tab", { name: /Tabeller/i }));
  expect(screen.getByText("Poissontabell")).toBeInTheDocument();
});
```

with:

```tsx
it("shows the Tabeller tab content when ?tab=tabeller is in the URL", () => {
  render(
    <MemoryRouter initialEntries={["/?tab=tabeller"]}>
      <ListView />
    </MemoryRouter>
  );
  expect(screen.getByText("Poissontabell")).toBeInTheDocument();
});
```

(Both new tests in step 2 already use `initialEntries`; this rewrite makes the existing test consistent.)

- [ ] **Step 5: Replace local tab state with URL search param**

Edit `src/routes/ListView.tsx` — change the imports and the tab state:

```tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
// ...other imports unchanged...

const VALID_TABS = new Set(["formler", "konsepter", "tabeller"]);

export function ListView() {
  const data = loadAllContent();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab") ?? "formler";
  const tab = VALID_TABS.has(rawTab) ? rawTab : "formler";

  const setTab = (key: string) => {
    setSearchParams(
      key === "formler" ? {} : { tab: key },
      { replace: true },
    );
  };

  const [conceptQuery, setConceptQuery] = useState("");

  // ...rest of the function stays the same except wherever the old
  //    useState `tab` setter was called, replace `setTab` with the new one.
}
```

The existing `onChange={(key) => { setTab(key); setQuery(""); setConceptQuery(""); }}` on `<TabBar>` keeps working with the new `setTab`. (The `<TabBar>` itself goes away in Task 3 — leave the call site alone for now; we delete the whole block in Task 3.)

- [ ] **Step 6: Run the test, verify it passes**

Run: `npm test -- ListView`
Expected: PASS, all ListView tests green (rewritten Tabeller test + 2 new + 2 existing = 5).

- [ ] **Step 7: Commit**

```bash
git add src/routes/ListView.tsx src/routes/ListView.test.tsx
git commit -m "feat(list): drive active tab from ?tab= URL search param"
```

---

## Task 3: Move category tabs into the Banner nav

**Files:**
- Modify: `src/components/shell/Banner.tsx`
- Test: `src/components/shell/Banner.test.tsx`
- Modify: `src/routes/ListView.tsx` (remove the `<TabBar>` block)

- [ ] **Step 1: Write failing tests for the new banner links**

Append to `src/components/shell/Banner.test.tsx`:

```tsx
import { MemoryRouter } from "react-router-dom";

function renderAt(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Banner />
    </MemoryRouter>,
  );
}

describe("Banner — category tabs", () => {
  it("renders Formler, Konsepter and Tabeller links in the nav", () => {
    renderAt("/");
    expect(screen.getByRole("link", { name: /Formler/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Konsepter/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tabeller/i })).toBeInTheDocument();
  });

  it("category tabs come before helper pages in the DOM", () => {
    renderAt("/");
    const labels = Array.from(document.querySelectorAll("nav a"))
      .map((a) => (a.textContent ?? "").replace(/\s+/g, " ").trim());
    expect(labels.indexOf("Formler")).toBeLessThan(labels.indexOf("Veiviser"));
    expect(labels.indexOf("Konsepter")).toBeLessThan(labels.indexOf("Ordliste"));
  });

  it("marks the konsepter link as current when ?tab=konsepter", () => {
    renderAt("/?tab=konsepter");
    const link = screen.getByRole("link", { name: /Konsepter/i });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("marks Formler as current on the bare home path", () => {
    renderAt("/");
    const link = screen.getByRole("link", { name: /Formler/i });
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
```

- [ ] **Step 2: Run the tests, verify they fail**

Run: `npm test -- Banner`
Expected: FAIL — Banner doesn't render category links yet.

- [ ] **Step 3: Add the category links to Banner**

Replace the contents of `src/components/shell/Banner.tsx` with:

```tsx
import { Moon, Sun, Compass, BookA, Sigma, Lightbulb, Table2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

interface NavLink {
  to: string;
  label: string;
  Icon: typeof Compass;
  /** When set, this link is "current" only if /?tab=<value> matches. */
  tabParam?: string;
}

const CATEGORY_LINKS: NavLink[] = [
  { to: "/", label: "Formler", Icon: Sigma, tabParam: "formler" },
  { to: "/?tab=konsepter", label: "Konsepter", Icon: Lightbulb, tabParam: "konsepter" },
  { to: "/?tab=tabeller", label: "Tabeller", Icon: Table2, tabParam: "tabeller" },
];

const HELPER_LINKS: NavLink[] = [
  { to: "/veiviser", label: "Veiviser", Icon: Compass },
  { to: "/ordliste", label: "Ordliste", Icon: BookA },
  { to: "/symboler", label: "Symboler", Icon: Sigma },
];

function isActive(loc: ReturnType<typeof useLocation>, link: NavLink): boolean {
  if (link.tabParam !== undefined) {
    if (loc.pathname !== "/") return false;
    const params = new URLSearchParams(loc.search);
    const tab = params.get("tab") ?? "formler";
    return tab === link.tabParam;
  }
  return loc.pathname === link.to;
}

export function Banner() {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const Icon = theme === "light" ? Moon : Sun;
  const allLinks = [...CATEGORY_LINKS, ...HELPER_LINKS];
  return (
    <header
      className="relative overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
      }}
    >
      <div
        className="absolute -right-10 -top-10 h-[220px] w-[220px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 flex items-center justify-between px-7 py-4">
        <Link
          to="/"
          aria-label="Til forsiden"
          className="flex items-center gap-3 text-white no-underline transition-opacity hover:opacity-90"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10"
            aria-hidden
          >
            <span
              className="font-serif text-xl font-semibold italic"
              style={{ color: "#fef3c7" }}
            >
              σ
            </span>
          </div>
          <h1 className="m-0 font-serif text-[17px] font-semibold tracking-tight">
            Statistikk-kompendium
          </h1>
        </Link>
        <button
          type="button"
          aria-label="Bytt tema"
          onClick={toggle}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10"
        >
          <Icon size={16} />
        </button>
      </div>
      <nav className="relative z-10 flex flex-wrap gap-1 border-t border-white/10 px-7 py-2 text-[12.5px]">
        {allLinks.map((link) => {
          const active = isActive(location, link);
          return (
            <Link
              key={link.to + link.label}
              to={link.to}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 font-semibold text-white no-underline"
                  : "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-white/85 no-underline hover:bg-white/10 hover:text-white"
              }
            >
              <link.Icon size={13} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Run Banner tests**

Run: `npm test -- Banner`
Expected: PASS, all 9 Banner tests (5 existing + 4 new) green.

- [ ] **Step 5: Remove the inline TabBar from ListView**

In `src/routes/ListView.tsx`:

1. Remove the import line `import { TabBar } from "@/components/shell/TabBar";`
2. Delete the `<TabBar>` block:

   ```tsx
   <TabBar
     tabs={[
       { key: "formler", label: "Formler", count: data.entries.length },
       { key: "konsepter", label: "Konsepter", count: data.concepts.length },
       { key: "tabeller", label: "Tabeller", count: data.tables.length },
     ]}
     active={tab}
     onChange={(key) => {
       setTab(key);
       setQuery("");
       setConceptQuery("");
     }}
   />
   ```

The `setTab` function is still used by the test — and may also still be referenced elsewhere. After deleting the TabBar block, use a quick grep to confirm `setTab` is no longer referenced inside ListView. If it isn't, you can also remove the `setTab` definition. (The component still needs `searchParams` to read `?tab=`, so leave that intact.)

Run: `grep -n "setTab" src/routes/ListView.tsx`
Expected: no remaining matches inside the file.

- [ ] **Step 6: Run full test suite**

Run: `npm run typecheck && npm test`
Expected: typecheck clean, all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/shell/Banner.tsx src/components/shell/Banner.test.tsx src/routes/ListView.tsx
git commit -m "feat(banner): move Formler/Konsepter/Tabeller into top nav"
```

---

## Task 4: Glossary cross-search section on formler + konsepter tabs

**Files:**
- Modify: `src/routes/ListView.tsx`
- Test: `src/routes/ListView.test.tsx`

- [ ] **Step 1: Write a failing test for the glossary cross-section**

Append to `src/routes/ListView.test.tsx` (uses `fireEvent.change` to match the rest of the test file — no extra dependencies required):

```tsx
it("shows a glossary cross-search section when typing in formler", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <ListView />
    </MemoryRouter>,
  );
  const input = screen.getByPlaceholderText(/Søk i navn, symboler/i);
  fireEvent.change(input, { target: { value: "frihetsgrader" } });
  expect(screen.getByText(/Termer som også matcher/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `npm test -- ListView`
Expected: FAIL — no "Termer som også matcher" section yet.

- [ ] **Step 3: Wire the glossary index into ListView**

Open `src/routes/ListView.tsx`. Update the imports to add the new search builder + provider:

```tsx
import {
  buildConceptSearchIndex,
  buildGlossarySearchIndex,
  buildSearchIndex,
  searchConcepts,
  searchEntries,
  searchGlossary,
} from "@/data/search";
import { GlossaryPopupProvider, useGlossaryPopup } from "@/components/detail/GlossaryPopup";
```

Inside `ListView`, add the glossary fuse index next to the existing ones:

```tsx
const glossaryFuse = useMemo(
  () => buildGlossarySearchIndex(data.glossary),
  [data.glossary],
);
```

Replace the `filteredConcepts` and the two `crossX` `useMemo` blocks with versions that go through `searchConcepts`/`searchEntries`/`searchGlossary` so hyphen-insensitivity is applied. Also add a glossary-hits memo:

```tsx
const filteredConcepts = useMemo(() => {
  const q = conceptQuery.trim();
  if (!q) return data.concepts;
  return searchConcepts(conceptFuse, q).map((h) => h.item);
}, [conceptQuery, conceptFuse, data.concepts]);

const crossConceptHits = useMemo(() => {
  const q = query.trim();
  if (!q) return [];
  return searchConcepts(conceptFuse, q).slice(0, CROSS_HIT_CAP).map((h) => h.item);
}, [query, conceptFuse]);

const crossEntryHits = useMemo(() => {
  const q = conceptQuery.trim();
  if (!q) return [];
  return searchEntries(entryFuse, q).slice(0, CROSS_HIT_CAP).map((h) => h.item);
}, [conceptQuery, entryFuse]);

const crossGlossaryHitsForFormler = useMemo(() => {
  const q = query.trim();
  if (!q) return [];
  return searchGlossary(glossaryFuse, q).slice(0, CROSS_HIT_CAP).map((h) => h.item);
}, [query, glossaryFuse]);

const crossGlossaryHitsForKonsepter = useMemo(() => {
  const q = conceptQuery.trim();
  if (!q) return [];
  return searchGlossary(glossaryFuse, q).slice(0, CROSS_HIT_CAP).map((h) => h.item);
}, [conceptQuery, glossaryFuse]);
```

Also update the `useFilteredContent` hook usage if it does its own searching internally — since it already accepts a query string, leave it for now and let Task 4 follow-up cover that if needed. The cross-tab sections above are explicitly the ones we want hyphen-insensitive.

Wrap the whole returned tree in `GlossaryPopupProvider` so the new section's hits can open popups:

```tsx
return (
  <GlossaryPopupProvider glossary={data.glossary}>
    <div data-testid="list-view" className="min-h-screen bg-paper">
      ...existing content...
    </div>
  </GlossaryPopupProvider>
);
```

After the existing `crossConceptHits` block in the formler branch, add a glossary section:

```tsx
{query.trim().length > 0 && crossGlossaryHitsForFormler.length > 0 && (
  <GlossaryCrossSection
    items={crossGlossaryHitsForFormler.map((g) => ({
      id: g.id,
      term_no: g.term_no,
      short_def: g.short_def,
    }))}
  />
)}
```

Same in the konsepter branch, with `crossGlossaryHitsForKonsepter`.

Now define `GlossaryCrossSection` at the bottom of the file (after the existing `CrossSearchSection`):

```tsx
interface GlossaryCrossItem {
  id: string;
  term_no: string;
  short_def: string;
}

function GlossaryCrossSection({ items }: { items: GlossaryCrossItem[] }) {
  const popup = useGlossaryPopup();
  return (
    <section className="mt-8 rounded-xl border border-dashed border-line bg-paper-2/50 px-4 py-4">
      <h3 className="mb-3 flex items-baseline gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
        <span>Termer som også matcher</span>
        <span className="rounded-full bg-primary-2/15 px-1.5 py-px text-[10px] tracking-normal text-primary-2">
          {items.length}
        </span>
      </h3>
      <ul className="m-0 grid list-none gap-1.5 p-0">
        {items.map((it) => (
          <li
            key={it.id}
            onClick={() => popup?.openTerm(it.id)}
            className="group cursor-pointer rounded-md border border-line bg-card px-3.5 py-2 hover:border-primary-2"
          >
            <div className="flex items-baseline gap-3">
              <div className="font-serif text-[14px] font-medium text-ink group-hover:text-primary-2">
                {it.term_no}
              </div>
              <div className="flex-1 truncate text-[12.5px] italic text-ink-3">
                {it.short_def}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `npm test -- ListView`
Expected: PASS — both formler/konsepter glossary sections show up when there's a query.

- [ ] **Step 5: Run all tests and typecheck**

Run: `npm run typecheck && npm test`
Expected: typecheck clean, all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/routes/ListView.tsx src/routes/ListView.test.tsx
git commit -m "feat(list): add glossary cross-search section on formler + konsepter"
```

---

## Task 5: Sanity check + visual verification

**Files:**
- (none)

- [ ] **Step 1: Run the full test suite once more**

Run: `npm run typecheck && npm test`
Expected: clean, all tests pass.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: prints `Local: http://localhost:NNNN/` (Vite picks the next free port).

- [ ] **Step 3: Manual smoke checks**

In a browser at the dev URL:

1. Banner nav has six items in this order: Formler, Konsepter, Tabeller, Veiviser, Ordliste, Symboler.
2. Clicking Konsepter goes to `/#/?tab=konsepter` and the konsepter list renders.
3. The active link is visibly highlighted.
4. On the formler tab, type `p verdi` — the P-verdi term shows up in a "Termer som også matcher" section near the bottom.
5. Click that term — the glossary popup opens (with the same dark calc-card design as the rest of the site).
6. Browser back/forward between tabs preserves expected state.

- [ ] **Step 4: Stop the dev server**

Press Ctrl+C in the terminal running `npm run dev`.

- [ ] **Step 5: Done**

The branch is ready for final review.
