import { searchSubtitles, subtitleError } from "@/lib/subtitleProviders";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const movieId = params.get("tmdb_id");
  const language = params.get("language") || "en";
  const page = Number(params.get("page") || 1);
  const provider = params.get("provider");
  const type = params.get("type") || "movie";
  const season = params.get("season");
  const episode = params.get("episode");
  if (
    !/^[1-9]\d{0,9}$/.test(movieId || "") ||
    !/^[a-z]{2,3}(?:-[a-z]{2})?$/.test(language) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 100 ||
    !["movie", "tv"].includes(type) ||
    (type === "tv" &&
      (!/^\d{1,4}$/.test(season || "") ||
        !/^[1-9]\d{0,4}$/.test(episode || ""))) ||
    (type === "movie" && (season !== null || episode !== null)) ||
    (provider && !["subdl", "opensubtitles"].includes(provider))
  ) {
    return Response.json(
      { error: "Choose a valid title, episode, language and page." },
      { status: 400 },
    );
  }
  try {
    return Response.json(
      await searchSubtitles(
        movieId,
        language,
        page,
        provider,
        request.signal,
        type === "tv"
          ? { season: Number(season), number: Number(episode) }
          : undefined,
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return subtitleError(error);
  }
}
