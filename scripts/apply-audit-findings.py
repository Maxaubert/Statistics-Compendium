"""Apply audit findings to glossary/entry yaml files.

Reads all audit reports in audit-findings/, builds an aggregated map of
{ id -> { dim -> set(values) } } of missing tags, then merges them into the
target yaml files' filters block.

Skips over-broad recommendations as instructed by the synthesis brief.
"""
import os
import sys
import re
from pathlib import Path
from collections import defaultdict

# Use ruamel-style preservation if available, else fall back to PyYAML round-trip
import yaml

ROOT = Path(__file__).resolve().parent.parent
AUDIT_DIR = ROOT / "audit-findings"
GLOSSARY_DIR = ROOT / "content" / "glossary"
ENTRIES_DIR = ROOT / "content" / "entries"

# === Skip rules (over-broad per synthesis brief) ===
PURE_MATH_GLOSS_NO_SETUP = {
    "komplement", "hendelse", "partisjon", "joint",
    "de-morgans-lov", "disjunkte-hendelser-glos", "betinget-sannsynlighet-glos",
}

# Filter-coverage validation: load filters.yaml to get valid keys per dim
def load_valid_filter_values():
    fp = ROOT / "content" / "filters.yaml"
    with open(fp, encoding="utf-8") as f:
        data = yaml.safe_load(f)
    out = {}
    for dim in data["dimensions"]:
        out[dim["key"]] = {opt["key"] for opt in dim["options"]}
    return out


def parse_missing_tags(missing):
    """Normalize missing_tags into list of (dim, value) tuples.

    Three possible formats:
    1. list of {dim, value} dicts        (chunks 1, 5)
    2. dict { dim: [values] }            (chunk 2)
    3. list of strings 'dim.value'       (chunk 3)
    Plus chunk 5 uses {dimension, missing: [values]}
    """
    out = []
    if missing is None:
        return out
    if isinstance(missing, list):
        for item in missing:
            if isinstance(item, str):
                # 'dim.value' format
                if "." in item:
                    dim, val = item.split(".", 1)
                    out.append((dim, val))
            elif isinstance(item, dict):
                if "dim" in item and "value" in item:
                    out.append((item["dim"], item["value"]))
                elif "dimension" in item and "missing" in item:
                    for v in item["missing"]:
                        out.append((item["dimension"], v))
                else:
                    # treat as dim->list mapping
                    for dim, vals in item.items():
                        if dim in {"note", "notes"}:
                            continue
                        if isinstance(vals, list):
                            for v in vals:
                                out.append((dim, v))
                        elif isinstance(vals, str):
                            out.append((dim, vals))
    elif isinstance(missing, dict):
        for dim, vals in missing.items():
            if isinstance(vals, list):
                for v in vals:
                    out.append((dim, v))
            elif isinstance(vals, str):
                out.append((dim, vals))
    return out


def aggregate_findings(audit_files):
    """Returns { chunk_name: { id: {type, additions: { dim: set(values) } } } } """
    valid = load_valid_filter_values()
    chunks = {}
    for fname in audit_files:
        chunk_id = fname.stem
        with open(fname, encoding="utf-8") as f:
            data = yaml.safe_load(f)
        items = data.get("items", [])
        chunk_map = {}
        for item in items:
            iid = item["id"]
            itype = item["type"]
            additions = defaultdict(set)
            for ctx in item.get("contexts", []):
                for dim, val in parse_missing_tags(ctx.get("missing_tags")):
                    # Validate: must be valid filter dim and value
                    if dim not in valid:
                        print(f"  WARN: unknown dim '{dim}' in {iid} (ctx)", file=sys.stderr)
                        continue
                    if val not in valid[dim]:
                        print(f"  WARN: unknown value '{val}' in dim '{dim}' for {iid}", file=sys.stderr)
                        continue
                    additions[dim].add(val)
            if additions:
                chunk_map[iid] = {"type": itype, "additions": dict(additions)}
        chunks[chunk_id] = chunk_map
    return chunks


def apply_skip_rules(iid, additions):
    """Drop over-broad recommendations.

    1. setup: [single_population] for pure-math glossary terms.
    2. tooling: [calculator_only] additions everywhere (not a real exam need).
    """
    skipped = []
    if iid in PURE_MATH_GLOSS_NO_SETUP and "setup" in additions:
        if "single_population" in additions["setup"]:
            additions["setup"].discard("single_population")
            skipped.append((iid, "setup", "single_population", "pure math gloss"))
            if not additions["setup"]:
                del additions["setup"]
    if "tooling" in additions and "calculator_only" in additions["tooling"]:
        additions["tooling"].discard("calculator_only")
        skipped.append((iid, "tooling", "calculator_only", "calculator_only over-broad"))
        if not additions["tooling"]:
            del additions["tooling"]
    return skipped


