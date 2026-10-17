"use client";

import { useState } from "react";

const logoRequests = new Map();

export function preloadMovieLogo(movieId) {
  if (!logoRequests.has(movieId)) {
    const request = fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/images?include_image_language=en,null`,
      {
        signal: AbortSignal.timeout(10000),
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        },
      },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load movie logos");
        const data = await response.json();
        const logos = (data.logos ?? []).filter((logo) => logo.file_path);
        // Prefer English artwork, then artwork without a language assigned.
        logos.sort(
          (a, b) =>
            Number(b.iso_639_1 === "en") - Number(a.iso_639_1 === "en") ||
            (b.vote_average ?? 0) - (a.vote_average ?? 0) ||
            (b.width ?? 0) - (a.width ?? 0),
        );
        const logo = logos[0];
        if (!logo) return null;

        const src = `https://image.tmdb.org/t/p/original${logo.file_path}`;
        // Cache the decoded image as well as its metadata, so slides can render
        // their title immediately without starting another image request.
        await new Promise((resolve, reject) => {
          const image = new Image();
          const timeout = setTimeout(() => finish(new Error("Logo load timed out")), 10000);
          const finish = (error) => {
            clearTimeout(timeout);
            image.onload = null;
            image.onerror = null;
            if (error) reject(error);
            else resolve();
          };
          image.onload = () => {
            image.decode().then(() => finish(), finish);
          };
          image.onerror = () => finish(new Error("Unable to load logo image"));
          image.src = src;
        });

        return { ...logo, src };
      })
      .catch((error) => {
        logoRequests.delete(movieId);
        throw error;
      });
    logoRequests.set(movieId, request);
  }

  return logoRequests.get(movieId);
}

export default function MovieTitle({ movie, titleStyle, logo: preloadedLogo }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const logo = preloadedLogo?.src !== failedSrc ? preloadedLogo : null;

  return (
    <h1
      style={logo ? undefined : titleStyle.font.style}
      className={
        logo
          ? "w-full max-w-[480px] lg:max-w-[560px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]"
          : `${titleStyle.className} text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl line-clamp-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]`
      }
    >
      {logo ? (
        <img
          src={logo.src}
          alt={movie.title}
          width={logo.width}
          height={logo.height}
          className="h-auto max-h-[180px] w-auto max-w-full object-contain object-left lg:max-h-[220px]"
          onError={() => setFailedSrc(logo.src)}
        />
      ) : (
        movie.title
      )}
    </h1>
  );
}
