import { animeError, getAnime, getEpisodes } from "@/lib/anime/catalogue";
import { validAnimeKey } from "@/lib/anime/model";

export async function GET(request, { params }) {
  const { id } = await params;
  const page = Number(new URL(request.url).searchParams.get("page") || 1);
  if (!validAnimeKey(id) || !Number.isInteger(page) || page < 1 || page > 1000)
    return Response.json(
      { error: "Invalid anime or episode page." },
      { status: 400 },
    );
  try {
    return Response.json(
      await getEpisodes(await getAnime(id), page, request.signal),
    );
  } catch (error) {
    return animeError(error);
  }
}
