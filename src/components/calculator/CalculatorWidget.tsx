import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Calculator as CalcIcon, X } from "lucide-react";
import { ScientificCalculator } from "./ScientificCalculator";

const STORAGE_OPEN = "calc-widget-open";
const STORAGE_POS = "calc-widget-position";

const PANEL_WIDTH = 360;
const EDGE_MARGIN = 0;
const BUTTON_RIGHT = 20;
const BUTTON_BOTTOM = 20;

interface Position {
  // Distance from the right and bottom edges of the viewport. We anchor
  // the panel to right/bottom (rather than left/top) so it sticks to
  // its corner when the window resizes.
  right: number;
  bottom: number;
}

const DEFAULT_PANEL_POSITION: Position = { right: BUTTON_RIGHT, bottom: BUTTON_BOTTOM };

function loadPanelPosition(): Position {
  if (typeof window === "undefined") return DEFAULT_PANEL_POSITION;
  try {
    const raw = window.localStorage.getItem(STORAGE_POS);
    if (!raw) return DEFAULT_PANEL_POSITION;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.right === "number" &&
      typeof parsed.bottom === "number"
    ) {
      return parsed;
    }
  } catch {
    // fall through
  }
  return DEFAULT_PANEL_POSITION;
}

/**
 * Clamp the panel's right/bottom anchor so the panel can be dragged
 * all the way to (but not past) any viewport edge. The clamp uses
 * the panel's measured height when available so the user can pull
 * the panel's top edge flush against the viewport's top edge.
 */
function clampPanelPosition(pos: Position, panelHeight: number): Position {
  if (typeof window === "undefined") return pos;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxRight = Math.max(EDGE_MARGIN, vw - PANEL_WIDTH - EDGE_MARGIN);
  const maxBottom = Math.max(EDGE_MARGIN, vh - panelHeight - EDGE_MARGIN);
  return {
    right: Math.min(maxRight, Math.max(EDGE_MARGIN, pos.right)),
    bottom: Math.min(maxBottom, Math.max(EDGE_MARGIN, pos.bottom)),
  };
}

/**
 * Floating calculator widget.
 *
 * Layout rules:
 *  - The closed-state button is ALWAYS pinned to the bottom-right
 *    corner regardless of where the user dragged the open panel.
 *  - The open panel can be dragged via its header bar to any spot
 *    that keeps it fully on-screen. The dragged position is
 *    persisted in localStorage so the panel reappears in the same
 *    place next time it's opened.
 *  - Open/closed state is also persisted across page navigations.
 *  - Expression and history (in ScientificCalculator) survive
 *    close-and-reopen via their own localStorage keys.
 *
 * The widget is mounted at the App root so it overlays every page.
 */
export function CalculatorWidget() {
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_OPEN) === "1";
    } catch {
      return false;
    }
  });
  // Saved position; clamped lazily once we know the panel height.
  const [panelPos, setPanelPos] = useState<Position>(loadPanelPosition);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelHeightRef = useRef<number>(0);
  const dragRef = useRef<{
    startRight: number;
    startBottom: number;
    startX: number;
    startY: number;
  } | null>(null);

  // Measure the open panel and reclamp using the actual height. This
  // runs whenever the panel mounts or its size changes (e.g. as the
  // history list grows). ResizeObserver is the cheapest correct way
  // to keep the clamp in sync with the panel's real dimensions.
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    const update = () => {
      const h = el.offsetHeight;
      if (h && h !== panelHeightRef.current) {
        panelHeightRef.current = h;
        setPanelPos((p) => clampPanelPosition(p, h));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Persist open and panel position
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_OPEN, open ? "1" : "0");
    } catch {
      // ignore
    }
  }, [open]);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_POS, JSON.stringify(panelPos));
    } catch {
      // ignore
    }
  }, [panelPos]);

  // ESC closes the panel; Ctrl/Cmd+K toggles it.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      const isToggleHotkey =
        (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k";
      if (isToggleHotkey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reclamp panel position on viewport resize so the panel never
  // strands itself off-screen if the user shrinks the window.
  useEffect(() => {
    function onResize() {
      setPanelPos((p) => clampPanelPosition(p, panelHeightRef.current));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ---- Header drag handlers (open panel only) ----
  const onHeaderPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        startRight: panelPos.right,
        startBottom: panelPos.bottom,
        startX: e.clientX,
        startY: e.clientY,
      };
    },
    [panelPos],
  );

  const onHeaderPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      // right grows leftward, bottom grows upward, so deltas flip.
      const nextPos = clampPanelPosition(
        {
          right: drag.startRight - dx,
          bottom: drag.startBottom - dy,
        },
        panelHeightRef.current,
      );
      setPanelPos(nextPos);
    },
    [],
  );

  const onHeaderPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const target = e.currentTarget;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
      dragRef.current = null;
    },
    [],
  );

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Kalkulator"
          className={clsx(
            "fixed z-40 rounded-xl border border-line bg-card",
            "shadow-2xl shadow-primary/15",
            "animate-[calc-pop_180ms_ease-out]",
          )}
          style={{
            right: `${panelPos.right}px`,
            bottom: `${panelPos.bottom}px`,
            width: `${PANEL_WIDTH}px`,
            maxWidth: "calc(100vw - 40px)",
          }}
        >
          <header
            onPointerDown={onHeaderPointerDown}
            onPointerMove={onHeaderPointerMove}
            onPointerUp={onHeaderPointerUp}
            onPointerCancel={onHeaderPointerUp}
            className={clsx(
              "flex select-none items-center justify-between border-b border-line px-4 py-3",
              "cursor-grab active:cursor-grabbing touch-none",
            )}
            title="Dra for å flytte"
          >
            <div className="flex items-center gap-2">
              <CalcIcon size={16} className="text-primary-2" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-2">
                Kalkulator
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Lukk kalkulator"
              className="flex h-7 w-7 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <X size={16} />
            </button>
          </header>
          <div className="px-4 pb-4 pt-3">
            <ScientificCalculator />
          </div>
        </div>
      )}

      {/* Closed-state button is always pinned to the bottom-right
          corner; only the open panel inherits the dragged position. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Åpne kalkulator"
          aria-expanded={false}
          className={clsx(
            "fixed z-40 flex h-12 w-12 select-none items-center justify-center rounded-full transition-all",
            "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
            "border border-primary-2/20 bg-primary-2 text-white hover:bg-primary-3",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
          )}
          style={{ right: `${BUTTON_RIGHT}px`, bottom: `${BUTTON_BOTTOM}px` }}
          title="Åpne kalkulator (Ctrl/Cmd + K)"
        >
          <CalcIcon size={20} />
        </button>
      )}
    </>
  );
}
