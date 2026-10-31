import "server-only";
import mappings from "./provider-mappings.json" with { type: "json" };
import { animeTransport } from "./transport";
import { validAnimeId } from "./model";

const API = "https://anikotoapi.site";

function configuredMapping(anime) {
  let overrides = {};
  try { overrides = JSON.parse(process.env.ANIME_STREAM_MAPPINGS || "{}"); }
  catch { /* Invalid optional configuration must not break playback. */ }
  const keys = [anime.id, anime.malId && `mal-${anime.malId}`, anime.anilistId].filter(Boolean);
  for (const key of keys) {
    if (Object.hasOwn(overrides, key)) return overrides[key];
  }
  return keys.map((key) => mappings[key]).find(Boolean);
}

function matchesIdentity(row, anime) {
  // At least one shared ID must match, and no shared ID may disagree.
  const pairs = [[anime.malId, row?.mal_id], [anime.anilistId, row?.ani_id]]
    .filter(([catalog, provider]) => validAnimeId(catalog) && validAnimeId(provider));
  return pairs.length > 0 && pairs.every(([catalog, provider]) => Number(catalog) === Number(provider));
}

export function validEpisodeEmbed(value, audio) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port &&
      ["megaplay.buzz", "supaplay.fun"].includes(url.hostname) &&
      new RegExp(`^/stream/s-2/[1-9]\\d{0,11}/${audio}$`).test(url.pathname) &&
      !url.search && !url.hash ? url.href : null;
  } catch { return null; }
}

async function providerEpisodes(anime) {
  let mapping = configuredMapping(anime);
  if (mapping === false) return { episodes: [], state: "disabled" };
  if (!mapping) {
    // One shared, cached shortlist, never an unbounded crawl per visitor.
    const recent = await animeTransport.request(`${API}/recent-anime?page=1&per_page=100`, {}, {
      ttl: 900, stale: false,
      validate: (data) => data?.ok === true && Array.isArray(data.data),
    });
    const candidates = recent.data.filter((row) => matchesIdentity(row, anime));
    if (candidates.length !== 1) return { episodes: [], state: "unknown" };
    mapping = { seriesId: candidates[0].id };
  }
  if (!validAnimeId(mapping?.seriesId)) return { episodes: [], state: "unknown" };
  const data = await animeTransport.request(`${API}/series/${mapping.seriesId}`, {}, {
    ttl: 900, stale: false,
    validate: (data) => data?.ok === true && Number(data.data?.anime?.id) === Number(mapping.seriesId) &&
      Array.isArray(data.data?.episodes),
  });
  // Explicit maps can point at a combined-season record, but must pin its MAL ID.
  const identity = mapping.providerMalId
    ? validAnimeId(mapping.providerMalId) && mapping.episodeMap &&
      Number(data.data.anime.mal_id) === Number(mapping.providerMalId)
    : matchesIdentity(data.data.anime, anime);
  if (!identity) return { episodes: [], state: "unknown" };
  const byNumber = new Map();
  for (const episode of data.data.episodes) {
    const number = Number(episode.number);
    if (!Number.isSafeInteger(number) || number < 1 || number > 100000) continue;
    // Duplicate numbers are ambiguous: do not select either stream.
    byNumber.set(number, byNumber.has(number) ? null : episode);
  }
  const pairs = mapping.episodeMap
    ? Object.entries(mapping.episodeMap).map(([catalog, provider]) => [Number(catalog), Number(provider)])
    : [...byNumber.keys()].map((number) => [number, number]);
  const episodes = pairs.flatMap(([number, providerNumber]) => {
    const episode = byNumber.get(providerNumber);
    if (!episode || !Number.isSafeInteger(number) || number < 1 || number > 100000 ||
      (anime.episodes && number > anime.episodes)) return [];
    const streams = Object.fromEntries(["sub", "dub"].flatMap((audio) => {
      const url = validEpisodeEmbed(episode.embed_url?.[audio], audio);
      return url ? [[audio, url]] : [];
    }));
    if (!Object.keys(streams).length) return [];
    return [{ number, title: typeof episode.title === "string" ? episode.title : `Episode ${number}`, streams }];
  }).sort((a, b) => a.number - b.number);
  return { episodes, state: "checked" };
}

export async function getPlaybackAnime(anime) {
  const resolved = { ...anime };
  // This enrichment is optional; catalog details remain usable during outages.
  const [crossId, provider] = await Promise.allSettled([
    !anime.anilistId && validAnimeId(anime.malId)
      ? animeTransport.request(`https://api.ani.zip/mappings?mal_id=${anime.malId}`, {}, {
          ttl: 86400,
          validate: (data) => Number(data.mappings?.mal_id) === Number(anime.malId) &&
            validAnimeId(data.mappings?.anilist_id),
        }) : null,
    providerEpisodes(anime),
  ]);
  if (crossId.status === "fulfilled" && crossId.value)
    resolved.anilistId = Number(crossId.value.mappings.anilist_id);
  resolved.streamEpisodes = provider.status === "fulfilled" ? provider.value.episodes : [];
  resolved.streamState = provider.status === "fulfilled" ? provider.value.state : "unavailable";
  return resolved;
}

