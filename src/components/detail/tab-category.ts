export type TabKind = "forover" | "invers" | "neutral";

export interface TabMeta {
  /** Small-caps category badge above the name, or `null` to omit. */
  tag: string | null;
  kind: TabKind;
  /**
   * Natural-language short name shown on the tab itself
   * (e.g. "Mindre enn", "Finn x", "Venstre"). Always present.
   */
  short: string;
  /**
   * Formula expression revealed when the tab is active in the
   * disclosure layout (e.g. "P(X < x)", "H₁: μ < μ₀").
   * `undefined` when the variant has no compact formula form.
   */
  formula?: string;
}

const PAREN_DIRECTION = /^(.+?)\s*\((venstre|høyre|tosidig)\)\s*$/i;

function capitalize(s: string): string {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * Strip a trailing parenthetical clarification ("Memoryless (gitt at …)")
 * but keep parens that are part of an expression like "P(X = k)".
 */
function stripDescriptiveParen(text: string): string {
  return text.replace(/\s+\([^)]+\)\s*$/, "").trim();
}

/**
 * Derives a small natural-language name + an optional formula expression
 * from a raw variant label. The tab strip uses `short` as the resting
 * label and `formula` as the disclosure body that appears under the
 * active tab. Heuristics — entries don't need to specify these
 * explicitly. Falls back to the cleaned-up label if no pattern matches.
 */
export function deriveTabMeta(label: string): TabMeta {
  const trimmed = label.trim();

  // 1) Hypothesis-test direction in trailing parens — "(venstre)"/"(høyre)"/"(tosidig)"
  const dir = trimmed.match(PAREN_DIRECTION);
  if (dir) {
    return {
      tag: dir[2].toUpperCase(),
      kind: "forover",
      short: capitalize(dir[2].toLowerCase()),
      formula: dir[1].trim(),
    };
  }

  // 2) "Invers: finn x" / "Invers: finn μ (eller σ)"
  if (/^Invers\b/i.test(trimmed)) {
    const after = trimmed.replace(/^Invers\s*[:\-–—]?\s*/i, "").trim();
    if (!after) return { tag: "INVERS", kind: "invers", short: "Invers" };
    // Strip parenthetical clarification when forming the short name.
    const baseShort = capitalize(after.replace(/\s+\([^)]+\)\s*$/, ""));
    return { tag: "INVERS", kind: "invers", short: baseShort, formula: trimmed };
  }

  // 3) "Finn n for terskel" / "Finn k for terskel"
  const findM = trimmed.match(/^Finn\s+(\S+)(?:\s+for\s+terskel)?/i);
  if (findM) {
    return {
      tag: "INVERS",
      kind: "invers",
      short: `Finn ${findM[1]}`,
      formula: trimmed,
    };
  }

  // 4) Probability expressions — "P(X < x)", "P(X = k)", etc.
  if (/^P\s*\(/.test(trimmed)) {
    // 4a) Em-dash carries an explicit name: "P(T > t) — overlevelse (...)"
    const dashSplit = trimmed.split(/\s+[—–]\s+/);
    const head = dashSplit[0].trim();
    if (dashSplit.length > 1) {
      const tailRaw = dashSplit.slice(1).join(" — ");
      const tail = capitalize(stripDescriptiveParen(tailRaw));
      return { tag: "FOROVER", kind: "forover", short: tail, formula: head };
    }
    // 4b) No explicit name — pattern-match the expression
    const inner = head.match(/^P\s*\(([^)]+)\)/)?.[1].trim() ?? "";
    const formula = head;
    if (/=\s*0\b/.test(inner)) {
      return { tag: "FOROVER", kind: "forover", short: "Ingen", formula };
    }
    if (/<.*<|≤.*≤/.test(inner)) {
      return { tag: "FOROVER", kind: "forover", short: "Intervall", formula };
    }
    if (/[≤<]\s*[a-zA-ZμσXTtxk0-9]+\s*$/.test(inner) && !/[<≤]\s*[a-zA-ZμσXTtxk0-9]+\s*[<≤]/.test(inner)) {
      // Single < or ≤ — but distinguish strict vs cumulative
      if (/X\s*≤/.test(inner) || /T\s*≤/.test(inner)) {
        return { tag: "FOROVER", kind: "forover", short: "Maks k", formula };
      }
      return { tag: "FOROVER", kind: "forover", short: "Mindre enn", formula };
    }
    if (/[>≥]/.test(inner)) {
      if (/X\s*≥/.test(inner) || /T\s*≥/.test(inner)) {
        return { tag: "FOROVER", kind: "forover", short: "Minst k", formula };
      }
      return { tag: "FOROVER", kind: "forover", short: "Større enn", formula };
    }
    if (/=/.test(inner)) {
      return { tag: "FOROVER", kind: "forover", short: "Eksakt k", formula };
    }
    return { tag: "FOROVER", kind: "forover", short: head, formula };
  }

  // 5) Sum-uavhengige-normaler shapes
  const sumLike = trimmed.match(/^(Sum|Differanse|Lineær kombinasjon)\s+(.+)$/i);
  if (sumLike) {
    const head = sumLike[1];
    return {
      tag: null,
      kind: "neutral",
      short: head === "Lineær kombinasjon" ? "Lineær" : capitalize(head.toLowerCase()),
      formula: sumLike[2].trim(),
    };
  }

  // 6) total-sannsynlighet variants
  if (/^Forover\b/i.test(trimmed)) return { tag: "FOROVER", kind: "forover", short: "Forover", formula: trimmed };
  if (/^Bakover\b/i.test(trimmed)) return { tag: "INVERS", kind: "invers", short: "Bakover", formula: trimmed };

  // 7) Memoryless and similar "Single-word (descriptive paren)" patterns
  const wordParen = trimmed.match(/^([A-Za-zæøåÆØÅ][\wæøåÆØÅ-]+)\s*\([^)]+\)\s*$/);
  if (wordParen) {
    return { tag: null, kind: "neutral", short: capitalize(wordParen[1]), formula: undefined };
  }

  // 8) komplementregelen-style names
  const compactMap: Record<string, string> = {
    "Minst k": "Minst k",
    "Ingen / null": "Ingen",
    "Ikke alle": "Ikke alle",
  };
  if (compactMap[trimmed]) {
    return { tag: null, kind: "neutral", short: compactMap[trimmed] };
  }

  // 9) Long descriptive phrases — chop at first " — " or " (" and capitalize
  const cleaned = stripDescriptiveParen(trimmed.split(/\s+[—–]\s+/)[0]);
  return { tag: null, kind: "neutral", short: cleaned };
}
