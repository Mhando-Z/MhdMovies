import { fetchPeople, peopleError } from "@/lib/tmdbPeople";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("query") || "").trim().slice(0, 200);
  const page = Number(params.get("page") || 1);
  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return Response.json({ error: "Please choose a page between 1 and 500." }, { status: 400 });
  }
  const mode = params.get("mode") === "trending" ? "trending" : "popular";
  try {
    const data = await fetchPeople(query ? "/search/person" : mode === "trending"
      ? "/trending/person/week" : "/person/popular", {
      page: String(page), include_adult: "false", ...(query ? { query } : {}),
    }, request.signal);
    return Response.json({ ...data, total_pages: Math.min(data.total_pages || 0, 500),
      // People lists also contain directors, writers and other crew members.
      results: (data.results ?? []).filter((person) => person.known_for_department === "Acting" && !person.adult),
    });
  } catch (error) {
    return peopleError(error);
  }
}
