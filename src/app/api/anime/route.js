import { animeError, getCatalogue, getHome } from "@/lib/anime/catalogue";

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const data = params.get("view") === "home"
        ? await getHome(request.signal)
        : await getCatalogue(params, request.signal);
    return Response.json(data, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    return animeError(error);
  }
}
