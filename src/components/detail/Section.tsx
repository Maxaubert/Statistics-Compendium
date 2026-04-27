import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

interface Props {
  title: string;
  icon?: ComponentType<LucideProps>;
  children: ReactNode;
}

export function Section({ title, icon: Icon, children }: Props) {
  return (
    <section className="mb-9">
      <h2 className="mb-3.5 flex items-center gap-2 border-b border-line pb-2 font-serif text-[13px] font-semibold uppercase tracking-widest text-ink-3">
        {Icon && <Icon size={14} className="text-primary-2" />}
        {title}
      </h2>
      {children}
    </section>
  );
}
