import { useState } from "react";
import { ClipboardList, FileText } from "lucide-react";
import { StepByStep } from "./StepByStep";

interface Props {
  steps: string[];
}

export function TemplateMode({ steps }: Props) {
  const [mode, setMode] = useState<"prose" | "fillin">("prose");
  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("prose")}
          className={`rounded-md border px-3 py-1 text-[12px] ${mode === "prose" ? "border-primary-2 bg-primary-soft text-primary" : "border-line text-ink-3"}`}
        >
          <ClipboardList size={12} className="mr-1 inline-block" />
          Prosa
        </button>
        <button
          type="button"
          onClick={() => setMode("fillin")}
          className={`rounded-md border px-3 py-1 text-[12px] ${mode === "fillin" ? "border-primary-2 bg-primary-soft text-primary" : "border-line text-ink-3"}`}
        >
          <FileText size={12} className="mr-1 inline-block" />
          Mal-modus (fyll inn)
        </button>
      </div>
      {mode === "prose" ? (
        <StepByStep steps={steps} />
      ) : (
        <ol className="m-0 list-none space-y-3 p-0">
          {steps.map((s, i) => (
            <li
              key={i}
              className="rounded-lg border border-line bg-paper-2 px-4 py-3 print:border-ink"
            >
              <div className="font-mono text-[11px] font-semibold text-primary-2">
                STEG {i + 1}
              </div>
              <div className="mt-1 text-[14px] text-ink">{s}</div>
              <div className="mt-3 h-12 rounded border border-dashed border-line-2 print:h-16">
                <span className="sr-only">Fyll inn ditt svar her</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
