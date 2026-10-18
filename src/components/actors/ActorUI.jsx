"use client";

import Link from "next/link";
import { ArrowLeft, RotateCw, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

export function useActorResource(url) {
  const [state, setState] = useState({ url: null, data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ url, data: null, error: null });
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Unable to load actor information.");
        return data;
      })
      .then((data) => {
        if (!controller.signal.aborted) setState({ url, data, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ url, data: null, error: error.message });
      });
    return () => controller.abort();
  }, [url, attempt]);
  const current = state.url === url ? state : { data: null, error: null };
  return {
    ...current,
    loading: !current.data && !current.error,
    retry: () => setAttempt((value) => value + 1),
  };
}

export function Portrait({ path, name = "", className = "", eager = false }) {
  const [failed, setFailed] = useState(null);
  return path && failed !== path ? (
    <img
      src={`https://image.tmdb.org/t/p/h632${path}`}
      alt={name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(path)}
      className={className}
    />
  ) : (
    <div
      className={`flex items-center justify-center bg-zinc-900 text-white/25 ${className}`}
    >
      <UserRound className="size-12" aria-hidden="true" />
      <span className="sr-only">
        {name ? `${name}: portrait unavailable` : "Portrait unavailable"}
      </span>
    </div>
  );
}

export function ActorError({ message, onRetry }) {
  return (
    <div role="alert" className="actor-empty">
      <UserRound
        className="mx-auto mb-5 size-8 text-red-400"
        aria-hidden="true"
      />
      <h2 className="text-2xl font-semibold">A brief intermission.</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/60">
        {message}
      </p>
      {onRetry && (
        <button className="actor-button mt-6" type="button" onClick={onRetry}>
          <RotateCw className="size-4" aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  );
}

export function ActorLoading() {
  return (
    <main
      className="actors-page min-h-screen px-6 pb-20 pt-32"
      role="status"
      aria-label="Loading actor profile"
    >
      <div className="actor-container motion-safe:animate-pulse">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <div className="aspect-[3/4] max-w-60 rounded-2xl bg-white/10" />
          <div className="space-y-5 pt-6">
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="h-16 w-3/4 rounded bg-white/10" />
            <div className="h-5 w-1/2 rounded bg-white/10" />
            <div className="h-24 w-full rounded bg-white/5" />
          </div>
        </div>
        <div className="mt-16 h-56 rounded-2xl bg-white/5" />
      </div>
    </main>
  );
}

export function BackToActors() {
  return (
    <Link href="/actors" className="actor-back">
      <ArrowLeft className="size-4" aria-hidden="true" /> All actors
    </Link>
  );
}
