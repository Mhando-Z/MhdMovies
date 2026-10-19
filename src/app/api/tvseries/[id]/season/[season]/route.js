import { tmdb, validId, collectionError } from "@/lib/tmdbTV";

export async function GET(request, { params }) {
  const { id, season } = await params;
  if (!validId(id) || !/^\d{1,4}$/.test(season))
    return Response.json(
      { error: "Invalid series or season." },
      { status: 400 },
    );
  try {
    return Response.json(
      await tmdb(`/tv/${id}/season/${Number(season)}`, {}, request.signal),
    );
  } catch (error) {
    return collectionError(error);
  }
}
