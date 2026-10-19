export const validAnimeId = (id) => /^[1-9]\d{0,8}$/.test(String(id));
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
];
export const formats = ["TV", "MOVIE", "OVA", "ONA", "SPECIAL", "TV_SHORT"];
export const statuses = ["RELEASING", "FINISHED", "NOT_YET_RELEASED"];
export const sorts = {
  trending: "TRENDING_DESC",
  popular: "POPULARITY_DESC",
  score: "SCORE_DESC",
  newest: "START_DATE_DESC",
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
