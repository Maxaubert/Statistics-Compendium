<div align="center">

# Statistikk-kompendium

**An offline, searchable formula and concept reference for ITD20218 (HiØ, V26).**

<img src="screenshots/01-list.png" alt="Browse view" width="820">

</div>

---

## Why

The exam permits local websites but not the internet. This compendium lets you identify the correct formula from what is visible in a problem (filters like *with replacement*, *rate given*, *two outcomes per trial*), even for problem types you have not solved before.

## What's inside

|        |                                                       |
|-------:|-------------------------------------------------------|
| **34** | formulas: distributions, tests, intervals             |
| **17** | concepts: kovarians, p-verdi, Poisson-prosess, ...    |
|  **6** | tables: E.1 through E.6 with interactive lookup       |
| **28** | symbols, each linked to where they appear             |
| **60** | glossary terms in Norwegian                           |

## Screenshots

<table>
<tr>
<td width="50%"><img src="screenshots/02-entry-normalfordeling.png" alt="Normalfordeling"><br><sub><b>Formula entry</b> with a KaTeX hero formula and cited sources.</sub></td>
<td width="50%"><img src="screenshots/04-concept-p-verdi.png" alt="P-verdi"><br><sub><b>Concept page</b> for cross-cutting ideas like p-verdi.</sub></td>
</tr>
<tr>
<td><img src="screenshots/05-table-z.png" alt="Z-tabell"><br><sub><b>Interactive table</b> for E.1 through E.6, with live lookup.</sub></td>
<td><img src="screenshots/08-veiviser.png" alt="Veiviser"><br><sub><b>Wizard</b> that helps you pick the right test or distribution.</sub></td>
</tr>
<tr>
<td><img src="screenshots/06-symboler.png" alt="Symboler"><br><sub><b>Symbols</b> grid, disambiguating overloaded glyphs like &alpha; and &beta;.</sub></td>
<td><img src="screenshots/07-ordliste.png" alt="Ordliste"><br><sub><b>Glossary</b> of Norwegian statistics terms.</sub></td>
</tr>
</table>

## Stack

React 18, TypeScript, Vite, Tailwind, KaTeX, Fuse.js, Zod. Content is one YAML file per entry, validated at build time so a malformed entry fails loudly.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static dist/, runs from file:// or USB
npm test
```

## Layout

```
content/
  entries/      formulas, one YAML per file
  concepts/     cross-cutting ideas
  tables/       E.1 through E.6 lookup configs
  symbols/      symbol definitions
  glossary/     Norwegian terms
src/            React app
screenshots/    captured via capture.sh
```

## Regenerating screenshots

With the dev server running on `:5173`:

```bash
bash screenshots/capture.sh
```

Drives headless Edge against each route at 1440 by 900.

---

<div align="center">
<sub>Built for ITD20218 Statistikk og statistisk programmering, HiØ V26.</sub>
</div>
