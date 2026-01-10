import { useState, useEffect } from 'react';
import { getEvents, subscribe } from '../lib/bootTrace';

/**
 * Debug overlay that shows boot trace events.
 * Only renders in development mode.
 */
export function BootTrace() {
  const [events, setEvents] = useState(getEvents);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    // Update when new events arrive
    const unsubscribe = subscribe(() => {
      setEvents(getEvents());
    });
    return unsubscribe;
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-2 right-2 z-[9999] px-2 py-1 text-xs bg-black/80 text-green-400 rounded font-mono"
      >
        BOOT [{events.length}]
      </button>
    );
  }

  return (
    <div className="fixed bottom-2 right-2 z-[9999] w-80 max-h-60 overflow-auto bg-black/90 text-green-400 text-xs font-mono rounded-lg border border-green-500/30 p-2">
      <div className="flex justify-between items-center mb-1 border-b border-green-500/30 pb-1">
        <span className="font-bold">BOOT TRACE</span>
        <button
          onClick={() => setMinimized(true)}
          className="text-green-500 hover:text-green-300"
        >
          —
        </button>
      </div>
      {events.length === 0 ? (
        <div className="text-yellow-400">No events yet</div>
      ) : (
        <div className="space-y-0.5">
          {events.map((e, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-green-600 shrink-0">+{e.time}ms</span>
              <span className="text-green-400">{e.event}</span>
              {e.data !== undefined && (
                <span className="text-gray-400 truncate">
                  {typeof e.data === 'object' ? JSON.stringify(e.data) : String(e.data)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
