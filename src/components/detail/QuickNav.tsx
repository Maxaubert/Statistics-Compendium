import { clsx } from "clsx";
import { useEffect, useState } from "react";

export interface QuickNavItem {
  /** DOM id to scroll into view. */
  id: string;
  /** Short label shown in the rail. */
  label: string;
}

interface Props {
  items: QuickNavItem[];
}

/**
 * Right-rail jump nav for entry pages. Fixed to the viewport so it
 * stays visible while the article scrolls. Each item scrolls its
 * target into view; the currently-visible section is highlighted via
 * an IntersectionObserver that tracks which anchor crossed the top of
 * the viewport last.
 *
 * Hidden on viewports narrower than xl: there's no room next to the
 * article (article is centered at max-w-[920px] and the rail anchors
 * to its right edge).
 */
export function QuickNav({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  // Track which section is the "current" one by observing each target.
  // We pick whichever one has its top closest-to-but-above the upper
  // third of the viewport — close to how users naturally read.
  useEffect(() => {
    if (items.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Of the targets currently intersecting the trigger band,
        // pick the one nearest the top.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      // Trigger band: top 40 % of the viewport. A section is "active"
      // while its top sits in that band.
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside
      aria-label="Hurtignavigasjon"
      className="pointer-events-none fixed top-24 z-10 hidden xl:block"
      style={{ left: "calc(50% + 480px)" }}
    >
      <nav className="pointer-events-auto flex w-44 flex-col gap-0.5 border-l border-line pl-3">
        <div className="mb-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          På denne siden
        </div>
        {items.map((it) => {
          const isActive = it.id === activeId;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => {
                const el = document.getElementById(it.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={clsx(
                "rounded px-2 py-1 text-left font-serif text-[13px] transition-colors",
                isActive
                  ? "bg-primary-soft font-semibold text-primary-2"
                  : "text-ink-3 hover:text-primary-2",
              )}
            >
              {it.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
