#!/usr/bin/env python3
"""Remove redundant `- label: "Resultat"` sub-blocks from `sections:` arrays
in entry YAML files. Some sub-agents wrote a section labeled "Resultat" inside
sections AND also populated the top-level `result:` field, which made the
final answer render twice on the entry page.

Strategy: line-based deletion. Identify each `- label: "Resultat"` line at
exactly 10-space indent (the level used inside `sections:`), then drop lines
until the indent returns to ≤10 spaces. Idempotent — running twice is safe.
"""
from __future__ import annotations
import glob
import io
import re
import sys

LABEL_LINE = re.compile(r'^( {10})- label: ["\']?Resultat["\']?\s*$')

def strip_file(path: str) -> int:
    """Returns number of Resultat sub-blocks removed."""
    with io.open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    out: list[str] = []
    i = 0
    removed = 0
    while i < len(lines):
        m = LABEL_LINE.match(lines[i])
        if not m:
            out.append(lines[i])
            i += 1
            continue
        # Found a "- label: 'Resultat'" at the section level.
        # Drop this line and all following lines whose indent is > 10 spaces
        # (i.e. belong to this section's body).
        i += 1
        while i < len(lines):
            ln = lines[i]
            stripped = ln.lstrip(" ")
            indent = len(ln) - len(stripped)
            if stripped == "" or stripped == "\n":
                # Blank line — keep it associated with the deleted block
                i += 1
                continue
            if indent > 10:
                i += 1
                continue
            break
        removed += 1

    if removed:
        with io.open(path, "w", encoding="utf-8", newline="") as f:
            f.writelines(out)
    return removed


def main():
    paths = sorted(glob.glob("content/entries/*.yaml"))
    total = 0
    for p in paths:
        n = strip_file(p)
        if n:
            print(f"{p}: removed {n} Resultat sub-block(s)")
            total += n
    print(f"\nTotal: {total} sub-blocks removed across {sum(1 for p in paths if strip_file(p) == 0 and ('content' in p))} files (already idempotent on second run).")
    print("Verifying YAML still parses…")
    try:
        import yaml
    except ImportError:
        print("(skipped — pyyaml not on path)")
        return 0
    for p in paths:
        try:
            with io.open(p, "r", encoding="utf-8") as f:
                yaml.safe_load(f)
        except Exception as e:
            print(f"PARSE FAIL: {p}: {e}", file=sys.stderr)
            return 1
    print("All entry YAMLs parse cleanly.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
