/**
 * Module-scoped modal stack registry. Lets stacked modals coordinate
 * two things:
 *
 *  1. Which modal owns the dark backdrop tint, so the layers don't
 *     multiply when a popup opens on top of another popup.
 *  2. A single 'close all' that clicking the backdrop fires, so the
 *     user always exits every open popup with one click outside,
 *     regardless of how the stack was built (formula -> ordliste ->
 *     ordliste, or just ordliste, or just formula).
 *
 * Each Modal pushes a unique id + its own requestClose on mount and
 * pops on unmount. The stack is observable through `subscribe` so all
 * mounted modals re-render when the top changes.
 */

interface ModalEntry {
  id: number;
  requestClose: () => void;
}

let stack: ModalEntry[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function notify() {
  for (const cb of listeners) cb();
}

export function pushModal(requestClose: () => void): number {
  const id = nextId++;
  stack = [...stack, { id, requestClose }];
  notify();
  return id;
}

export function popModal(id: number): void {
  stack = stack.filter((x) => x.id !== id);
  notify();
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getStack(): readonly ModalEntry[] {
  return stack;
}

export function isTopOfStack(id: number): boolean {
  return stack[stack.length - 1]?.id === id;
}

/**
 * Fire requestClose on every currently-mounted modal. Capturing the
 * functions before iterating keeps us safe from the stack mutating
 * mid-loop (each close eventually triggers a popModal during unmount).
 */
export function closeAllModals(): void {
  const closes = stack.map((m) => m.requestClose);
  for (const c of closes) c();
}
