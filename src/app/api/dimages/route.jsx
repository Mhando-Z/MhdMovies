import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const filename = searchParams.get("filename");

    // Only allow valid TMDB image paths.
    if (!path || !/^\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(path)) {
      return NextResponse.json(
        { error: "Invalid image path" },
        { status: 400 },
      );
    }

    const imageUrl = `https://image.tmdb.org/t/p/original${path}`;

    const response = await fetch(imageUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve image");
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";

    if (!contentType.startsWith("image/")) {
      throw new Error("Invalid image response");
    }

    const safeFilename = (
      filename || `tmdb-image${path.slice(path.lastIndexOf("."))}`
    )
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .slice(0, 150);

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Image download error:", error);

    return NextResponse.json(
      { error: "Unable to download image" },
      { status: 500 },
    );
  }
}
