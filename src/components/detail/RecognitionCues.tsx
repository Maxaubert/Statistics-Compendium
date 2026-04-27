import { clsx } from "clsx";

interface Props {
  cues: string[];
  variant?: "positive" | "warn";
}

export function RecognitionCues({ cues, variant = "positive" }: Props) {
  const isWarn = variant === "warn";
  return (
    <ul className={clsx("m-0 grid list-none gap-2 p-0", isWarn && "warn")}>
      {cues.map((cue, i) => (
        <li
          key={i}
          className={clsx(
            "relative rounded-lg py-2.5 pl-9 pr-3.5 font-serif text-[14px] leading-snug",
            isWarn
              ? "border-l-[3px] border-warn bg-warn-soft text-amber-900"
              : "border-l-[3px] border-primary-2 bg-paper-2 text-ink-2"
          )}
        >
          <span
            aria-hidden
            className={clsx(
              "absolute left-3 top-3 inline-block h-4 w-4 rounded-full",
              isWarn
                ? "bg-warn shadow-[inset_0_0_0_2px_var(--color-warn-soft)]"
                : "bg-primary-2 shadow-[inset_0_0_0_2px_white]"
            )}
          />
          {cue}
        </li>
      ))}
    </ul>
  );
}
