import "server-only";
import { tmdb, validId } from "@/lib/tmdbTV";

const titleKey = (value) =>
  (value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");

// AniList and TMDB use different IDs and may group seasons differently.
async function findTitle(anime, signal) {
  const type = anime.format === "MOVIE" ? "movie" : "tv";
  const titles = [
    ...new Set([anime.title, anime.nativeTitle, ...(anime.aliases || [])].filter(Boolean)),
  ];
  const nativeLanguage = { JP: "ja", CN: "zh" }[anime.country];
  const keys = new Set(titles.map(titleKey));
  const responses = await Promise.all(
    titles.slice(0, 3).map((query) =>
      tmdb(`/search/${type}`, { query, include_adult: "false" }, signal),
    ),
  );
  const matches = new Map();
  for (const item of responses.flatMap((response) => response.results || [])) {
    const year = Number((item.release_date || item.first_air_date || "").slice(0, 4));
    if (
      !validId(item.id) ||
      item.adult ||
      !item.genre_ids?.includes(16) ||
      !anime.year ||
      !year ||
      Math.abs(year - anime.year) > 1 ||
      (anime.country &&
        !item.origin_country?.includes(anime.country) &&
        (!nativeLanguage || item.original_language !== nativeLanguage)) ||
      ![item.name, item.original_name, item.title, item.original_title].some(
        (title) => title && keys.has(titleKey(title)),
      )
    )
      continue;
    matches.set(item.id, { id: item.id, type });
  }
  return matches.size === 1 ? [...matches.values()][0] : null;
}

export async function getAnimeLogo(anime, signal) {
  if (!(process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN))
    return null;
  try {
    // Verified overrides support sequels that TMDB groups under one series.
    const mappings = JSON.parse(process.env.ANIME_TMDB_MAPPINGS || "{}");
    const mapped = mappings?.[anime.id];
    const match =
      mapped && validId(mapped.id) && ["tv", "movie"].includes(mapped.type)
        ? mapped
        : await findTitle(anime, signal);
    if (!match) return null;
    const images = await tmdb(
      `/${match.type}/${match.id}/images`,
      { language: "" },
      signal,
    );
    const native = anime.country === "CN" ? "zh" : "ja";
    const priority = (logo) => {
      if (logo.iso_639_1 === "en") return 0;
      if (!logo.iso_639_1) return 1;
      if (logo.iso_639_1 === native) return 2;
      return 3;
    };
    const logo = (images.logos || [])
      .filter((image) => /^\/[\w.-]+\.(png|svg|webp)$/i.test(image.file_path || ""))
      .sort((a, b) =>
        priority(a) - priority(b) ||
        (b.vote_average || 0) - (a.vote_average || 0) ||
        (b.width || 0) - (a.width || 0),
      )[0];
    return logo
      ? {
          url: `https://image.tmdb.org/t/p/original${logo.file_path}`,
          width: logo.width,
          height: logo.height,
        }
      : null;
  } catch {
    // Optional artwork must never make the anime page unavailable.
    return null;
  }
}
