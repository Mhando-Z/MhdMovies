import { tmdb, validId, tvmazeDetails, collectionError } from "@/lib/tmdbTV";

export async function GET(request, { params }) {
  const { id } = await params;
  if (!validId(id))
    return Response.json({ error: "Invalid series ID." }, { status: 400 });
  try {
    const ids = await tmdb(`/tv/${id}/external_ids`, {}, request.signal);
    return Response.json({
      schedule: await tvmazeDetails(ids, request.signal),
    });
  } catch (error) {
    return collectionError(error);
  }
}
