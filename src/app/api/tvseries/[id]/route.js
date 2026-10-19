import { tmdb, validId, collectionError } from "@/lib/tmdbTV";

export async function GET(request, { params }) {
  const { id } = await params;
  if (!validId(id))
    return Response.json({ error: "Invalid series ID." }, { status: 400 });
  try {
    const show = await tmdb(`/tv/${id}`, {}, request.signal);
    const resources = [
      "videos",
      "images",
      "aggregate_credits",
      "recommendations",
      "external_ids",
      "reviews",
    ];
    const results = await Promise.allSettled(
      resources.map((resource) =>
        tmdb(
          `/tv/${id}/${resource}`,
          resource === "images" ? { include_image_language: "en,null" } : {},
          request.signal,
        ),
      ),
    );
    results.forEach((result, index) => {
      if (result.status === "fulfilled") show[resources[index]] = result.value;
    });
    return Response.json({
      ...show,
      partialError: results.some((result) => result.status === "rejected"),
    });
  } catch (error) {
    return collectionError(error);
  }
}
