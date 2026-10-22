import "server-only";
import { animeTransport, serviceError } from "./transport";
import { normalizeMalAnime, normalizeJikanAnime } from "./model";

const listFields = "alternative_titles,synopsis,mean,rank,popularity,nsfw,media_type,status,genres,num_episodes,start_season,start_date,average_episode_duration,studios";
const detailFields = `${listFields},broadcast,related_anime{nsfw},recommendations{nsfw}`;
const genreIds = { Action: 1, Adventure: 2, Comedy: 4, Drama: 8, Fantasy: 10, Horror: 14, Mecha: 18, Music: 19, Mystery: 7, Psychological: 40, Romance: 22, "Sci-Fi": 24, "Slice of Life": 36, Sports: 30, Supernatural: 37, Thriller: 41, Suspense: 41, "Award Winning": 46, Gourmet: 47, "Martial Arts": 17, Shounen: 27, Shoujo: 25, Seinen: 42, Josei: 43, Kids: 15 };
const safeMal = (item) => item && item.nsfw !== "black" && !(item.genres || []).some(({ id }) => [9, 12, 49].includes(id));
const safeJikan = (item) => item && !(item.genres || []).some(({ mal_id }) => [9, 12, 49].includes(mal_id));

export function currentSeason(date = new Date()) {
  return { year: date.getUTCFullYear(), season: ["winter", "spring", "summer", "fall"][Math.floor(date.getUTCMonth() / 3)] };
}

export async function malRequest(endpoint, params = {}, ttl = 900) {
  const clientId = process.env.MAL_CLIENT_ID || process.env.MYANIMELIST_ID;
  if (!clientId) throw serviceError("MyAnimeList is not configured.", 503);
  const url = new URL(`https://api.myanimelist.net/v2${endpoint}`);
  url.search = new URLSearchParams({ nsfw: "false", ...params }).toString();
  return animeTransport.request(url.href, { headers: { "X-MAL-CLIENT-ID": clientId, Accept: "application/json" } }, {
    ttl, validate: (data) => !data.error && (Array.isArray(data.data) || Number.isInteger(data.id)),
  });
}

export async function jikanRequest(endpoint, params = {}, ttl = 900, stale = true) {
  const url = new URL(`https://api.jikan.moe/v4${endpoint}`);
  url.search = new URLSearchParams(params).toString();
  return animeTransport.request(url.href, {}, { ttl, stale, validate: (data) => data.data !== undefined && !data.error && data.status !== 500 });
}

export async function getMalAnime(id) {
  try {
    const data = await malRequest(`/anime/${id}`, { fields: detailFields }, 3600);
    if (data.id !== Number(id)) throw serviceError("The anime service returned an incomplete response.");
    if (!safeMal(data)) throw serviceError("This anime could not be found.", 404);
    return { ...normalizeMalAnime(data), stale: Boolean(data._stale) };
  } catch (error) {
    if (error.status === 404) throw error;
    try {
      const result = await jikanRequest(`/anime/${id}/full`, {}, 3600);
      if (result.data?.mal_id !== Number(id)) throw serviceError("The anime service returned an incomplete response.");
      if (!safeJikan(result.data)) throw serviceError("This anime could not be found.", 404);
      const anime = normalizeJikanAnime(result.data);
      return { ...anime, stale: Boolean(result._stale) };
    } catch (fallbackError) {
      if (fallbackError.status === 404) throw fallbackError;
      throw error;
    }
  }
}

async function jikanCatalogue(filters) {
  const params = { page: String(filters.page), limit: "24", sfw: "true" };
  if (filters.search) params.q = filters.search;
  if (filters.genre) params.genres = String(genreIds[filters.genre]);
  if (filters.format) params.type = filters.format.toLowerCase();
  if (filters.status) params.status = { RELEASING: "airing", FINISHED: "complete", NOT_YET_RELEASED: "upcoming" }[filters.status];
  if (filters.year) { params.start_date = `${filters.year}-01-01`; params.end_date = `${filters.year}-12-31`; }
  params.order_by = { score: "score", newest: "start_date" }[filters.sort] || "members";
  params.sort = "desc";
  const result = await jikanRequest("/anime", params);
  if (!Array.isArray(result.data)) throw serviceError("The anime service returned an incomplete response.");
  return { results: result.data.filter(safeJikan).map(normalizeJikanAnime), page: filters.page,
    hasNextPage: Boolean(result.pagination?.has_next_page), provider: "jikan", stale: Boolean(result._stale) };
}

