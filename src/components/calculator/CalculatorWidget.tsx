import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { Calculator as CalcIcon, X, GripVertical } from "lucide-react";
import { ScientificCalculator } from "./ScientificCalculator";

const STORAGE_OPEN = "calc-widget-open";
const STORAGE_POS = "calc-widget-position";

const PANEL_WIDTH = 360;

interface Position {
  // Distance from the right and bottom edges. We anchor to right/bottom
  // (rather than left/top) so the widget sticks to its corner when the
  // window resizes.
  right: number;
  bottom: number;
}

const DEFAULT_POSITION: Position = { right: 20, bottom: 20 };

function loadPosition(): Position {
  if (typeof window === "undefined") return DEFAULT_POSITION;
  try {
    const raw = window.localStorage.getItem(STORAGE_POS);
    if (!raw) return DEFAULT_POSITION;
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
  return DEFAULT_POSITION;
}

function clampPosition(pos: Position): Position {
  if (typeof window === "undefined") return pos;
  // Keep the widget at least partially on-screen so a resize can't
  // strand it off the viewport. Reserve enough margin that the
  // calc button stays visible (roughly its own width + a few px).
  const margin = 10;
  const maxRight = Math.max(margin, window.innerWidth - 60);
  const maxBottom = Math.max(margin, window.innerHeight - 60);
  return {
    right: Math.min(maxRight, Math.max(margin, pos.right)),
    bottom: Math.min(maxBottom, Math.max(margin, pos.bottom)),
  };
}

/**
 * Floating calculator widget pinned to a corner of the viewport.
 * Closed it shows a small button with a calculator glyph; click to
 * open a panel that holds the full ScientificCalculator (mathjs,
 * keypad, history). The panel is mounted at the App root so it
 * appears above all routes.
 *
 * Persistence (all via localStorage):
 *  - open/closed state survives navigation and reload
 *  - the active expression and history survive close-and-reopen
 *  - the dragged position sticks across sessions
 *
 * Drag handle: header bar (and the closed button itself) accept
 * pointer drags. Clicks shorter than 4px translation are treated
 * as taps so the user can still toggle by clicking the button.
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
  const [position, setPosition] = useState<Position>(() => clampPosition(loadPosition()));
  const dragRef = useRef<{
    startRight: number;
    startBottom: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  // Persist open and position
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_OPEN, open ? "1" : "0");
    } catch {
      // ignore
    }
  }, [open]);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_POS, JSON.stringify(position));
    } catch {
      // ignore
    }
  }, [position]);

  // ESC closes the panel
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reclamp position on viewport resize so the widget never strands
  // itself off-screen if the user shrinks the window.
  useEffect(() => {
    function onResize() {
      setPosition((p) => clampPosition(p));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onDragPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Only react to primary button (left click / single touch).
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      dragRef.current = {
        startRight: position.right,
        startBottom: position.bottom,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };
    },
    [position],
  );

  const onDragPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) > 4) {
        drag.moved = true;
      }
      if (drag.moved) {
        // Right grows leftward, bottom grows upward, so the deltas flip.
        const nextPos = clampPosition({
          right: drag.startRight - dx,
          bottom: drag.startBottom - dy,
        });
        setPosition(nextPos);
      }
    },
    [],
  );

  const onDragPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      const target = e.currentTarget;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
      dragRef.current = null;
      // If the pointer barely moved, treat as a click (toggle open).
      // The wrapper button handles the actual toggle via onClick, but
      // we have to suppress that click when a drag did happen so the
      // user doesn't toggle after dragging.
      if (drag && drag.moved) {
        // Block the synthetic click that follows pointerup on some browsers.
        const block = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
          window.removeEventListener("click", block, true);
        };
        window.addEventListener("click", block, true);
      }
    },
    [],
  );

  return (
    <div
      className="fixed z-40 flex flex-col items-end gap-3"
      style={{
        right: `${position.right}px`,
        bottom: `${position.bottom}px`,
      }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Kalkulator"
          className={clsx(
            "rounded-xl border border-line bg-card",
            "shadow-2xl shadow-primary/15",
            "animate-[calc-pop_180ms_ease-out]",
          )}
          style={{ width: `${PANEL_WIDTH}px`, maxWidth: "calc(100vw - 40px)" }}
        >
          <header
            onPointerDown={onDragPointerDown}
            onPointerMove={onDragPointerMove}
            onPointerUp={onDragPointerUp}
            onPointerCancel={onDragPointerUp}
            className={clsx(
              "flex select-none items-center justify-between border-b border-line px-4 py-3",
              "cursor-grab active:cursor-grabbing touch-none",
            )}
            title="Dra for å flytte"
          >
            <div className="flex items-center gap-2">
              <GripVertical size={14} className="text-ink-4" aria-hidden />
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

      {/* Closed state: floating button. Also draggable. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          onPointerDown={onDragPointerDown}
          onPointerMove={onDragPointerMove}
          onPointerUp={onDragPointerUp}
          onPointerCancel={onDragPointerUp}
          aria-label="Åpne kalkulator"
          aria-expanded={false}
          className={clsx(
            "flex h-12 w-12 select-none items-center justify-center rounded-full transition-all",
            "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
            "border border-primary-2/20 bg-primary-2 text-white hover:bg-primary-3",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
            "cursor-grab active:cursor-grabbing touch-none",
          )}
          title="Åpne kalkulator (dra for å flytte)"
        >
          <CalcIcon size={20} />
        </button>
      )}
    </div>
  );
}
