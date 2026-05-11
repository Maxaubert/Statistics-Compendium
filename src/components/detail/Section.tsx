import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

interface Props {
  title: string;
  icon?: ComponentType<LucideProps>;
  children: ReactNode;
  /** Optional anchor id, used by the right-rail QuickNav to scroll here. */
  id?: string;
}

export function Section({ title, icon: Icon, children, id }: Props) {
  return (
    <section id={id} className="mb-9 scroll-mt-6">
      <h2 className="mb-3.5 flex items-center gap-2 border-b border-line pb-2 font-serif text-[13px] font-semibold uppercase tracking-widest text-ink-3">
        {Icon && <Icon size={14} className="text-primary-2" />}
        {title}
      </h2>
      {children}
    </section>
  );
}
