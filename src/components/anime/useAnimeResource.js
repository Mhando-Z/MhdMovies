"use client";

import { useEffect, useState } from "react";

const cached = new Map();
const pending = new Map();
function load(url) {
  const previous = cached.get(url);
  if (previous && Date.now() - previous.at < 60000) return Promise.resolve(previous.data);
  if (pending.has(url)) return pending.get(url);
  const request = fetch(url, { signal: AbortSignal.timeout(20000) }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load this information.");
    cached.delete(url);
    cached.set(url, { data, at: Date.now() });
    if (cached.size > 100) cached.delete(cached.keys().next().value);
    return data;
  }).finally(() => pending.delete(url));
  pending.set(url, request);
  return request;
}

export function useAnimeResource(url) {
  const [state, setState] = useState({ url: null, data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!url) return;
    let active = true;
    load(url).then((data) => { if (active) setState({ url, data, loading: false, error: null }); })
      .catch((error) => { if (active) setState({ url, data: null, loading: false, error: error.message }); });
    return () => { active = false; };
  }, [url, attempt]);
  return {
    ...(url && state.url === url ? state : { data: null, loading: Boolean(url), error: null }),
    retry: () => { cached.delete(url); setState({ url, data: null, loading: true, error: null }); setAttempt((value) => value + 1); },
  };
}
