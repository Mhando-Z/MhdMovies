import "server-only";
import { cache } from "react";
import {
  formats,
  genres,
  normalizeAnime,
  releasedEpisodeCount,
  sorts,
  statuses,
  validAnimeId,
} from "./model";

const fields = `id idMal title { english romaji native } description(asHtml: false)
  coverImage { extraLarge large } bannerImage countryOfOrigin averageScore
  seasonYear startDate { year } episodes duration status format genres
  nextAiringEpisode { episode airingAt }`;
const failure = (message, status = 502) =>
  Object.assign(new Error(message), { status });

async function requestJson(url, options = {}, signal) {
  const response = await fetch(url, {
    ...options,
    next: { revalidate: 900 },
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
      : AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw failure(
      response.status === 429
        ? "The anime collection is busy. Please try again shortly."
        : response.status === 404
          ? "This anime could not be found."
          : "The anime service is temporarily unavailable. Please try again.",
      [404, 429].includes(response.status) ? response.status : 502,
    );
  return response.json();
}

async function anilist(query, variables, signal) {
  const result = await requestJson(
    "https://graphql.anilist.co",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    },
    signal,
  );
  if (result.errors?.length)
    throw failure(
      "The anime collection could not be loaded. Please try again.",
    );
  if (!result.data)
    throw failure("The anime service returned an incomplete response.");
  return result.data;
}

export function parseFilters(params) {
  const filters = {
    search: (params.get("search") || "").trim(),
    country: params.get("country") || "",
    genre: params.get("genre") || "",
    format: params.get("format") || "",
    status: params.get("status") || "",
    sort: params.get("sort") || "trending",
    year: params.get("year") || "",
    page: Number(params.get("page") || 1),
  };
  if (
    filters.search.length > 150 ||
    !["", "JP", "CN"].includes(filters.country) ||
    (filters.genre && !genres.includes(filters.genre)) ||
    (filters.format && !formats.includes(filters.format)) ||
    (filters.status && !statuses.includes(filters.status)) ||
    !Object.hasOwn(sorts, filters.sort) ||
    !Number.isInteger(filters.page) ||
    filters.page < 1 ||
    filters.page > 500 ||
    (filters.year &&
      (!/^\d{4}$/.test(filters.year) ||
        Number(filters.year) < 1940 ||
        Number(filters.year) > 2100))
  )
    throw failure(
      "Please choose valid anime filters and a page from 1 to 500.",
      400,
    );
  return filters;
}

export async function getCatalogue(params, signal) {
  const filters = parseFilters(params);
  const data = await anilist(
    `query ($page: Int, $search: String, $country: CountryCode, $genre: String, $format: MediaFormat, $status: MediaStatus, $sort: [MediaSort], $year: Int) {
    Page(page: $page, perPage: 24) {
      pageInfo { currentPage hasNextPage }
      media(type: ANIME, isAdult: false, search: $search, countryOfOrigin: $country, genre: $genre, format: $format, status: $status, sort: $sort, seasonYear: $year) { ${fields} }
    }
  }`,
    {
      page: filters.page,
      // AniList distinguishes omitted filters from explicit null values.
      ...Object.fromEntries(
        ["search", "country", "genre", "format", "status"]
          .filter((key) => filters[key])
          .map((key) => [key, filters[key]]),
      ),
      sort: [sorts[filters.sort]],
      ...(filters.year ? { year: Number(filters.year) } : {}),
    },
    signal,
  );
  return {
    results: (data.Page.media || []).map(normalizeAnime),
    page: filters.page,
    hasNextPage: data.Page.pageInfo.hasNextPage,
  };
}

export async function getHome(signal) {
  const data = await anilist(
    `query {
    trending: Page(perPage: 6) { media(type: ANIME, isAdult: false, sort: TRENDING_DESC) { ${fields} } }
    donghua: Page(perPage: 6) { media(type: ANIME, isAdult: false, countryOfOrigin: "CN", sort: POPULARITY_DESC) { ${fields} } }
    airing: Page(perPage: 6) { media(type: ANIME, isAdult: false, status: RELEASING, sort: POPULARITY_DESC) { ${fields} } }
  }`,
    {},
    signal,
  );
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value.media.map(normalizeAnime),
    ]),
  );
}

export const getAnime = cache(async (id) => {
  if (!validAnimeId(id)) throw failure("This anime could not be found.", 404);
  const { Media } = await anilist(
    `query ($id: Int) {
    Media(id: $id, type: ANIME, isAdult: false) {
      ${fields} synonyms studios(isMain: true) { nodes { name } } trailer { id site }
      relations { edges { relationType node { ${fields} type isAdult } } }
    }
  }`,
    { id: Number(id) },
  );
  if (!Media) throw failure("This anime could not be found.", 404);
  return normalizeAnime(Media);
});

export async function getEpisodes(anime, page, signal) {
  if (!anime.malId)
    return { results: [], hasNextPage: false, unavailable: true };
  const data = await requestJson(
    `https://api.jikan.moe/v4/anime/${anime.malId}/episodes?page=${page}`,
    {},
    signal,
  );
  return {
    results: (data.data || []).map((episode) => ({
      number: episode.mal_id,
      title: episode.title || `Episode ${episode.mal_id}`,
      aired: episode.aired,
      filler: episode.filler,
      recap: episode.recap,
    })),
    hasNextPage: Boolean(data.pagination?.has_next_page),
    unavailable: false,
  };
}

export async function canWatchEpisode(anime, episode) {
  if (!Number.isInteger(episode) || episode < 1 || episode > 100000)
    return false;
  const count = releasedEpisodeCount(anime);
  if (count !== null) return episode <= count;
  if (!anime.malId) return false;
  try {
    const { data } = await requestJson(
      `https://api.jikan.moe/v4/anime/${anime.malId}/episodes/${episode}`,
    );
    return (
      data?.mal_id === episode &&
      Boolean(data.aired) &&
      new Date(data.aired).getTime() <= Date.now()
    );
  } catch {
    return false;
  }
}

export async function getChineseDetails(anime, signal) {
  // Never guess an identity from a translated name. Configure verified pairs.
  let mappings;
  try {
    mappings = JSON.parse(process.env.ANIME_BANGUMI_MAPPINGS || "{}");
  } catch {
    return null;
  }
  const id = mappings?.[anime.id];
  if (anime.country !== "CN" || !validAnimeId(id)) return null;
  const data = await requestJson(
    `https://api.bgm.tv/v0/subjects/${id}`,
    {
      headers: {
        "User-Agent": "MhdMovies/Anime (https://mhd-movies.vercel.app)",
        Accept: "application/json",
      },
    },
    signal,
  );
  if (data.type !== 2) return null;
  return {
    id: data.id,
    title: data.name_cn || data.name,
    summary: data.summary || "",
    url: `https://bgm.tv/subject/${data.id}`,
  };
}

export function animeError(error) {
  return Response.json(
    {
      error: error.status
        ? error.message
        : "We couldn't load this anime information. Please try again.",
    },
    { status: error.status || 502 },
  );
}
