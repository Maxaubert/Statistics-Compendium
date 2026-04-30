<div align="center">

# Statistikk-kompendium

**A compendium that helps students learn statistics.**

The goal: a student who does not yet recognize a concept or task can still find the right formula, either by filtering on what they observe in the problem, by walking through the *veiviser*, or by browsing the entries.

<img src="screenshots/01-list.png" alt="Browse view" width="820">

</div>

---

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
