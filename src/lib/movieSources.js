// Embed pages are HTML players, not video/HLS URLs for Vidstack.
// Provider references and integration limits: docs/movie-playback.md.
export function getMovieSources(movie) {
  const tmdb = /^[1-9]\d*$/.test(String(movie?.id)) ? String(movie.id) : null;
  const imdb = /^tt\d+$/.test(movie?.imdb_id ?? "") ? movie.imdb_id : null;
  const id = imdb || tmdb;
  if (!id) return [];

  const superEmbedParams = new URLSearchParams({ video_id: id });
  if (!imdb) superEmbedParams.set("tmdb", "1");

  return [
    {
      id: "vidfast",
      name: "VidFast",
      src: `https://vidfast.vc/movie/${id}?autoPlay=false&title=true&poster=true&theme=dc2626`,
    },
    {
      id: "vidfastPro",
      name: "VidFast",
      src: `https://vidfast.pro/movie/${id}?autoPlay=false&title=true&poster=true&theme=dc2626`,
    },
    {
      id: "vidsrc",
      name: "VidSrc",
      src: `https://vidsrc.to/embed/movie/${id}`,
    },
    {
      id: "superembed",
      name: "SuperEmbed",
      src: `https://multiembed.mov/?${superEmbedParams}`,
    },
    {
      id: "vidsrc-sh",
      name: "VidSrc SH",
      src: `https://vidsrc.sh/embed/movie/${id}`,
    },
    {
      id: "vidsrc-link",
      name: "VidSrc Link",
      src: `https://vidsrc.link/embed/movie/${id}`,
    },
    {
      id: "vidsrc-pk",
      name: "VidSrc PK",
      src: `https://embed.vidsrc.pk/movie/${id}`,
    },
    ...(tmdb
      ? [
          {
            id: "videasy",
            name: "Videasy",
            src: `https://player.videasy.to/movie/${tmdb}`,
          },
        ]
      : []),
  ];
}
