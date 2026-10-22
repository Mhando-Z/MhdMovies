import "server-only";
import { cache } from "react";
import { animeTransport } from "./transport";
import { currentSeason, getMalAnime, getMalCatalogue, getMalHome, mapLegacyId } from "./mal";
import {
  formats,
  genres,
  normalizeAnime,
  releasedEpisodeCount,
  sorts,
  statuses,
  validAnimeId,
  validAnimeKey,
} from "./model";

const fields = `id idMal title { english romaji native } description(asHtml: false)
  coverImage { extraLarge large } bannerImage countryOfOrigin averageScore
  seasonYear startDate { year } episodes duration status format genres
  nextAiringEpisode { episode airingAt }`;
const failure = (message, status = 502) =>
  Object.assign(new Error(message), { status });

async function requestJson(url, options = {}, signal) {
  return animeTransport.request(url, options, {
    validate: (data) => data && !data.errors?.length && !data.error && (data.data !== undefined || Number.isInteger(data.id)),
  });
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
  return { ...result.data, _stale: Boolean(result._stale) };
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
    (filters.search && filters.search.length < 2) ||
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

async function getAniListCatalogue(params, signal) {
  const filters = parseFilters(params);
  if (filters.sort === "airing" && !filters.status) filters.status = "RELEASING";
  if (filters.sort === "upcoming" && !filters.status) filters.status = "NOT_YET_RELEASED";
  if (filters.sort === "movies" && !filters.format) filters.format = "MOVIE";
  const seasonal = !filters.search && !filters.country && !filters.year && ["trending", "seasonal"].includes(filters.sort);
  const data = await anilist(
    `query ($page: Int, $search: String, $country: CountryCode, $genre: String, $format: MediaFormat, $status: MediaStatus, $sort: [MediaSort], $year: Int, $season: MediaSeason) {
    Page(page: $page, perPage: 24) {
      pageInfo { currentPage hasNextPage }
      media(type: ANIME, isAdult: false, search: $search, countryOfOrigin: $country, genre: $genre, format: $format, status: $status, sort: $sort, seasonYear: $year, season: $season) { ${fields} }
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
      ...(seasonal ? { year: currentSeason().year, season: currentSeason().season.toUpperCase() } : {}),
    },
    signal,
  );
  return {
    results: (data.Page.media || []).map(normalizeAnime),
    page: filters.page,
    hasNextPage: data.Page.pageInfo.hasNextPage,
    stale: Boolean(data._stale),
  };
}

async function getAniListHome(signal) {
  const data = await anilist(
    `query {
    trending: Page(perPage: 6) { media(type: ANIME, isAdult: false, sort: TRENDING_DESC) { ${fields} } }
    donghua: Page(perPage: 6) { media(type: ANIME, isAdult: false, countryOfOrigin: "CN", sort: POPULARITY_DESC) { ${fields} } }
    airing: Page(perPage: 6) { media(type: ANIME, isAdult: false, status: RELEASING, sort: POPULARITY_DESC) { ${fields} } }
  }`,
    {},
    signal,
  );
  return { stale: Boolean(data._stale), ...Object.fromEntries(
    Object.entries(data).filter(([key]) => key !== "_stale").map(([key, value]) => [
      key,
      value.media.map(normalizeAnime),
    ]),
  ) };
}

async function getAniListAnime(id, byMalId = false) {
  const data = await anilist(
    `query ($id: Int) {
    Media(${byMalId ? "idMal" : "id"}: $id, type: ANIME, isAdult: false) {
      ${fields} synonyms studios(isMain: true) { nodes { name } } trailer { id site }
      relations { edges { relationType node { ${fields} type isAdult } } }
    }
  }`,
    { id: Number(id) },
  );
  const { Media } = data;
  if (!Media) throw failure("This anime could not be found.", 404);
  if (byMalId && Media.idMal !== Number(id)) throw failure("The anime service returned an incomplete response.");
  return { ...normalizeAnime(Media), stale: Boolean(data._stale) };
}

export async function getCatalogue(params, signal) {
  const filters = parseFilters(params);
  // Country is only supported by AniList. MAL/Jikan must not guess origins.
  if (filters.country) return getAniListCatalogue(params, signal);
  try { return await getMalCatalogue(filters); }
  catch (error) {
    try { return { ...await getAniListCatalogue(params, signal), provider: "anilist" }; }
    catch { throw error; }
  }
}

export async function getHome(signal) {
  try { return await getMalHome(); }
  catch (error) {
    try { return await getAniListHome(signal); }
    catch { throw error; }
  }
}

export const getAnime = cache(async (id) => {
  if (!validAnimeKey(id)) throw failure("This anime could not be found.", 404);
  if (String(id).startsWith("mal-")) {
    const malId = Number(String(id).slice(4));
    try { return await getMalAnime(malId); }
    catch (error) {
      if (error.status === 404) throw error;
      try { return { ...await getAniListAnime(malId, true), id: `mal-${malId}` }; }
      catch { throw error; }
    }
  }
  try {
    const malId = await mapLegacyId(id);
    return { ...await getMalAnime(malId), id: Number(id), anilistId: Number(id) };
  } catch (error) {
    try { return await getAniListAnime(id); }
    catch { throw error; }
  }
});

export async function getEpisodes(anime, page, signal) {
  if (!anime.malId)
    return { results: [], hasNextPage: false, unavailable: true };
  try {
    const data = await requestJson(
    `https://api.jikan.moe/v4/anime/${anime.malId}/episodes?page=${page}`,
    {},
    signal,
  );
    if (!Array.isArray(data.data)) throw failure("Episode information is temporarily unavailable.");
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
  } catch {
    try {
      const data = await animeTransport.request(`https://api.ani.zip/mappings?mal_id=${anime.malId}`, {}, {
        ttl: 3600, validate: (value) => value.mappings?.mal_id === anime.malId && Boolean(value.episodes),
      });
      const start = (page - 1) * 100 + 1;
      const all = Object.entries(data.episodes).filter(([number]) => /^[1-9]\d*$/.test(number))
        .map(([number, episode]) => ({ number: Number(number), title: episode.title?.en || `Episode ${number}`,
          // Only exact timestamps can establish a broadcast date for playback.
          aired: episode.airDateUtc || null, filler: false, recap: false }));
      return { results: all.filter(({ number }) => number >= start && number < start + 100),
        hasNextPage: all.some(({ number }) => number >= start + 100), unavailable: false };
    } catch { return { results: [], hasNextPage: false, unavailable: true }; }
  }
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
    const data = await getEpisodes(anime, Math.floor((episode - 1) / 100) + 1);
    const item = data.results.find((item) => item.number === episode);
    return Boolean(item?.aired) && new Date(item.aired).getTime() <= Date.now();
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
  const id = mappings?.[anime.id] || mappings?.[anime.anilistId];
  if (anime.country === "JP" || !validAnimeId(id)) return null;
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
    { status: error.status || 502, headers: { "Cache-Control": "no-store" } },
  );
}
