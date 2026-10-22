"use client";

import { useState } from "react";
import { useAnimeResource } from "./useAnimeResource";

export default function AnimeTitle({ anime, artwork, className = "", as: Tag = "h1" }) {
  const resource = useAnimeResource(artwork === undefined ? `/api/anime/${anime.id}/logo` : null);
  const [failed, setFailed] = useState(null);
  const logo = (artwork === undefined ? resource.data : artwork)?.logo;
  return (
    <Tag className={`text-4xl font-extrabold leading-tight tracking-tight md:text-5xl ${className}`}>
      {logo && failed !== logo.url ? (
        <img src={logo.url} alt={anime.title} width={logo.width || 500} height={logo.height || 200}
          onError={() => setFailed(logo.url)}
          className="max-h-32 w-auto max-w-full object-contain object-left drop-shadow-lg md:max-h-40" />
      ) : anime.title}
    </Tag>
  );
}
