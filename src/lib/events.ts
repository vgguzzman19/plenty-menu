type Listener = (event: string, payload: unknown) => void;

const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function publish(event: string, payload: unknown) {
  listeners.forEach((fn) => fn(event, payload));
}
