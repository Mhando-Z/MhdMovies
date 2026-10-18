import "server-only";

export async function fetchPeople(endpoint, params = {}, signal) {
  const token = process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  if (!token) {
    throw Object.assign(new Error("Actor information is temporarily unavailable. Please try again later."), { status: 503 });
  }
  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  url.search = new URLSearchParams({ language: "en-US", ...params }).toString();
  const timeout = AbortSignal.timeout(15000);
  const response = await fetch(url, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    headers: { accept: "application/json", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const status = response.status === 404 ? 404 : response.status === 429 ? 429 : 502;
    throw Object.assign(new Error(status === 404 ? "Actor not found." : status === 429
      ? "Too many requests. Please wait a moment and try again."
      : "We couldn't reach the actor collection. Please try again."), { status });
  }
  return response.json();
}

export function peopleError(error) {
  return Response.json({ error: error.status ? error.message : "We couldn't reach the actor collection. Please try again." },
    { status: error.status || 502 });
}
