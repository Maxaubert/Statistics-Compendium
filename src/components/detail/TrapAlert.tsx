import { AlertCircle } from "lucide-react";
import { Prose } from "./Prose";
import type { GlossaryTerm } from "@/data/schema";

interface Props {
  body: string;
  glossary?: GlossaryTerm[];
}

export function TrapAlert({ body, glossary }: Props) {
  return (
    <div className="rounded-lg border border-yellow-300 border-l-4 border-l-yellow-600 bg-yellow-100 px-5 py-3.5 text-yellow-900">
      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-yellow-800">
        <AlertCircle size={12} />
        Pass på
      </div>
      <Prose
        body={body}
        glossary={glossary}
        paragraphClass="m-0 font-serif text-[14.5px] leading-snug text-yellow-900"
        listItemClass="font-serif text-[14.5px] leading-snug text-yellow-900"
      />
    </div>
  );
}
