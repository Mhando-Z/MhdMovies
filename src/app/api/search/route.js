import { tmdb, collectionError } from "@/lib/tmdbTV";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("query") || "").trim().slice(0, 200);
  const type = params.get("type") || "all";
  const page = Number(params.get("page") || 1);
  if (
    !["all", "movie", "tv"].includes(type) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 500
  )
    return Response.json({ error: "Invalid search filters." }, { status: 400 });
  if (query.length < 2)
    return Response.json({ results: [], total_pages: 0, page: 1 });
  try {
    const data = await tmdb(
      `/search/${type === "all" ? "multi" : type}`,
      { query, page: String(page), include_adult: "false" },
      request.signal,
    );
    return Response.json({
      ...data,
      total_pages: Math.min(data.total_pages || 0, 500),
      results: (data.results || [])
        .map((item) => ({ ...item, media_type: item.media_type || type }))
        .filter(
          (item) => ["movie", "tv"].includes(item.media_type) && !item.adult,
        ),
    });
  } catch (error) {
    return collectionError(error);
  }
}
