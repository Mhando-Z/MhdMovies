# Movie details and playback

`/movies/[id]` accepts a numeric TMDB movie ID. The route awaits Next.js params
inside Suspense and mounts `MovieDetailsProvider` keyed by that ID. Set
`NEXT_PUBLIC_TMDB_ACCESS_TOKEN` in `.env.local` and restart Next.js after changing it.

The context loads details, US release certification, reviews, similar movies,
English/language-neutral logos and backdrops, videos, and cast/crew. Optional
request failures leave the movie usable. Requests time out after 15 seconds and
are cancelled on navigation. Cast profiles load independently so opening a
profile does not replace the entire page with its loading screen.

## Player integration

The public integrations below return **HTML embed players**, not MP4/HLS/DASH
media URLs. They use an iframe. They cannot be supplied as `src` to Vidstack or
controlled by Vidstack's play, subtitle, quality, or seek controls. No scraping,
stream extraction, proxying, or circumvention is implemented.

`VidstackPlayer` provides the native player UI for TMDB's YouTube trailers. It
also accepts MP4, HLS, and DASH media sources. To supply your own movie media,
pass `sources={[{ id: "my-source", name: "My server", src: { src: mediaUrl,
type: "application/x-mpegurl" } }]}` to `MoviePlayer`. Those sources appear in
the same selector and use Vidstack. No sample movie streams are substituted.

The server selector remembers the user's preference when localStorage is
available. Embed requests begin only after Play or Watch now is clicked.
Switching servers or closing the player unmounts the previous iframe. Reload
remounts the selected player. The player also offers an external link for
providers that refuse to be framed. Iframe load events do not prove that a
movie exists or that its video is playing; there is no false availability badge
or automatic failover based on those events.

## Provider references (reviewed October 18, 2026)

| Source | Movie URL | Reference |
| --- | --- | --- |
| VidFast | `https://vidfast.vc/movie/{imdb-or-tmdb}?autoPlay=false&title=true&poster=true&theme=dc2626` | [Documentation on homepage](https://vidfast.vc/) |
| VidSrc | `https://vidsrc.to/embed/movie/{imdb-or-tmdb}` | [API documentation](https://vidsrc.to/#api) |
| SuperEmbed | `https://multiembed.mov/?video_id={id}` | [Installation guide](https://superembed.stream/) |
| SuperEmbed VIP | `https://multiembed.mov/directstream.php?video_id={id}` | [VIP player guide](https://superembed.stream/) |
| VidSrc CC | `https://vidsrc.cc/v2/embed/movie/{imdb-or-tmdb}` | [User-supplied reference](https://vidsrc.cc/v2/embed/movie/tt22084616) |
| Videasy | `https://player.videasy.net/movie/{tmdb}` | [User-supplied reference](https://player.videasy.net/movie/969681) |

For both SuperEmbed modes, numeric TMDB IDs require `&tmdb=1`; IMDb IDs do not.
VIP is the provider's alternate player mode, not an application subscription.
VidFast's autoplay setting is deliberately off until a viewer uses its controls.
Quality and subtitles use each provider's own controls. Provider ads and content
availability remain controlled by the provider.

VidSrc CC and Videasy reference pages could not be fetched by the research tool;
their supplied URL patterns are included as alternatives, with availability
unverified. Do not treat the presence of a source button as an uptime guarantee.

The supplied [UpCloud reference](https://0123movie.space/mv/tt22084616/969681/)
and [Vidmoly reference](https://0123movie.space/vmf/tt22084616/969681/) could not
be fetched and no documented public ID-based API was verified. Those page URLs
are not presented as working API integrations. Add a source to
`src/lib/movieSources.js` when a supported embed endpoint is available.

Additional implementation references:
[TMDB images](https://developer.themoviedb.org/reference/movie-images),
[TMDB appended responses](https://developer.themoviedb.org/docs/append-to-response),
[Vidstack React](https://vidstack.io/docs/player/getting-started/installation/react/),
[Vidstack YouTube provider](https://vidstack.io/docs/player/api/providers/youtube/).
