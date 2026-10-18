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
      id: "vidsrc",
      name: "VidSrc",
      src: `https://vidsrc.to/embed/movie/${id}`,
    },
    {
      id: "superembed",
      name: "SuperEmbed",
      src: `https://multiembed.mov/?${superEmbedParams}`,
    },
    // {
    //   id: "superembed-vip",
    //   name: "SuperEmbed VIP",
    //   src: `https://multiembed.mov/directstream.php?${superEmbedParams}`,
    // },
    {
      id: "vidsrc-cc",
      name: "VidSrc CC",
      src: `https://vidsrc.cc/v2/embed/movie/${id}`,
    },
    ...(tmdb
      ? [
          {
            id: "videasy",
            name: "Videasy",
            src: `https://player.videasy.net/movie/${tmdb}`,
          },
        ]
      : []),
  ];
}
