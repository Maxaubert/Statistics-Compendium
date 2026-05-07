import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";
import {
  pushModal,
  popModal,
  subscribe as subscribeModalStack,
  getStack,
  isTopOfStack,
  closeAllModals,
} from "./modal-stack";

/** Keep in sync with the longest CSS transition duration on the modal panel. */
const CLOSE_ANIM_MS = 180;

interface Props {
  ariaLabel: string;
  /** Called after the close animation finishes. */
  onClose: () => void;
  children: React.ReactNode;
  /** Max width of the panel. Default 640px. */
  maxWidth?: string;
}

/**
 * Shared dark-calc-card modal shell. Handles:
 *  - Fixed overlay + blurred dark backdrop
 *  - Open/close enter/exit animations (fade + scale)
 *  - ESC key, backdrop click, and X button to close
 *  - Body scroll lock while open
 *
 * Children render inside the dark navy panel. The panel uses the same
 * gradient/border tokens as the detailed-solution cards, so popups
 * read as part of the same calc-card family.
 */
export function Modal({ ariaLabel, onClose, children, maxWidth = "640px" }: Props) {
  // `open` drives the visible state for the enter/exit transitions.
  // It starts false so the panel mounts in its hidden state, then we
  // flip to true on the next animation frame to trigger the enter
  // transition. On close, we flip back to false and call the parent's
  // onClose only after the transition has finished, so the exit
  // animation gets a chance to play before unmount.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const requestClose = useCallback(() => {
    setOpen(false);
    window.setTimeout(onClose, CLOSE_ANIM_MS);
  }, [onClose]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") requestClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Each Modal registers itself in the global modal stack so:
  //  1. only the topmost modal renders the dark backdrop tint
  //  2. backdrop click can close ALL stacked popups (formula -> ordliste
  //     -> ordliste collapses with one click outside)
  // Use a ref to hand pushModal a stable function that always invokes
  // the current requestClose, even though useCallback recreates it
  // when onClose changes between renders.
  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  const [myId, setMyId] = useState<number | null>(null);
  useEffect(() => {
    const id = pushModal(() => requestCloseRef.current());
    setMyId(id);
    return () => {
      popModal(id);
    };
  }, []);
  // Re-render whenever the modal stack changes so isTop stays accurate.
  useSyncExternalStore(subscribeModalStack, getStack);
  const isTop = myId !== null && isTopOfStack(myId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {isTop ? (
        <button
          type="button"
          aria-label="Lukk"
          onClick={closeAllModals}
          className={clsx(
            "absolute inset-0 cursor-default bg-black/85 backdrop-blur-lg transition-opacity duration-200 ease-out",
            open ? "opacity-100" : "opacity-0",
          )}
        />
      ) : (
        // Keep a transparent overlay so clicks outside the inner panel
        // still pass through to nothing (don't accidentally hit the
        // popup behind us). The actual dark/blurred backdrop lives on
        // the topmost modal.
        <div aria-hidden className="absolute inset-0" />
      )}
      <div
        className={clsx(
          "relative max-h-full w-full overflow-y-auto rounded-xl border shadow-2xl transition-[opacity,transform] duration-200 ease-out",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
        style={{
          maxWidth,
          background:
            "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
          borderColor: "var(--color-calc-border)",
          color: "var(--color-calc-text)",
        }}
      >
        <button
          type="button"
          aria-label="Lukk"
          onClick={requestClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