# Define the canonical ordering for filter dimension keys (per filters.yaml)
DIM_ORDER = [
    "computes", "random_variable", "setup", "structural_cues",
    "parameters_known", "distribution_assumption", "tooling",
]


def merge_filters_in_yaml(filepath, additions):
    """Merge additions into the file's filters block.

    Preserves existing key ordering. Appends new values to existing arrays.
    Returns (n_added, list of (dim, value) added).
    """
    text = filepath.read_text(encoding="utf-8")
    # parse with safe_load to inspect
    data = yaml.safe_load(text)
    existing_filters = data.get("filters", {}) or {}
    added = []
    new_filters = dict(existing_filters)  # copy
    for dim, vals in additions.items():
        existing_vals = list(new_filters.get(dim, []) or [])
        for v in vals:
            if v not in existing_vals:
                existing_vals.append(v)
                added.append((dim, v))
        new_filters[dim] = existing_vals
    if not added:
        return 0, []

    # Now we need to write back, preserving ordering.
    # Strategy: rewrite the filters: block textually.
    # Find the filters: block, capture the full block, and replace.
    new_block_lines = ["filters:"]
    # Order: existing dims in their existing order, then new ones in DIM_ORDER not yet present.
    existing_dim_order = list(existing_filters.keys())
    final_dim_order = list(existing_dim_order)
    for d in DIM_ORDER:
        if d not in final_dim_order and d in new_filters:
            final_dim_order.append(d)
    # Also include any other dims (shouldn't happen but defensive)
    for d in new_filters:
        if d not in final_dim_order:
            final_dim_order.append(d)

    for dim in final_dim_order:
        vals = new_filters.get(dim, [])
        if vals:
            # Use flow-style list to match original style
            inner = ", ".join(vals)
            new_block_lines.append(f"  {dim}: [{inner}]")
        else:
            new_block_lines.append(f"  {dim}: []")
    new_block = "\n".join(new_block_lines)

    # Replace the filters: block in text.
    # The block starts at a top-level 'filters:' line and ends at the next top-level key
    # (i.e., a non-indented line that is not blank/comment) or EOF.
    lines = text.splitlines(keepends=False)
    start = None
    end = None
    for i, ln in enumerate(lines):
        if start is None and re.match(r"^filters:\s*(#.*)?$", ln):
            start = i
            continue
        if start is not None and i > start:
            # End when we hit a non-indented, non-blank, non-comment line
            if ln and not ln.startswith(" ") and not ln.startswith("\t") and not ln.lstrip().startswith("#"):
                end = i
                break
    if start is None:
        print(f"  ERROR: no 'filters:' block found in {filepath}", file=sys.stderr)
        return 0, []
    if end is None:
        end = len(lines)

    new_lines = lines[:start] + new_block.split("\n") + lines[end:]
    new_text = "\n".join(new_lines)
    if not new_text.endswith("\n"):
        new_text += "\n"
    filepath.write_text(new_text, encoding="utf-8")
    return len(added), added


def find_target_file(iid, itype):
    if itype == "glossary":
        p = GLOSSARY_DIR / f"{iid}.yaml"
    elif itype == "entry":
        p = ENTRIES_DIR / f"{iid}.yaml"
    else:
        return None
    if p.exists():
        return p
    return None


def apply_chunk(chunk_name, chunk_map):
    """Apply a single chunk's additions, returns (n_items_modified, n_tags_added, skipped)."""
    n_items = 0
    n_tags = 0
    skipped_log = []
    for iid, info in chunk_map.items():
        additions = {dim: set(vals) for dim, vals in info["additions"].items()}
        skipped = apply_skip_rules(iid, additions)
        skipped_log.extend(skipped)
        if not additions:
            continue
        target = find_target_file(iid, info["type"])
        if not target:
            print(f"  ERROR: missing file for {iid} ({info['type']})", file=sys.stderr)
            continue
        n_added, added = merge_filters_in_yaml(target, additions)
        if n_added:
            n_items += 1
            n_tags += n_added
            print(f"  + {iid}: added {n_added} tags: {added}")
    return n_items, n_tags, skipped_log


def main():
    chunk_files = sorted(AUDIT_DIR.glob("*.yaml"))
    chunks_data = aggregate_findings(chunk_files)
    chunk_arg = sys.argv[1] if len(sys.argv) > 1 else None
    summary = {}
    for cname, cmap in chunks_data.items():
        if chunk_arg and chunk_arg not in cname:
            continue
        print(f"\n=== Applying {cname} ===")
        n_items, n_tags, skipped = apply_chunk(cname, cmap)
        summary[cname] = (n_items, n_tags, skipped)
    print("\n=== Summary ===")
    for cname, (n_items, n_tags, skipped) in summary.items():
        print(f"  {cname}: {n_items} items, {n_tags} tags added, {len(skipped)} skipped")
        for s in skipped:
            print(f"    SKIPPED {s[0]} {s[1]}: {s[2]} ({s[3]})")


if __name__ == "__main__":
    main()
