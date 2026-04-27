import { Math } from "@/components/primitives/Math";

export function HeroFormula({ latex }: { latex: string }) {
  return (
    <div
      className="relative mb-9 overflow-hidden rounded-xl px-6 py-9 text-center text-white"
      style={{
        background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute -bottom-14 -left-14 h-[200px] w-[200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)",
        }}
      />
      <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-amber-100/70">
        Hovedformel
      </div>
      <div className="relative z-10 text-[28px]">
        <Math latex={latex} display />
      </div>
    </div>
  );
}
