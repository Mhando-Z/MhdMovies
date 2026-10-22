# Anime and donghua

Routes: `/anime`, `/anime/[id]`, and `/anime/[id]/watch?episode=1&audio=sub`.

New catalog entries use `mal-<MyAnimeList ID>` (for example `/anime/mal-20`). Existing numeric URLs remain **AniList IDs**. ani.zip resolves explicit AniList-to-MAL pairs for legacy links; AniList is the fallback if no verified pair is available. MAL IDs are never substituted for AniList IDs. Existing saved entries remain readable.

All new UI styling uses Tailwind utilities. No additional packages or CSS files are required.

## Data

- **MyAnimeList v2** is the primary catalog. Set server-only `MAL_CLIENT_ID` or use the existing `MYANIMELIST_ID`. Public browsing sends `X-MAL-CLIENT-ID` from the server; the client secret is not needed and visitor OAuth is not required. Search, details, seasonal lists, airing/popular/top/upcoming/movie rankings, related titles, recommendations, and broadcast information use MAL endpoints. Search is ordered by relevance. The hero features popular titles in the current UTC calendar season, including ongoing shows returned by MAL; it is not labelled as a live trending chart.
- **Jikan** is the independent access path for MAL search/details and exact genre, format, status, and year filtering. If Jikan fails, advanced filters operate on a bounded MAL shortlist of 100 candidates and visibly disclose that scope. Year-filter fallback uses the current quarter of the requested year. MAL search does not pretend to support arbitrary filters or a relevance-independent sort. Country-of-origin URLs still use AniList because neither MAL nor Jikan supplies reliable country metadata; no origin is guessed from names or ONA format.
- **AniList** remains a catalog fallback when MAL/Jikan cannot serve a request, and serves origin filters. GraphQL filters remain validated variables. A failed optional service does not gate the MAL homepage or details.
- **Jikan** supplies paginated episode names and dates, with **ani.zip** episode metadata as fallback. Only explicit episode timestamps confirm playback for ongoing titles. Missing episode dates are not guessed from the total planned count, schedule weekday, or title. Finished titles with a known episode count remain usable without either episode service.
- **TMDB** optionally supplies title logos and landscape artwork through `/api/anime/[id]/logo`, using `TMDB_ACCESS_TOKEN` (preferred) or `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`. The hero and details share the same title component. Strict matching checks titles/aliases, release year (within one year), animation genre, and origin when known; ambiguous matches are rejected. Movies use TMDB movies; other formats use TV. Logos prefer English, then untagged, then native language. Missing credentials, matches, service errors, and broken logos keep the text title. Overrides accept explicit route keys, e.g. `ANIME_TMDB_MAPPINGS={"mal-16498":{"type":"tv","id":1429}}`; existing numeric AniList overrides also work for legacy entries.
- **Bangumi** enrichment remains optional. `ANIME_BANGUMI_MAPPINGS` maps explicit route keys to **verified** Bangumi subject IDs, e.g. `{"mal-12345":67890}`. This is an example shape, not a verified pair. Legacy AniList keys are supported. Mappings are not guessed from translated names.
- Upstream references: https://myanimelist.net/apiconfig/references/api/v2, https://docs.anilist.co/guide/terms-of-use, https://docs.api.jikan.moe/, https://api.ani.zip/mappings?anilist_id=16498, https://github.com/bangumi/api.

## Availability and performance

`src/lib/anime/transport.js` coalesces identical requests, serializes requests per upstream host with at least one second between starts, and applies an eight-second network timeout. Authentication errors, throttling, and service failures open a short circuit; rate-limit cooldown honors numeric `Retry-After` up to five minutes. Limits apply per running server process, not globally across deployment instances.

Successful public responses have a 15-minute fresh window (one hour for details/episode mappings and one day for cross-ID mappings) and a maximum seven-day stale window. The cache stores public JSON only, never request headers or credentials. It uses bounded memory (300 responses), Next's persistent fetch cache, and atomic JSON files in `.next/cache/anime-v2` (pruned to 500 files periodically). Failed/malformed responses are not cached, and 404s are not masked by stale records. Cached fallbacks are labelled when detected by the transport. Homepage sections can succeed independently. Browser requests share a bounded one-minute cache; poster links do not prefetch every details page.

For self-hosted persistence across builds, point `ANIME_CACHE_DIR` at a writable persistent volume. The default directory can be cleared by a build. Read-only/serverless hosts degrade to memory and the Next fetch cache; local disk does **not** provide a durable shared database or cross-deployment availability. A shared database/cache adapter is needed for that deployment guarantee. Cold-cache titles and uncached searches still require a working upstream.

Hero controls work without autoplay and remain keyboard accessible. Artwork is optional and requested only for the selected hero title. Collection errors have retry controls. Watchlist buttons share persistent browser storage across cards, hero, and details, with a single storage subscription and explicit feedback if saving is blocked.

## Players

Zokoanime, NikaStream, and AniLink each have an independent URL adapter. MAL-only entries use the two MAL-capable sources. AniLink appears only when an explicit AniList ID exists. Only one iframe mounts after an explicit Play action. Source selection persists on the device. Catalog presence and a valid URL do not establish stream availability; title/episode/sub/dub coverage must be checked against each provider.

NikaStream's documented message contract supports progress, completion, and errors. Events must match the active iframe window, origin, media ID, episode, and audio. Other providers do not claim progress support. Auto-next is opt-in and requires a completion event and a known broadcast next episode. Cross-provider seeking is not implemented.

SupaPlay is intentionally not enabled: its provider-specific IDs have no verified mapping to this catalog.

Watchlist and continue-watching records are stored locally under `mhd:anime-library:v1` (up to 100 entries); they do not sync across devices. Playback remains usable when storage is blocked.

## Checks

Run `node --test tests/anime.test.mjs` and `npm.cmd run build` on Windows. Tests cover provider IDs, legacy mappings, filtering, adult exclusion, release gating, provider failover, cooldown/recovery, request deduplication, and cache persistence without credentials. Upstream responses are mocked; these do not certify third-party uptime. Browser smoke checks should cover hero navigation and logo fallback, Naruto search/details, watchlist persistence, episode links, and mobile overflow.
