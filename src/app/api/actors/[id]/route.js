import { fetchPeople, peopleError } from "@/lib/tmdbPeople";

export async function GET(request, { params }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) return Response.json({ error: "Actor not found." }, { status: 404 });
  try {
    const [details, credits, images, external] = await Promise.allSettled([
      fetchPeople(`/person/${id}`, {}, request.signal),
      fetchPeople(`/person/${id}/combined_credits`, {}, request.signal),
      fetchPeople(`/person/${id}/images`, {}, request.signal),
      fetchPeople(`/person/${id}/external_ids`, {}, request.signal),
    ]);
    if (details.status === "rejected") throw details.reason;
    const value = (result) => result.status === "fulfilled" ? result.value : null;
    return Response.json({ ...details.value,
      combined_credits: value(credits), images: value(images), external_ids: value(external),
      unavailable: [credits.status === "rejected" && "filmography", images.status === "rejected" && "photos",
        external.status === "rejected" && "external links"].filter(Boolean),
    });
  } catch (error) {
    return peopleError(error);
  }
}
