export function isEpisodeReleased(episode, now = new Date()) {
  if (
    !episode?.air_date ||
    !Number.isInteger(episode.episode_number) ||
    episode.episode_number < 1
  ) {
    return false;
  }

  const date = new Date(`${episode.air_date}T00:00:00Z`);

  return Number.isFinite(date.getTime()) && date <= now;
}

// Provider IDs belong to separate catalogues;
// application routes use TMDB IDs.
export function getTvSources(series, season, episode) {
  if (
    !Number.isInteger(season) ||
    season < 0 ||
    !Number.isInteger(episode) ||
    episode < 1
  ) {
    return [];
  }

  const tmdb = /^[1-9]\d*$/.test(String(series?.id)) ? String(series.id) : null;

  const imdb = /^tt\d+$/.test(series?.imdb_id ?? "") ? series.imdb_id : null;

  const id = imdb || tmdb;

  if (!id) return [];

  const params = new URLSearchParams({
    video_id: id,
    s: String(season),
    e: String(episode),
  });

  if (!imdb) params.set("tmdb", "1");

  const vidfastParams = new URLSearchParams({
    autoPlay: "false",
    title: "true",
    poster: "true",
    theme: "dc2626",
    nextButton: "true",
    autoNext: "false",
  });

  return [
    {
      id: "vidsrc",
      name: "VidSrc",
      src: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
    },
    {
      id: "vidfast",
      name: "VidFast",
      src: `https://vidfast.vc/tv/${id}/${season}/${episode}?${vidfastParams}`,
    },
    {
      id: "superembed",
      name: "SuperEmbed",
      src: `https://multiembed.mov/?${params}`,
    },
    {
      id: "vidsrc-sh",
      name: "VidSrc SH",
      src: `https://vidsrc.sh/embed/tv/${id}/${season}/${episode}`,
    },
    {
      id: "vidsrc-link",
      name: "VidSrc Link",
      src: `https://vidsrc.link/embed/tv/${id}/${season}/${episode}`,
    },
    {
      id: "vidsrc-pk",
      name: "VidSrc PK",
      src: `https://embed.vidsrc.pk/tv/${id}/${season}/${episode}`,
    },
    {
      id: "videasy",
      name: "Videasy",
      src: `https://player.videasy.net/tv/${id}/${season}/${episode}/`,
    },
    {
      id: "vidsrc-embed",
      name: "VidSRC",
      src: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
    },
    {
      id: "vidfast-pro",
      name: "VidFast Pro",
      src: `https://vidfast.pro/tv/${id}/${season}/${episode}?${vidfastParams}`,
    },
  ];
}
