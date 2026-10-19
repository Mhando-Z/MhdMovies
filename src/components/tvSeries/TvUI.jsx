"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

export const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400";
export const button = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 ${focus}`;
export const grid =
  "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

export function useResource(url) {
  const [state, setState] = useState({
    url: null,
    data: null,
    error: null,
    loading: true,
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setState({ url, data: null, error: null, loading: true });
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Unable to load this information.");
        if (!controller.signal.aborted)
          setState({ url, data, error: null, loading: false });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ url, data: null, error: error.message, loading: false });
      });
    return () => controller.abort();
  }, [url, attempt]);
  return {
    ...(url && state.url === url
      ? state
      : { data: null, error: null, loading: Boolean(url) }),
    retry: () => setAttempt((value) => value + 1),
  };
}

export function ResourceError({ message, retry }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-6 text-sm text-white/65"
    >
      <p>{message}</p>
      {retry && (
        <button type="button" onClick={retry} className={button}>
          <RotateCcw className="size-4" /> Try again
        </button>
      )}
    </div>
  );
}

export function CardSkeletons({ count = 6 }) {
  return (
    <div role="status">
      <span className="sr-only">Loading collection...</span>
      <div aria-hidden="true" className={grid}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="motion-safe:animate-pulse">
            <div className="aspect-2/3 rounded-xl bg-white/10" />
            <div className="mt-4 h-3 w-3/4 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
