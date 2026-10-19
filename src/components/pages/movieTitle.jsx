"use client";

import { useState } from "react";

// Cache requests separately for movies and TV series.
const logoRequests = new Map();

/**
 * Preloads a TMDB movie or TV series logo.
 * @param {"movie" | "tv"} mediaType
 * @param {string | number} id
 */
function preloadLogo(mediaType, id) {
  if (id == null || id === "") {
    return Promise.resolve(null);
  }

  const cacheKey = `${mediaType}:${id}`;

  if (logoRequests.has(cacheKey)) {
    return logoRequests.get(cacheKey);
  }

  let request;

  request = (async () => {
    try {
      const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

      if (!token) {
        throw new Error("TMDB access token is missing");
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${id}/images?include_image_language=en,null`,
        {
          signal: AbortSignal.timeout(10000),
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load ${mediaType} logos: ${response.status}`,
        );
      }

      const data = await response.json();

      const logos = (data.logos ?? [])
        .filter((logo) => logo.file_path)
        .sort(
          (a, b) =>
            Number(b.iso_639_1 === "en") - Number(a.iso_639_1 === "en") ||
            (b.vote_average ?? 0) - (a.vote_average ?? 0) ||
            (b.width ?? 0) - (a.width ?? 0),
        );

      const logo = logos[0];

      if (!logo) {
        return null;
      }

      const src = `https://image.tmdb.org/t/p/original${logo.file_path}`;

      // Preload and decode the image before returning it.
      await new Promise((resolve, reject) => {
        const image = new Image();
        let settled = false;

        const finish = (error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          image.onload = null;
          image.onerror = null;

          if (error) reject(error);
          else resolve();
        };

        const timeout = setTimeout(
          () => finish(new Error("Logo image load timed out")),
          10000,
        );

        image.onload = async () => {
          try {
            if (image.decode) {
              await image.decode();
            }

            finish();
          } catch (error) {
            finish(error);
          }
        };

        image.onerror = () => finish(new Error("Unable to load logo image"));

        image.src = src;

        // Handle images that are already cached by the browser.
        if (image.complete && image.naturalWidth > 0) {
          image.onload();
        }
      });

      return { ...logo, src };
    } catch (error) {
      // Failed requests can be retried later.
      throw error;
    }
  })().catch((error) => {
    if (logoRequests.get(cacheKey) === request) {
      logoRequests.delete(cacheKey);
    }

    throw error;
  });

  logoRequests.set(cacheKey, request);

  return request;
}

export function preloadMovieLogo(movieId) {
  return preloadLogo("movie", movieId);
}

export function preloadSeriesLogo(seriesId) {
  return preloadLogo("tv", seriesId);
}

export default function MovieTitle({ movie, titleStyle, logo: preloadedLogo }) {
  const [failedSrc, setFailedSrc] = useState(null);

  const logo =
    preloadedLogo?.src && preloadedLogo.src !== failedSrc
      ? preloadedLogo
      : null;

  const title = movie?.title || movie?.name || "Untitled";

  const fallbackClassName = [
    titleStyle?.className,
    "text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl",
    "line-clamp-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <h1
      style={logo ? undefined : titleStyle?.font?.style}
      className={
        logo
          ? "w-full max-w-[480px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] lg:max-w-[560px]"
          : fallbackClassName
      }
    >
      {logo ? (
        <img
          src={logo.src}
          alt={title}
          width={logo.width || undefined}
          height={logo.height || undefined}
          loading="eager"
          decoding="async"
          className="h-auto max-h-[180px] w-auto max-w-full object-contain object-left lg:max-h-[220px]"
          onError={() => setFailedSrc(logo.src)}
        />
      ) : (
        title
      )}
    </h1>
  );
}
