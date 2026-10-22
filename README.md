# MhdMovies

A movie, TV series, and anime discovery app built with Next.js and React. Browse titles, explore cast and actor filmographies, watch trailers, select external playback sources, and find subtitles in a responsive dark interface.

The app combines TMDB movie and television data with a multi-provider anime catalogue. Server API routes support TV, people, anime, search, and subtitles. Anime watchlists and playback preferences are stored locally in the browser.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Commands and tests](#commands-and-tests)
- [Application routes](#application-routes)
- [API routes](#api-routes)
- [Project structure](#project-structure)
- [Data and playback](#data-and-playback)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Development notes](#development-notes)
- [Further documentation](#further-documentation)

## Features

### Movies

- Browse featured, trending, and upcoming movies on the homepage.
- Explore details, ratings, release information, reviews, similar movies, and cast and crew.
- View artwork galleries and watch YouTube trailers through Vidstack.
- Choose between external embed players, with the selected source remembered on the device.
- Access full-movie playback controls for released titles; trailers remain available before release.
- Search subtitles by language, filter results by release name or SDH, and download original files or convert SRT to WebVTT.

### TV series

- Discover trending, popular, top-rated, and currently airing shows, with genre browsing and pagination.
- Explore show details, cast, reviews, recommendations, seasons, and individual episodes.
- View optional next/previous episode information from TVmaze, including UTC and local time when a timestamp is available.
- Play aired episodes and search for episode-specific subtitles. Season zero is preserved as Specials.

### Anime and donghua

- Browse seasonal, popular, top-rated, upcoming, and movie collections.
- Search and filter the catalogue, with MyAnimeList, Jikan, and AniList providing complementary data paths.
- View related titles, recommendations, episode metadata, and optional TMDB logos and landscape artwork.
- Save a watchlist and continue-watching records in browser storage.
- Select supported sub/dub embed sources, with progress tracking and optional auto-next where the provider supports them.
- Reuse cached public metadata during some upstream failures, with bounded memory and disk caches.

### Actors and search

- Browse popular and trending actors or search by name.
- Explore biographies, portraits, and combined movie/TV filmographies with filtering and sorting.
- Search movies and TV series from the navigation bar using the search button or `Ctrl+K` / `Cmd+K`.

## Technology

| Area | Implementation |
| --- | --- |
| Framework | Next.js 16.4.2, App Router, JavaScript/JSX |
| UI | React 19.3.0, Tailwind CSS 4, CSS Modules, and custom CSS |
| Build tooling | Turbopack and React Compiler |
| Video | Vidstack for trailers/direct media; iframes for external embed players |
| Interaction | Swiper, Framer Motion, Lucide React, and React Icons |
| State | React Context, component hooks, and browser storage |
| Tests | Node.js built-in test runner |

Versions above reflect `package.json`. The Next.js configuration also enables Cache Components and partial prefetching.

## Getting started

### 1. Prepare your environment

Use **Node.js 24.14 or newer** for the documented development and test workflow, along with npm. The installed Next.js package itself accepts Node.js 20.9+, but the anime tests use `node:module` registration hooks that are unavailable in older Node releases.

You will need a TMDB API Read Access Token for movie, television, and actor data. A MyAnimeList client ID enables the primary anime catalogue. Subtitle provider keys are optional.

### 2. Install dependencies

From the repository root:

```bash
npm ci
```

This uses `package-lock.json`. If you intentionally change dependencies, use `npm install` and include the resulting lockfile changes.

### 3. Configure local credentials

Create `.env.local` in the project root, alongside `package.json`:

```dotenv
# Required by the existing browser-side movie integrations.
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_api_read_access_token

# Used by server-side TV, people, search, and anime artwork requests.
TMDB_ACCESS_TOKEN=your_tmdb_api_read_access_token

# Enables the primary MyAnimeList catalogue.
MAL_CLIENT_ID=your_myanimelist_client_id

# Optional: configure either or both subtitle providers.
# SUBDL_API_KEY=your_subdl_api_key
# OPENSUBTITLES_API_KEY=your_opensubtitles_api_key
```

The TMDB values are bearer/read-access tokens, without a `Bearer ` prefix. Setting both TMDB variables to the same token supports the current client and server integrations. Server routes fall back to `NEXT_PUBLIC_TMDB_ACCESS_TOKEN` when `TMDB_ACCESS_TOKEN` is absent; setting only the server variable does not configure the existing movie pages.

`NEXT_PUBLIC_` values are included in browser bundles. Keep MAL and subtitle credentials in their server-only variables. Environment files are ignored by Git.

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Restart the development server after changing environment variables.

On Windows PowerShell, use `npm.cmd` in place of `npm` if PowerShell blocks the npm script shim, for example `npm.cmd run dev`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_TMDB_ACCESS_TOKEN` | Required for the current browser-side movie catalogue, movie details, and title-image requests. Also accepted as a fallback by server TMDB integrations. |
| `TMDB_ACCESS_TOKEN` | Preferred server-only token for TV series, actors, shared search, and anime artwork. |
| `MAL_CLIENT_ID` | Server-only MyAnimeList client ID for the primary anime catalogue. Visitor OAuth and a client secret are not required for public browsing. |
| `MYANIMELIST_ID` | Existing fallback name for `MAL_CLIENT_ID`. |
| `SUBDL_API_KEY` | Enables SubDL as the primary subtitle provider. |
| `OPENSUBTITLES_API_KEY` | Enables OpenSubtitles, used when SubDL fails or returns no results. Also works independently. |
| `OPEN_SUBS_APIKEYS` | Existing fallback name for `OPENSUBTITLES_API_KEY`. |
| `ANIME_CACHE_DIR` | Optional writable directory for anime metadata cache files. Defaults to `.next/cache/anime-v2`. |
| `ANIME_TMDB_MAPPINGS` | Optional JSON object of explicit anime-to-TMDB mappings for title artwork. |
| `ANIME_BANGUMI_MAPPINGS` | Optional JSON object of verified anime-to-Bangumi subject mappings. |

An example TMDB artwork override:

```dotenv
ANIME_TMDB_MAPPINGS={"mal-16498":{"type":"tv","id":1429}}
```

Use verified IDs when adding mappings. See [the anime guide](docs/anime.md) for legacy ID handling and mapping details.

## Commands and tests

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve an existing production build. |
| `node --test tests/*.test.mjs` | Run all automated test suites. |

Individual suites can be run directly:

```bash
node --test tests/movieSources.test.mjs
node --test tests/subtitles.test.mjs
node --test tests/tvseries.test.mjs
node --test tests/people.test.mjs
node --test tests/anime.test.mjs
```

The suites cover movie provider URLs, release rules, subtitle conversion and signed downloads, TV episode handling, actor credit processing, and anime IDs, filtering, provider fallback, and caching. Upstream responses are mocked where applicable; passing tests do not establish live provider availability.

There are currently no `npm test` or lint scripts. For UI changes, also check the affected pages in a browser at desktop and mobile widths.

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Main movie discovery page. |
| `/movies/[id]` | Movie details and playback using a numeric TMDB movie ID. |
| `/series` | Canonical TV series catalogue. |
| `/series/[id]` | Show details, seasons, and episodes using a TMDB TV ID. |
| `/tvseries` | Compatibility entry point rendering the TV catalogue. |
| `/anime` | Anime catalogue and local library. |
| `/anime/[id]` | Anime details; new links use `mal-<MyAnimeList ID>`. |
| `/anime/[id]/watch?episode=1&audio=sub` | Anime episode player. |
| `/actors` | Actor directory and search. |
| `/actors/[id]` | Actor profile and filmography using a TMDB person ID. |

`/movies` currently contains a placeholder; use `/` for movie browsing. Numeric anime URLs are legacy **AniList** IDs, not MyAnimeList IDs. For example, `/anime/mal-20` explicitly identifies a MAL title.

## API routes

These route handlers belong to the application and support its UI.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/search?query=naruto&type=all&page=1` | Movie/TV search. `type` accepts `all`, `movie`, or `tv`. |
| `GET` | `/api/tvseries` | TV collections, discovery, genres, and pagination. |
| `GET` | `/api/tvseries/[id]` | Show details and optional supporting data. |
| `GET` | `/api/tvseries/[id]/season/[season]` | Episodes for the requested season. |
| `GET` | `/api/tvseries/[id]/schedule` | Optional TVmaze schedule matched through external IDs. |
| `GET` | `/api/actors?mode=popular&page=1` | Actor directory; also accepts `mode=trending` and `query`. |
| `GET` | `/api/actors/[id]` | Actor profile and supporting data. |
| `GET` | `/api/anime?view=home` | Anime homepage collections. Other queries browse the catalogue. |
| `GET` | `/api/anime/[id]/episodes` | Anime episode metadata. |
| `GET` | `/api/anime/[id]/logo` | Optional TMDB title artwork. |
| `GET` | `/api/anime/[id]/chinese` | Optional Bangumi enrichment for explicitly mapped titles. |
| `GET` | `/api/subtitles?tmdb_id=550&language=en` | Movie subtitle search. |
| `GET` | `/api/subtitles?tmdb_id=1399&type=tv&season=1&episode=1&language=en` | Episode subtitle search. |
| `POST` | `/api/subtitles/download` | Download using a signed search-result token and `format` of `original` or `vtt`. |

## Project structure

```text
src/
  app/
    layout.js              # Shared layout, metadata, navigation, and analytics
    page.js                # Movie homepage
    globals.css            # Global styles and font imports
    movies/                # Movie routes
    series/                # Canonical TV routes
    tvseries/              # Compatibility TV entry point
    anime/                 # Anime catalogue, details, and watch routes
    actors/                # Actor directory and profiles
    api/                   # Server route handlers
  components/
    pages/                 # Movie homepage, details, dialogs, and subtitles
    tvSeries/              # TV catalogue, hero, and detail components
    anime/                 # Anime UI, local library, and resource hooks
    actors/                # Actor directory and profile UI
    Swipper/               # Shared carousel components
    moviePlayer.jsx        # Embed/direct-media source selection
    vidstackPlayer.jsx     # Native video and trailer player
  context/                 # Movie and TV React Context providers
  lib/
    anime/                 # Catalogue adapters, transport, cache, and ID models
    movieSources.js        # Movie embed URL adapters
    tmdbTV.js              # Server-side TMDB TV and TVmaze access
    tmdbPeople.js          # Server-side TMDB people access
    subtitleProviders.js   # Subtitle providers and download handling
    subtitleUtils.js       # Subtitle parsing/conversion helpers
docs/                      # Feature-specific integration notes
tests/                     # Node.js test suites
public/                    # Static assets
```

The `@/*` import alias resolves to `src/*` through `jsconfig.json`.

## Data and playback

**Metadata:** TMDB supplies movies, TV series, people, and images. MyAnimeList is the primary anime catalogue, with Jikan and AniList offering fallback or complementary queries. Jikan and ani.zip supply episode metadata. TVmaze supplies optional schedule information. Bangumi enrichment requires explicit mappings.

**Player behavior:** External movie, TV, and anime sources return HTML players mounted in iframes after a Play action. Their subtitle, quality, and seek controls belong to the provider. An iframe loading successfully does not confirm that a title is available or playing. Vidstack handles YouTube trailers and can also accept directly hosted MP4, HLS, or DASH sources through the existing player components.

**Subtitles:** SubDL is tried before OpenSubtitles when both are configured. Downloads require a signed token from a search result, validate provider hosts and redirects, and enforce a 5 MiB file limit. Search tokens expire after one hour. Downloaded subtitle files are separate from external embeds; they are not injected into those players. ZIP archives remain ZIP files.

**Local library:** Anime watchlist and continue-watching entries are stored under `mhd:anime-library:v1`, limited to 100 records. They remain on the current browser/device and do not sync through an account. Playback preferences also use browser storage. Detailed progress tracking is available only for providers with a supported event contract; anime auto-next is opt-in.

**Caching:** Anime transport coalesces identical requests, spaces upstream requests by host, and uses timeouts, cooldowns, and bounded caches. Disk caching improves reuse on writable hosts, but it is not a shared database. Cold-cache requests still depend on an upstream service.

## Deployment

Deploy to a host that supports Next.js server execution, such as Vercel or a Node.js server. This app uses route handlers and server-only integrations, so it requires server functionality.

For a local production run:

```bash
npm run build
npm start
```

Configure the environment variables on the deployment platform before building. `NEXT_PUBLIC_TMDB_ACCESS_TOKEN` is included at build time, so changing it requires a rebuild. Keep server-only credentials in the platform's environment settings.

For self-hosted anime cache persistence, set `ANIME_CACHE_DIR` to a writable persistent volume. On read-only or ephemeral hosts, the transport falls back to memory and the Next.js fetch cache; local files do not provide persistence across deployments or coordination between instances.

Before deploying your own instance, review the site URL, metadata, structured data, and Google Analytics ID in `src/app/layout.js`. Shared logo URLs are also referenced in the layout, navbar, and footer. The existing Supabase URLs serve public images; no Supabase account or database setup is required by the current application code.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Movie pages are empty or report authentication errors | Set `NEXT_PUBLIC_TMDB_ACCESS_TOKEN` to a TMDB API Read Access Token, then restart locally or rebuild the deployment. |
| TV, actor, or shared search requests fail | Check `TMDB_ACCESS_TOKEN` or its public fallback and inspect the failed API response. |
| Anime collections are slow or incomplete | Check the MAL client ID and upstream availability. Fallback providers have their own limits; cold-cache requests need network access. |
| An anime title has text instead of a logo | Artwork is optional. Check TMDB credentials or a verified mapping; ambiguous matches intentionally keep the text title. |
| No subtitle results or downloads fail | Configure at least one subtitle provider and check language, title/episode selection, provider quotas, and token expiry. Search again if a token has expired. |
| A player opens but no video plays | Try another source. Provider coverage, framing policies, ads, and service availability are controlled externally. |
| A future title or episode has no Play action | Movie release status/date and known episode air dates gate playback. Missing dates are not treated as proof of release. |
| A watchlist or source preference is not remembered | Check whether the browser allows local storage. Saved data is specific to that browser and device. |
| Anime tests fail on `registerHooks` | Run the tests with the documented Node.js version. |
| PowerShell refuses to run `npm.ps1` | Use `npm.cmd`, for example `npm.cmd run build`. |

## Development notes

- Follow the repository's [AGENTS.md](AGENTS.md). Before changing Next.js code, read the relevant guide shipped in `node_modules/next/dist/docs/`; this project explicitly requires checking the installed version's conventions.
- Keep provider-specific URL construction and ID handling in the existing library modules.
- Preserve the distinction between TMDB movie/TV IDs and MAL/AniList anime IDs.
- Keep optional artwork, schedules, and enrichment independent of primary title data so those failures do not block a page.
- Run the affected test suites and a production build for application changes. Check loading, empty, error, and mobile states when changing UI behavior.

## Further documentation

- [Movie details, playback sources, and subtitle downloads](docs/movie-playback.md)
- [TV series data, schedules, and episode playback](docs/tv-series.md)
- [Anime catalogue, provider IDs, caching, and local library](docs/anime.md)

These guides contain implementation details, provider references, and feature-specific checks.
