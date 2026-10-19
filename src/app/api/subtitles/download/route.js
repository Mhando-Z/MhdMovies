import { getSubtitleDownload, subtitleError } from "@/lib/subtitleProviders";

// POST prevents browser prefetching from spending a provider download allowance.
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid download request." },
        { status: 400 },
      );
    }
    if (!body || !["original", "vtt"].includes(body.format)) {
      return Response.json(
        { error: "Choose a supported subtitle format." },
        { status: 400 },
      );
    }
    const file = await getSubtitleDownload(
      body.token,
      body.format,
      request.signal,
    );
    return new Response(file.bytes, {
      headers: {
        "Content-Type":
          file.extension === "vtt"
            ? "text/vtt; charset=utf-8"
            : "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        ...(Number.isFinite(file.remaining)
          ? { "X-Downloads-Remaining": String(file.remaining) }
          : {}),
      },
    });
  } catch (error) {
    return subtitleError(error);
  }
}
