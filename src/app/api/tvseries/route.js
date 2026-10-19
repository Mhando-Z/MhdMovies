import { tmdb, collectionError } from "@/lib/tmdbTV";

const categories = {
  trending: "/trending/tv/week",
  popular: "/tv/popular",
  top_rated: "/tv/top_rated",
  on_the_air: "/tv/on_the_air",
};
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const category = params.get("category") || "trending";
  const page = Number(params.get("page") || 1);
  const genre = params.get("genre") || "";
  if (
    !Object.hasOwn(categories, category) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 500 ||
    (genre && !/^\d{1,6}$/.test(genre))
  )
    return Response.json(
      { error: "Please choose a valid category and page." },
      { status: 400 },
    );
  try {
    if (params.get("genres") === "1")
      return Response.json(await tmdb("/genre/tv/list", {}, request.signal));
    const query = { page: String(page), include_adult: "false" };
    if (genre)
      Object.assign(query, { with_genres: genre, sort_by: "popularity.desc" });
    const data = await tmdb(
      genre ? "/discover/tv" : categories[category],
      query,
      request.signal,
    );
    return Response.json({
      ...data,
      results: (data.results || []).filter((item) => !item.adult),
      total_pages: Math.min(data.total_pages || 0, 500),
    });
  } catch (error) {
    return collectionError(error);
  }
}
