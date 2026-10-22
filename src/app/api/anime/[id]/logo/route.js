import { getAnime } from "@/lib/anime/catalogue";
import { getAnimeVisuals } from "@/lib/anime/tmdb";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const anime = await getAnime(id);
    return Response.json(await getAnimeVisuals(anime, request.signal));
  } catch {
    return Response.json({ logo: null, backdrop: null });
  }
}
