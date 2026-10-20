import { animeError, getAnime } from "@/lib/anime/catalogue";
import { getAnimeLogo } from "@/lib/anime/tmdb";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const anime = await getAnime(id);
    return Response.json({ logo: await getAnimeLogo(anime, request.signal) });
  } catch (error) {
    return animeError(error);
  }
}
