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
  //
  // Edge case: the last section often sits near the bottom of the page
  // and there's no room to scroll it into the trigger band, so the
  // observer never reports it active. We layer a scroll listener that
  // detects "near page bottom" and forces the last item active in
  // that case.
  useEffect(() => {
    if (items.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    let atBottom = false;
    const checkBottom = () => {
      const remaining =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      atBottom = remaining < 24;
      if (atBottom) setActiveId(items[items.length - 1].id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // When the page is bottomed out, the bottom-detection above
        // owns the active state — don't let the observer fight it.
        if (atBottom) return;
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
    window.addEventListener("scroll", checkBottom, { passive: true });
    checkBottom();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkBottom);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside
      aria-label="Hurtignavigasjon"
      className="pointer-events-none fixed top-1/2 z-10 hidden -translate-y-1/2 xl:block"
      style={{ left: "calc(50% + 480px)" }}
    >
      <nav className="pointer-events-auto relative flex flex-col gap-12 pl-5">
        {/* Connecting vertical bar that runs from the centre of the first
            pill to the centre of the last, threading through the column. */}
        <div
          aria-hidden
          className="absolute left-[7px] top-3 bottom-3 w-px bg-line"
        />
        {items.map((it) => {
          const isActive = it.id === activeId;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => {
                const el = document.getElementById(it.id);
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={clsx(
                "relative rounded-full px-3.5 py-1.5 text-left font-serif text-[13px] transition-colors",
                isActive
                  ? "bg-primary-2 text-white"
                  : "text-ink-3 hover:text-ink",
              )}
            >
              {/* Node dot that sits on the connecting bar, aligned to the
                  vertical centre of the pill. */}
              <span
                aria-hidden
                className={clsx(
                  "absolute left-[-19px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ring-2 ring-paper transition-colors",
                  isActive ? "bg-primary-2" : "bg-line",
                )}
              />
              {it.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
