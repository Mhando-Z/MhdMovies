# Anime and donghua

Routes: `/anime`, `/anime/[anilistId]`, and `/anime/[anilistId]/watch?episode=1&audio=sub`.

All new UI styling uses Tailwind utilities. No additional packages or CSS files are required.

## Data

- AniList supplies the main catalog and explicit MAL IDs. Requests are server-side, cached for 15 minutes, and time out after 15 seconds. Filters are validated and passed as GraphQL variables.
- Jikan supplies paginated episode names and dates. Its failure does not disable titles with a known broadcast episode count. Unconfirmed episode dates do not enable playback.
- TMDB optionally supplies title logos on anime details through `/api/anime/[anilistId]/logo`, using the existing `TMDB_ACCESS_TOKEN` (preferred) or `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`. Searches match animation titles/aliases, origin, and release year (within one year), rejecting ambiguous results. Movies use TMDB movies; other formats use TV series. Logos prefer English, then untagged, then the native language. Missing matches, credentials, service errors, or broken images keep the text title. For verified matches or sequels grouped differently by TMDB, set `ANIME_TMDB_MAPPINGS` to a JSON object such as `{"16498":{"type":"tv","id":1429}}` (AniList ID to TMDB type and ID). TMDB requests use the existing five-minute fetch cache.
- Bangumi enrichment is optional. Set `ANIME_BANGUMI_MAPPINGS` in `.env.local` to a JSON object whose keys are AniList IDs and values are **verified** Bangumi subject IDs. Example shape: `{"<anilist-id>": <bangumi-subject-id>}`. No mappings are guessed from names. Without this variable, native Chinese titles still come from AniList.
- Review upstream usage terms before public/commercial deployment: https://docs.anilist.co/guide/terms-of-use, https://jikan.moe/, https://github.com/bangumi/api.

## Players

Zokoanime, NikaStream, and AniLink each have an independent URL adapter. Only one iframe mounts after an explicit Play action. Source selection persists on the device. Catalog presence and a valid URL do not establish stream availability; title/episode/sub/dub coverage must be checked against each provider.

NikaStream's documented message contract supports progress, completion, and errors. Events must match the active iframe window, origin, media ID, episode, and audio. Other providers do not claim progress support. Auto-next is opt-in and requires a completion event and a known broadcast next episode. Cross-provider seeking is not implemented.

SupaPlay is intentionally not enabled: its provider-specific IDs have no verified mapping to this catalog.

Watchlist and continue-watching records are stored locally under `mhd:anime-library:v1` (up to 100 entries); they do not sync across devices. Playback remains usable when storage is blocked.

## Checks

Run `node --test tests/anime.test.mjs` and `npm.cmd run build` on Windows. Provider contract, mapping, date gating, upstream error handling, and input validation tests use mocked responses; these do not certify third-party playback uptime.
