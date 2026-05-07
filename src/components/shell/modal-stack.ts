/**
 * Module-scoped modal stack registry. Lets stacked modals coordinate
 * which one owns the backdrop tint so the layers don't multiply when
 * a popup opens on top of another popup.
 *
 * Each Modal pushes a unique id on mount and pops it on unmount.
 * Only the modal at the top of the stack renders the dark backdrop;
 * everyone underneath skips it. The stack is observable through
 * `subscribe` so all mounted modals re-render when the top changes.
 */

let stack: number[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function notify() {
  for (const cb of listeners) cb();
}

export function pushModal(): number {
  const id = nextId++;
  stack = [...stack, id];
  notify();
  return id;
}

export function popModal(id: number): void {
  stack = stack.filter((x) => x !== id);
  notify();
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getStack(): readonly number[] {
  return stack;
}

export function isTopOfStack(id: number): boolean {
  return stack[stack.length - 1] === id;
}
