import "server-only";

export const validId = (id) => /^[1-9]\d{0,9}$/.test(String(id));
export const apiFailure = (message, status = 502) =>
  Object.assign(new Error(message), { status });

export async function tmdb(endpoint, params = {}, signal) {
  const token =
    process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  if (!token)
    throw apiFailure(
      "The collection is temporarily unavailable. Please try again later.",
      503,
    );
  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  url.search = new URLSearchParams({ language: "en-US", ...params }).toString();
  const response = await fetch(url, {
    headers: { accept: "application/json", Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
      : AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw apiFailure(
      response.status === 404
        ? "This title could not be found."
        : response.status === 429
          ? "Too many requests. Please try again shortly."
          : "We couldn't load the collection. Please try again.",
      [404, 429].includes(response.status) ? response.status : 502,
    );
  return response.json();
}

export function collectionError(error) {
  return Response.json(
    {
      error: error.status
        ? error.message
        : "We couldn't load this information. Please try again.",
    },
    { status: error.status || 502 },
  );
}

export async function tvmazeDetails(externalIds, signal) {
  const ids = [
    /^tt\d+$/.test(externalIds?.imdb_id || "") && ["imdb", externalIds.imdb_id],
    validId(externalIds?.tvdb_id) && ["thetvdb", String(externalIds.tvdb_id)],
  ].filter(Boolean);
  for (const [key, value] of ids) {
    const options = {
      next: { revalidate: 3600 },
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(10000)])
        : AbortSignal.timeout(10000),
    };
    const lookup = await fetch(
      `https://api.tvmaze.com/lookup/shows?${new URLSearchParams({ [key]: value })}`,
      options,
    );
    if (lookup.status === 404) continue;
    if (!lookup.ok)
      throw apiFailure("Episode schedule is temporarily unavailable.");
    const show = await lookup.json();
    if (!validId(show.id)) return null;
    const response = await fetch(
      `https://api.tvmaze.com/shows/${show.id}?embed[]=nextepisode&embed[]=previousepisode`,
      options,
    );
    if (!response.ok)
      throw apiFailure("Episode schedule is temporarily unavailable.");
    const data = await response.json();
    return {
      id: data.id,
      url: data.url,
      status: data.status,
      nextEpisode: data._embedded?.nextepisode ?? null,
      previousEpisode: data._embedded?.previousepisode ?? null,
    };
  }
  return null;
}
