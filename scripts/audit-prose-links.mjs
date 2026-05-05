// Walk every entry's what_it_does and every concept's what_it_means, run the
// glossary auto-linker against it, and print:
//   <entry-id>: <text>
//     → <surface> (=> <termId>)
//     ...
// So we can verify each link target makes sense for the surrounding prose.
import fs from "node:fs/promises";
import path from "node:path";
import yaml from "yaml";

const ROOT = path.resolve(import.meta.dirname, "..");
const ENTRIES = path.join(ROOT, "content/entries");
const CONCEPTS = path.join(ROOT, "content/concepts");
const GLOSSARY = path.join(ROOT, "content/glossary");

async function loadDir(dir) {
  const files = await fs.readdir(dir);
  return Promise.all(files.map(async (f) => {
    const txt = await fs.readFile(path.join(dir, f), "utf-8");
    return yaml.parse(txt);
  }));
}

const glossary = (await loadDir(GLOSSARY)).filter((g) => g.id !== "stub");
const entries = await loadDir(ENTRIES);
const concepts = await loadDir(CONCEPTS);

// --- Mirror of glossary-link.ts logic (kept in sync manually) ---
function cleanTermNo(name) {
  return name.replace(/\s*\([^)]*\)\s*$/g, "").replace(/[,;].*$/, "").trim();
}
function isAbbreviationLike(s) {
  if (!s.length || s.length > 5) return false;
  let upper = false;
  for (const ch of s) {
    if (ch >= "A" && ch <= "Z") { upper = true; continue; }
    if (ch >= "a" && ch <= "z") return false;
    const c = ch.charCodeAt(0);
    if ((c >= 0x30 && c <= 0x39) || (c >= 0x2080 && c <= 0x2089) ||
        (c >= 0x2070 && c <= 0x2079) || ch === "²" || ch === "³" || ch === "¹") continue;
    return false;
  }
  return upper;
}
function expandInflections(s) {
  const base = s.trim().toLowerCase();
  if (!base) return [];
  if (base.includes(" ") || base.length <= 4) return [base];
  const stem = base.endsWith("e") ? base.slice(0, -1) : base;
  return [base, stem + "en", base + "et", stem + "er", stem + "ene"];
}
function isCaseSensitive(s) {
  if (s.length === 1) return true;
  return isAbbreviationLike(s);
}
function aliasesFor(surface) {
  const t = surface.trim();
  if (!t) return [];
  if (isCaseSensitive(t)) return [{ surface: t, caseSensitive: true }];
  return expandInflections(t).map((s) => ({ surface: s, caseSensitive: false }));
}
const aliasIndex = [];
const seen = new Set();
for (const term of glossary) {
  const surfaces = (term.aliases?.length ? term.aliases : [cleanTermNo(term.term_no)]);
  for (const s of surfaces) {
    for (const e of aliasesFor(s)) {
      const key = `${e.caseSensitive ? "S" : "I"}|${e.surface}::${term.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      aliasIndex.push({ alias: e.surface, termId: term.id, caseSensitive: e.caseSensitive });
    }
  }
}
aliasIndex.sort((a, b) => b.alias.length - a.alias.length);
const LETTER = /[\p{L}\p{N}_]/u;
function isWord(c) { return LETTER.test(c); }
function findLinks(text) {
  const lower = text.toLowerCase();
  const out = [];
  let i = 0;
  while (i < text.length) {
    let match = null;
    for (const a of aliasIndex) {
      if (i + a.alias.length > text.length) continue;
      const hay = a.caseSensitive ? text : lower;
      if (hay.substr(i, a.alias.length) !== a.alias) continue;
      const before = i === 0 ? "" : text[i - 1];
      const after = text[i + a.alias.length] ?? "";
      if (before && isWord(before)) continue;
      if (after && isWord(after)) continue;
      match = a; break;
    }
    if (match) { out.push({ surface: text.substr(i, match.alias.length), termId: match.termId }); i += match.alias.length; }
    else if (isWord(text[i])) { while (i < text.length && isWord(text[i])) i++; }
    else { i++; }
  }
  return out;
}

// Dedupe within a single text (keep longest per termId)
function dedupe(links) {
  const byTerm = new Map();
  for (const l of links) {
    const cur = byTerm.get(l.termId);
    if (!cur || l.surface.length > cur.surface.length) byTerm.set(l.termId, l);
  }
  return [...byTerm.values()];
}

const glossaryById = new Map(glossary.map((g) => [g.id, g]));

function reportItem(kind, item, prose) {
  if (!prose) return;
  const links = dedupe(findLinks(prose));
  console.log(`\n=== ${kind}: ${item.id} (${item.name_no}) ===`);
  console.log(`  ${prose.replace(/\n/g, "\n  ")}`);
  if (!links.length) { console.log("  → (no links)"); return; }
  for (const l of links) {
    const g = glossaryById.get(l.termId);
    if (!g) { console.log(`  → ${l.surface} → ${l.termId} (MISSING ENTRY)`); continue; }
    console.log(`  → "${l.surface}" → ${l.termId}: ${g.short_def}`);
  }
}

console.log("# ENTRIES (Hva den gjør)\n");
for (const e of entries) reportItem("entry", e, e.what_it_does);

console.log("\n\n# CONCEPTS (Hva det betyr)\n");
for (const c of concepts) reportItem("concept", c, c.what_it_means);
