export const validAnimeId = (id) => /^[1-9]\d{0,8}$/.test(String(id));
// Numeric URLs retain their original AniList meaning. Never reinterpret an ID.
export const validAnimeKey = (id) => /^(?:mal-)?[1-9]\d{0,8}$/.test(String(id));
export const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
  "Award Winning", "Gourmet", "Suspense", "Martial Arts", "Shounen", "Shoujo", "Seinen", "Josei", "Kids",
];
export const formats = ["TV", "MOVIE", "OVA", "ONA", "SPECIAL", "TV_SHORT"];
export const statuses = ["RELEASING", "FINISHED", "NOT_YET_RELEASED"];
export const sorts = {
  trending: "TRENDING_DESC",
  popular: "POPULARITY_DESC",
  score: "SCORE_DESC",
  newest: "START_DATE_DESC",
  seasonal: "TRENDING_DESC",
  airing: "POPULARITY_DESC",
  upcoming: "POPULARITY_DESC",
  movies: "SCORE_DESC",
};
export const label = (value) =>
  value
    ? value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/^./, (c) => c.toUpperCase())
    : "TBA";

export function plainText(value = "") {
  return String(value ?? "")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export function normalizeAnime(media) {
  return {
    id: media.id,
    anilistId: media.id,
    provider: "anilist",
    malId: media.idMal || null,
    title:
      media.title?.english ||
      media.title?.romaji ||
      media.title?.native ||
      "Untitled",
    nativeTitle: media.title?.native || "",
    aliases: [
      ...new Set(
        [
          media.title?.romaji,
          media.title?.native,
          ...(media.synonyms || []),
        ].filter(Boolean),
      ),
    ],
    description: plainText(media.description),
    cover: media.coverImage?.extraLarge || media.coverImage?.large || null,
    banner: media.bannerImage || null,
    country: media.countryOfOrigin,
    score: media.averageScore ? media.averageScore / 10 : null,
    year: media.seasonYear || media.startDate?.year || null,
    episodes: media.episodes || null,
    duration: media.duration || null,
    status: media.status,
    format: media.format,
    genres: media.genres || [],
    nextAiring: media.nextAiringEpisode || null,
    studios: media.studios?.nodes?.map((studio) => studio.name) || [],
    trailer:
      media.trailer?.site === "youtube" && /^[\w-]{11}$/.test(media.trailer.id)
        ? media.trailer.id
        : null,
    related: (media.relations?.edges || [])
      .filter(({ node }) => node.type === "ANIME" && !node.isAdult)
      .map(({ node, relationType }) => ({
        ...normalizeAnime(node),
        relation: label(relationType),
      })),
  };
}

export function normalizeMalAnime(media, provider = "mal") {
  const status = { currently_airing: "RELEASING", finished_airing: "FINISHED", not_yet_aired: "NOT_YET_RELEASED" };
  const related = (media.related_anime || []).filter(({ node }) => node && node.nsfw !== "black");
  return {
    id: `mal-${media.id}`, malId: media.id, anilistId: null, provider,
    title: media.alternative_titles?.en || media.title || "Untitled",
    nativeTitle: media.alternative_titles?.ja || "",
    aliases: [...new Set([media.title, ...(media.alternative_titles?.synonyms || [])].filter(Boolean))],
    description: plainText(media.synopsis),
    cover: media.main_picture?.large || media.main_picture?.medium || null,
    banner: null,
    // MAL does not expose country of origin. Do not infer it from the title/type.
    country: null,
    score: media.mean || null,
    rank: media.rank || null,
    popularity: media.popularity || null,
    year: media.start_season?.year || Number(media.start_date?.slice(0, 4)) || null,
    startDate: media.start_date || null,
    season: media.start_season?.season || null,
    episodes: media.num_episodes || null,
    duration: media.average_episode_duration ? Math.round(media.average_episode_duration / 60) : null,
    status: status[media.status] || null,
    format: media.media_type?.toUpperCase() || null,
    genres: (media.genres || []).map((genre) => genre.name),
    studios: (media.studios || []).map((studio) => studio.name),
    broadcast: media.broadcast || null,
    nextAiring: null, trailer: null,
    related: related.map(({ node, relation_type_formatted, relation_type }) => ({ ...normalizeMalAnime(node, provider), relation: relation_type_formatted || label(relation_type) })),
    recommendations: (media.recommendations || []).filter(({ node }) => node && node.nsfw !== "black").slice(0, 12)
      .map(({ node }) => normalizeMalAnime(node, provider)),
  };
}

export function normalizeJikanAnime(media) {
  const anime = normalizeMalAnime({
    id: media.mal_id, title: media.title,
    alternative_titles: { en: media.title_english, ja: media.title_japanese, synonyms: media.title_synonyms },
    synopsis: media.synopsis,
    main_picture: { large: media.images?.jpg?.large_image_url || media.images?.webp?.large_image_url },
    mean: media.score, rank: media.rank, popularity: media.popularity,
    start_date: media.aired?.from, start_season: { year: media.year, season: media.season },
    num_episodes: media.episodes, media_type: media.type?.toLowerCase().replaceAll(" ", "_"),
    status: { "Currently Airing": "currently_airing", "Finished Airing": "finished_airing", "Not yet aired": "not_yet_aired" }[media.status],
    genres: [...(media.genres || []), ...(media.themes || []), ...(media.demographics || [])],
    studios: media.studios,
  }, "jikan");
  const trailer = media.trailer?.youtube_id;
  return { ...anime, duration: Number(media.duration?.match(/^(\d+) min/)?.[1]) || null,
    trailer: /^[\w-]{11}$/.test(trailer || "") ? trailer : null };
}

// A broadcast is not a guarantee that a third-party player has a stream.
export function releasedEpisodeCount(anime) {
  if (anime.status === "NOT_YET_RELEASED" || anime.status === "CANCELLED")
    return 0;
  if (Number.isInteger(anime.nextAiring?.episode))
    return Math.max(0, anime.nextAiring.episode - 1);
  if (anime.status === "FINISHED" && anime.episodes) return anime.episodes;
  return null;
}

export function watchHref(id, episode = 1, audio = "sub") {
  return `/anime/${id}/watch?${new URLSearchParams({ episode: String(episode), audio })}`;
}
