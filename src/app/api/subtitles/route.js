import { searchSubtitles, subtitleError } from "@/lib/subtitleProviders";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const movieId = params.get("tmdb_id");
  const language = params.get("language") || "en";
  const page = Number(params.get("page") || 1);
  const provider = params.get("provider");
  if (
    !/^[1-9]\d{0,9}$/.test(movieId || "") ||
    !/^[a-z]{2,3}(?:-[a-z]{2})?$/.test(language) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 100 ||
    (provider && !["subdl", "opensubtitles"].includes(provider))
  ) {
    return Response.json(
      { error: "Choose a valid movie, language and page." },
      { status: 400 },
    );
  }
  try {
    return Response.json(
      await searchSubtitles(movieId, language, page, provider, request.signal),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return subtitleError(error);
  }
}
