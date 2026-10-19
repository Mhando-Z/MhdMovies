import { animeError, getCatalogue, getHome } from "@/lib/anime/catalogue";

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    return Response.json(
      params.get("view") === "home"
        ? await getHome(request.signal)
        : await getCatalogue(params, request.signal),
    );
  } catch (error) {
    return animeError(error);
  }
}
