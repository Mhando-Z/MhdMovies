# TV series

`/series` is the canonical catalogue and `/series/[id]` accepts a TMDB TV ID.
The original TV entry page also renders the catalogue. Actor filmography and
navbar search link to the new local series details pages.

The interface uses Tailwind utilities, the existing black/red movie styling,
shared artwork fallbacks, the existing trailer/gallery dialog, player and
subtitle downloads. No CSS files are added.

## Data

Set `TMDB_ACCESS_TOKEN` on the server. The existing
`NEXT_PUBLIC_TMDB_ACCESS_TOKEN` is accepted as a fallback. New TV and search
requests go through server route handlers and do not send the token to clients.

- `/api/tvseries`: trending, popular, top-rated, on-the-air, genre discovery,
  genre list and pagination. A selected genre browses popular results in that genre.
- `/api/search`: movie/TV/all search. All uses TMDB multi-search and removes
  people and adult results; an individual page may therefore contain fewer results.
- `/api/tvseries/[id]`: primary show information plus independent optional
  images, videos, aggregate credits, recommendations, reviews and external IDs.
- `/api/tvseries/[id]/season/[season]`: fetches only the selected season.
- `/api/tvseries/[id]/schedule`: matches IMDb, then TVDB IDs to TVmaze;
  no automatic title matching. Next/previous episode information is optional.

TMDB requests revalidate after five minutes; TVmaze after one hour. Requests
have timeouts and browser fetches are aborted on navigation/filter changes.
TVmaze failures do not block browsing, playback or subtitle search. A missing
next episode is shown as unannounced, without inferring cancellation. The UI
links to TVmaze and identifies its CC BY-SA data license.

## Episodes and playback

Season zero is retained as Specials. Only episodes with a known air date on or
before today can be played or searched for subtitles. A date without a time
does not guarantee that an episode is already available from an embed provider.
The next-episode panel offers UTC/local time when TVmaze supplies a timestamp.

Episode selection passes the series ID, season and episode to VidSrc and
SuperEmbed. Changing episodes remounts the old player; embeds load only after
an explicit play action. Server switching, reload, close, trailers and fallback
artwork reuse the movie UI. Provider load events do not establish availability.
No scraping, stream extraction or provider availability claims are made.

Episode subtitle searches reuse `/api/subtitles` and the existing signed download
flow. Add `type=tv&season=2&episode=3` with the series `tmdb_id`. SubDL v2 uses
`type=tv`, `season`, `episode`; OpenSubtitles uses `type=episode`,
`parent_tmdb_id`, `season_number`, `episode_number`. Original/VTT downloads,
language selection, pagination, release filtering and SDH filtering are shared
with movies. Changing episodes resets subtitle results. The existing
`SUBDL_API_KEY` and/or `OPENSUBTITLES_API_KEY` (or `OPEN_SUBS_APIKEYS`) are required.

## References

- https://www.tvmaze.com/api
- https://developer.themoviedb.org/reference/tv-series-external-ids
- https://developer.themoviedb.org/reference/search-multi
- https://vidsrc.to/#api
- https://superembed.stream/ (Installation Guide)
- https://subdl.com/developers (v2 subtitle search)
- https://github.com/opensubtitles/mcp.opensubtitles.com (subtitle search parameters)

Live embedded video availability and provider subtitle quotas remain external
to the app and are not guaranteed by the integration.
