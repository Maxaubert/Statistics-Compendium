import { BookOpen } from "lucide-react";

interface Props {
  source: string;
  excerpt: string;
  solutionSketch: string;
}

export function ExampleCard({ source, excerpt, solutionSketch }: Props) {
  return (
    <div className="mb-3 rounded-lg border border-line border-l-4 border-l-primary-2 bg-card px-5 py-4">
      <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
        <BookOpen size={11} className="text-primary-2" />
        {source}
      </div>
      <p className="my-2 font-serif text-[14.5px] italic leading-snug text-ink-2 before:text-ink-4 before:content-['«_'] after:text-ink-4 after:content-['_»']">
        {excerpt}
      </p>
      <div className="rounded-md bg-paper-2 px-3.5 py-2.5 font-math text-[14px] leading-relaxed text-ink">
        {solutionSketch}
      </div>
    </div>
  );
}
