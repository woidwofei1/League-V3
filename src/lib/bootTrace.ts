/**
 * Boot trace logger for debugging app initialization.
 * Stores last 30 events in memory.
 */

interface TraceEvent {
  time: number;
  event: string;
  data?: unknown;
}

const events: TraceEvent[] = [];
const MAX_EVENTS = 30;
const startTime = Date.now();

let listeners: Array<() => void> = [];

export function trace(event: string, data?: unknown): void {
  const entry: TraceEvent = {
    time: Date.now() - startTime,
    event,
    data,
  };
  
  events.push(entry);
  if (events.length > MAX_EVENTS) {
    events.shift();
  }
  
  // Log to console for debugging
  console.log(`[BOOT +${entry.time}ms]`, event, data !== undefined ? data : '');
  
  // Notify listeners
  listeners.forEach(fn => fn());
}

export function getEvents(): TraceEvent[] {
  return [...events];
}

export function subscribe(fn: () => void): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

// Initial trace
trace('boot: module loaded');
