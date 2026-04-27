import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import type { Entry } from "@/data/schema";

const TYPE_LABEL: Record<Entry["type"], string> = {
  distribution: "distribusjon",
  test: "hypotesetest",
  regression: "regresjon",
  identity: "identitet",
  rule: "regel",
  combinatorics: "kombinatorikk",
};

const TYPE_BADGE_CLASS: Record<Entry["type"], string> = {
  distribution: "bg-indigo-100 text-indigo-800",
  test: "bg-pink-100 text-pink-800",
  regression: "bg-emerald-100 text-emerald-800",
  identity: "bg-stone-100 text-stone-700",
  rule: "bg-stone-100 text-stone-700",
  combinatorics: "bg-violet-100 text-violet-800",
};

interface Props {
  entries: Entry[];
  onRowClick: (id: string) => void;
}

export function EntryTable({ entries, onRowClick }: Props) {
  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-ink-3">
        Ingen treff. Prøv å fjerne et filter eller endre søket.
      </p>
    );
  }
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr>
          <th className="border-b border-line-2 py-2 px-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-3">
            Navn
          </th>
          <th className="border-b border-line-2 py-2 px-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-3">
            Type
          </th>
          <th className="border-b border-line-2 py-2 px-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-3">
            Beregner
          </th>
          <th className="border-b border-line-2 py-2 px-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-3">
            Kjennetegn
          </th>
          <th className="w-8 border-b border-line-2"></th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr
            key={e.id}
            onClick={() => onRowClick(e.id)}
            className="cursor-pointer border-b border-line transition-colors hover:bg-paper-2"
          >
            <td className="px-2.5 py-3 align-middle font-serif text-sm font-semibold text-ink">
              {e.name_no}
            </td>
            <td className="px-2.5 py-3 align-middle">
              <span
                className={clsx(
                  "inline-block rounded-xl px-2.5 py-0.5 text-[11px] font-medium",
                  TYPE_BADGE_CLASS[e.type]
                )}
              >
                {TYPE_LABEL[e.type]}
              </span>
            </td>
            <td className="px-2.5 py-3 align-middle font-math text-sm text-ink-2">
              {e.formula_main}
            </td>
            <td className="px-2.5 py-3 align-middle text-[12.5px] leading-snug text-ink-3">
              {e.recognition_cues.slice(0, 1).join(" · ")}
            </td>
            <td className="px-2.5 py-3 align-middle">
              <ArrowRight size={16} className="text-ink-4" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
