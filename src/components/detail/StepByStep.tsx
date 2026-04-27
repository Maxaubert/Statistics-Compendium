export function StepByStep({ steps }: { steps: string[] }) {
  return (
    <ol className="m-0 list-none p-0 [counter-reset:step]">
      {steps.map((step, i) => (
        <li
          key={i}
          className="relative mb-2 rounded-lg border border-line bg-card py-3 pl-12 pr-4 font-serif text-[14.5px] leading-relaxed text-ink-2 [counter-increment:step] before:absolute before:left-3.5 before:top-3 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:bg-primary-2 before:font-mono before:text-[12px] before:font-semibold before:text-white before:content-[counter(step)]"
        >
          {step}
        </li>
      ))}
    </ol>
  );
}
