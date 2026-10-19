import { animeError, getAnime, getChineseDetails } from "@/lib/anime/catalogue";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    return Response.json({
      details: await getChineseDetails(await getAnime(id), request.signal),
    });
  } catch (error) {
    return animeError(error);
  }
}