export async function getMalCatalogue(filters) {
  if (filters.search) {
    filters = { ...filters };
    if (!filters.status && ["airing", "upcoming"].includes(filters.sort)) filters.status = filters.sort === "airing" ? "RELEASING" : "NOT_YET_RELEASED";
    if (!filters.format && filters.sort === "movies") filters.format = "MOVIE";
  }
  const advanced = filters.genre || filters.format || filters.year || (filters.status && (filters.status !== "RELEASING" || filters.search)) || filters.sort === "newest";
  if (advanced) {
    try { return await jikanCatalogue(filters); }
    catch (error) {
      // MAL has no arbitrary genre/status query. Keep a clearly labelled, bounded
      // discovery subset usable during a Jikan outage instead of claiming full results.
      const params = { limit: "100", fields: listFields };
      let endpoint = "/anime/ranking";
      if (filters.search) { endpoint = "/anime"; params.q = filters.search; }
      else if (filters.year) {
        endpoint = `/anime/season/${filters.year}/${currentSeason().season}`;
        params.sort = "anime_num_list_users";
      } else params.ranking_type = filters.status === "RELEASING" ? "airing" : filters.status === "NOT_YET_RELEASED" ? "upcoming" : "bypopularity";
      try {
        const data = await malRequest(endpoint, params);
        const matching = data.data.map(({ node }) => node).filter(safeMal).map((node) => normalizeMalAnime(node))
          .filter((anime) => (!filters.genre || anime.genres.includes(filters.genre)) && (!filters.format || anime.format === filters.format)
            && (!filters.status || anime.status === filters.status) && (!filters.year || anime.year === Number(filters.year)));
        if (filters.sort === "score") matching.sort((a, b) => (b.score || 0) - (a.score || 0));
        if (filters.sort === "newest") matching.sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
        return { results: matching.slice((filters.page - 1) * 24, filters.page * 24), page: filters.page,
          hasNextPage: matching.length > filters.page * 24, provider: "mal", stale: Boolean(data._stale), limited: true,
          notice: `Full-catalog filters are temporarily unavailable. Showing matching titles from the first 100 ${filters.year ? `${currentSeason().season} ${filters.year} seasonal` : filters.search ? "search" : "popular"} results.` };
      } catch { throw error; }
    }
  }
  try {
    const { year, season } = currentSeason();
    let endpoint = "/anime/ranking";
    const params = { limit: "24", offset: String((filters.page - 1) * 24), fields: listFields };
    if (filters.search) {
      endpoint = "/anime";
      params.q = filters.search;
    } else if (filters.status === "RELEASING" || filters.sort === "airing") {
      params.ranking_type = "airing";
    } else if (filters.sort === "trending" || filters.sort === "seasonal") {
      endpoint = `/anime/season/${year}/${season}`;
      params.sort = "anime_num_list_users";
    } else {
      params.ranking_type = { popular: "bypopularity", score: "all", upcoming: "upcoming", movies: "movie" }[filters.sort] || "all";
    }
    const result = await malRequest(endpoint, params);
    return { results: result.data.map(({ node }) => node).filter(safeMal).map((node) => normalizeMalAnime(node)),
      page: filters.page, hasNextPage: Boolean(result.paging?.next), provider: "mal", stale: Boolean(result._stale),
      notice: filters.search && filters.sort !== "trending" ? "Search results are ordered by relevance." : null };
  } catch (error) {
    try {
      if (!filters.search && ["trending", "seasonal"].includes(filters.sort)) {
        const { year, season } = currentSeason();
        const result = await jikanRequest(`/seasons/${year}/${season}`, { page: String(filters.page), limit: "24", sfw: "true" });
        if (!Array.isArray(result.data)) throw error;
        return { results: result.data.filter(safeJikan).map(normalizeJikanAnime), page: filters.page,
          hasNextPage: Boolean(result.pagination?.has_next_page), provider: "jikan", stale: Boolean(result._stale) };
      }
      const status = { airing: "RELEASING", upcoming: "NOT_YET_RELEASED" }[filters.sort];
      return await jikanCatalogue({ ...filters, status: filters.status || status || "", format: filters.sort === "movies" ? "MOVIE" : filters.format });
    } catch { throw error; }
  }
}

export async function getMalHome() {
  const sections = [
    ["trending", "trending"], ["airing", "airing"], ["popular", "popular"], ["top", "score"], ["upcoming", "upcoming"],
  ];
  const settled = await Promise.allSettled(sections.map(([, sort]) => getMalCatalogue({ page: 1, sort })));
  const home = { stale: false, season: currentSeason() };
  let success = false;
  settled.forEach((result, index) => {
    const key = sections[index][0];
    home[key] = result.status === "fulfilled" ? result.value.results.slice(0, 6) : [];
    if (result.status === "fulfilled") { success = true; home.stale ||= result.value.stale; }
  });
  if (!success) throw settled[0].reason;
  if (!home.trending.length) home.trending = home.airing.length ? home.airing : home.top;
  return home;
}

// Resolve an explicit cross-provider pair; never match anime by title or number.
export async function mapLegacyId(id) {
  const data = await animeTransport.request(`https://api.ani.zip/mappings?anilist_id=${id}`, {}, {
    ttl: 86400, validate: (value) => Number(value.mappings?.anilist_id) === Number(id) && Number.isInteger(value.mappings?.mal_id),
  });
  return data.mappings.mal_id;
}
