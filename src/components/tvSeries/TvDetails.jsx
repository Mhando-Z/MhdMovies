"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Play,
  Star,
  Tv,
} from "lucide-react";
import {
  Artwork,
  formatMovieDate as date,
} from "@/components/pages/movieDetailsUI";
import MoviePlayer from "@/components/moviePlayer";
import MovieSubtitles from "@/components/pages/movieSubtitles";
import MovieModal from "@/components/pages/movieModal";
import { isEpisodeReleased } from "@/lib/tvseries";
import TvSeriesPoster from "./TvSeriesPoster";
import { button, focus, grid, useResource, ResourceError } from "./TvUI";
import SeriesState from "../seriesState";

function Heading({ title, eyebrow }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
        {eyebrow}
      </p>
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
        {title}
      </h2>
    </div>
  );
}

function NextEpisode({ id }) {
  const { data, loading, error, retry } = useResource(
    `/api/tvseries/${id}/schedule`,
  );
  const [localTime, setLocalTime] = useState(false);
  const schedule = data?.schedule;
  const next = schedule?.nextEpisode;
  // Dates are rendered only after this client request, so the viewer's timezone is safe.
  const timestamp = next?.airstamp ? new Date(next.airstamp) : null;
  const hasTime = timestamp && Number.isFinite(timestamp.getTime());
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-400">
        <CalendarDays className="size-4" /> Up next
      </p>
      {loading ? (
        <p role="status" className="text-sm text-white/50">
          Checking episode schedule...
        </p>
      ) : error ? (
        <div>
          <p className="text-sm leading-6 text-white/50">
            Schedule temporarily unavailable.
          </p>
          <button
            type="button"
            onClick={retry}
            className={`mt-2 min-h-11 text-xs text-red-400 ${focus}`}
          >
            Try again
          </button>
        </div>
      ) : next ? (
        <>
          <h3 className="font-semibold">{next.name || "Next episode"}</h3>
          <p className="mt-2 text-xs text-white/50">
            {next.season != null ? `Season ${next.season}` : "Season TBA"} ·{" "}
            {next.number != null ? `Episode ${next.number}` : "Episode TBA"}
          </p>
          <p className="mt-4 text-sm leading-6 text-white/80">
            {hasTime
              ? new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                  ...(localTime ? {} : { timeZone: "UTC" }),
                }).format(timestamp)
              : next.airdate
                ? date(next.airdate)
                : "Date to be announced"}
          </p>
          {hasTime && (
            <button
              type="button"
              onClick={() => setLocalTime((value) => !value)}
              className={`mt-1 min-h-11 text-xs text-white/45 underline decoration-white/20 underline-offset-4 ${focus}`}
            >
              {localTime
                ? "Your local time · Show UTC"
                : "UTC · Show local time"}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm leading-6 text-white/50">
          {schedule?.status === "Ended"
            ? "This series has ended. Explore all available seasons below."
            : "The next episode has not been announced."}
        </p>
      )}
      <a
        href={
          schedule
            ? `https://www.tvmaze.com/shows/${schedule.id}`
            : "https://www.tvmaze.com"
        }
        target="_blank"
        rel="noreferrer"
        className={`mt-4 hidden   text-[10px] text-white/40 underline underline-offset-4 ${focus}`}
      >
        Episode schedule from TVmaze · CC BY-SA
      </a>
    </section>
  );
}

function EpisodeBrowser({ show, suspended }) {
  const seasons = [...(show.seasons || [])].sort((a, b) =>
    a.season_number === 0
      ? 1
      : b.season_number === 0
        ? -1
        : a.season_number - b.season_number,
  );
  const [season, setSeason] = useState(seasons[0]?.season_number ?? null);
  const [selection, setSelection] = useState({ number: null, request: 0 });
  const resource = useResource(
    season == null ? null : `/api/tvseries/${show.id}/season/${season}`,
  );
  const episodes = (resource.data?.episodes || []).map((episode) => ({
    ...episode,
    season_number: season,
  }));
  const selected =
    episodes.find((episode) => episode.episode_number === selection.number) ||
    episodes.find((episode) => isEpisodeReleased(episode)) ||
    episodes[0];
  const selectedIndex = episodes.findIndex(
    (episode) => episode.id === selected?.id,
  );
  const released = isEpisodeReleased(selected);
  function choose(episode) {
    if (!isEpisodeReleased(episode)) return;
    setSelection((previous) => ({
      number: episode.episode_number,
      request: previous.request + 1,
    }));
    document
      .getElementById("episode-screen")
      ?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  return (
    <section
      id="episodes"
      aria-label="Seasons and episodes"
      className="scroll-mt-24 space-y-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading eyebrow="One more episode" title="Seasons & episodes" />
        {seasons.length > 0 && (
          <label className="mb-6 flex items-center gap-3 text-xs text-white/55">
            Season
            <select
              value={season ?? ""}
              onChange={(event) => {
                setSeason(Number(event.target.value));
                setSelection({ number: null, request: 0 });
              }}
              className={`min-h-11 cursor-pointer rounded-lg border border-white/15 bg-zinc-950 px-4 text-sm text-white focus:outline-0`}
            >
              {seasons.map((item) => (
                <option key={item.id} value={item.season_number}>
                  {item.season_number === 0
                    ? "Specials"
                    : item.name || `Season ${item.season_number}`}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {resource.loading ? (
        <div
          role="status"
          className="flex h-56 items-center justify-center rounded-xl bg-white/5 text-sm text-white/50"
        >
          Loading episodes...
        </div>
      ) : resource.error ? (
        <ResourceError message={resource.error} retry={resource.retry} />
      ) : !episodes.length ? (
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/50">
          Episodes have not been announced for this season.
        </p>
      ) : (
        <>
          <div id="episode-screen" className="scroll-mt-24">
            {released ? (
              <MoviePlayer
                key={`${season}-${selected.episode_number}`}
                movie={{
                  ...show,
                  title: `${show.name} · S${String(season).padStart(2, "0")} E${String(selected.episode_number).padStart(2, "0")} · ${selected.name}`,
                  imdb_id: show.external_ids?.imdb_id,
                }}
                episode={selected}
                playRequest={selection.request}
                suspended={suspended}
              />
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-sm text-white/60">
                This episode has not aired yet.{" "}
                {selected.air_date
                  ? `Expected ${date(selected.air_date)}.`
                  : "An air date has not been announced."}
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-white/60">
                <span className="mr-2 text-red-400">
                  E{selected.episode_number}
                </span>
                {selected.name}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={button}
                  disabled={
                    selectedIndex <= 0 ||
                    !isEpisodeReleased(episodes[selectedIndex - 1])
                  }
                  onClick={() => choose(episodes[selectedIndex - 1])}
                >
                  <ChevronLeft className="size-4" />
                  <span className="sr-only sm:not-sr-only">
                    Previous episode
                  </span>
                </button>
                <button
                  type="button"
                  className={button}
                  disabled={!isEpisodeReleased(episodes[selectedIndex + 1])}
                  onClick={() => choose(episodes[selectedIndex + 1])}
                >
                  <span className="sr-only sm:not-sr-only">Next episode</span>
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
          <div
            className="grid max-h-[620px] gap-3 overflow-y-auto rounded-xl p-1 md:grid-cols-2"
            aria-label="Episode list"
          >
            {episodes.map((episode) => {
              const available = isEpisodeReleased(episode);
              const active = selected.id === episode.id;
              return (
                <button
                  key={episode.id}
                  type="button"
                  disabled={!available}
                  onClick={() => choose(episode)}
                  aria-pressed={active}
                  className={`group flex min-w-0 gap-4 rounded-xl border p-3 text-left transition-colors disabled:cursor-not-allowed ${focus} ${active ? "border-red-500/50 bg-red-500/10" : "border-white/10 bg-white/[0.025] hover:bg-white/5"}`}
                >
                  <div className="relative w-28 shrink-0 self-start overflow-hidden rounded-lg sm:w-36">
                    <Artwork
                      path={episode.still_path}
                      className="aspect-video w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      {available ? (
                        <Play className="size-5 fill-white text-white" />
                      ) : (
                        <Clock3 className="size-5 text-white/65" />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">
                      Episode {episode.episode_number}
                      {episode.runtime ? ` · ${episode.runtime} min` : ""}
                    </p>
                    <h3 className="line-clamp-1 text-sm font-semibold">
                      {episode.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">
                      {available
                        ? episode.overview || "No episode overview available."
                        : episode.air_date
                          ? `Expected ${date(episode.air_date)}`
                          : "Air date to be announced"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <MovieSubtitles
            key={`${season}-${selected.episode_number}`}
            movie={{ ...show, title: show.name }}
            episode={selected}
            released={released}
          />
        </>
      )}
    </section>
  );
}

export function TvDetailsLoading() {
  return <SeriesState loading />;
}

export default function TvDetails({ id }) {
  const {
    data: show,
    loading,
    error,
    retry,
  } = useResource(`/api/tvseries/${id}`);
  const [modal, setModal] = useState(null);
  const closeModal = useCallback(() => setModal(null), []);

  if (!show)
    return (
      <div>
        <SeriesState loading={loading} error={error} />
      </div>
    );

  const videos = (show?.videos?.results || [])?.filter(
    (video) => video.site === "YouTube" && /^[\w-]+$/.test(video.key),
  );

  const trailer =
    videos.find((video) => video.type === "Trailer" && video.official) ||
    videos.find((video) => video.type === "Trailer") ||
    videos[0];

  const logos = (show.images?.logos || [])
    .filter((image) => image.iso_639_1 === "en" || !image.iso_639_1)
    .sort(
      (a, b) => Number(b.iso_639_1 === "en") - Number(a.iso_639_1 === "en"),
    );

  const gallery = (show.images?.backdrops || [])?.map(
    (image) => image.file_path,
  );

  const facts = [
    ["Status", show.status],
    ["First aired", date(show.first_air_date)],
    ["Seasons", show.number_of_seasons],
    ["Episodes", show.number_of_episodes],
    ["Created by", show.created_by?.map((person) => person.name).join(", ")],
    ["Networks", show.networks?.map((network) => network.name).join(", ")],
    [
      "Language",
      show.spoken_languages
        ?.map((language) => language.english_name)
        .join(", "),
    ],
  ];
  return (
    <main className="min-h-screen bg-black font-roboto text-white">
      <section className="relative isolate overflow-hidden  ">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Artwork
            path={show.backdrop_path || show.poster_path}
            size="original"
            eager
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/15 to-black/30" />
        </div>
        <div className="px-5 pb-12 pt-28 md:px-10 md:pb-16 md:pt-36 xl:container xl:mx-auto">
          <div className="grid items-end gap-10 md:grid-cols-[210px_1fr] lg:grid-cols-[260px_1fr] lg:gap-14">
            <Artwork
              path={show.poster_path}
              alt={`${show.name} poster`}
              eager
              className="hidden aspect-2/3 w-full rounded-xl object-cover shadow-2xl ring-1 ring-white/15 md:block"
            />
            <div className="max-w-3xl space-y-5">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
                <Tv className="size-4" /> The series collection
              </p>
              <SeriesTitle show={show} logo={logos[0]} />
              {show.tagline && (
                <p className="text-base italic text-white/50">{show.tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-5 text-sm text-white/65">
                <span className="flex items-center gap-2">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <strong className="text-white">
                    {show.vote_average > 0
                      ? show.vote_average.toFixed(1)
                      : "NR"}
                  </strong>
                  <span className="text-xs text-white/35">/ 10</span>
                </span>
                <span>{show.first_air_date?.slice(0, 4)}</span>
                <span>{show.number_of_seasons} seasons</span>
                <span className="rounded border border-white/20 px-2 py-1 text-xs">
                  {show.status}
                </span>
              </div>
              <ul aria-label="Genres" className="flex flex-wrap gap-2">
                {show.genres?.map((genre) => (
                  <li
                    key={genre.id}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
              <p className="max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                {show.overview ||
                  "An overview has not been added for this series."}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#episodes"
                  className={`${button} border-red-600 bg-red-600 hover:bg-red-700`}
                >
                  <Play className="size-4 fill-current" /> Explore episodes
                </a>
                {trailer && (
                  <button
                    type="button"
                    onClick={() => setModal({ type: "video", video: trailer })}
                    className={button}
                  >
                    <Play className="size-4 fill-current" /> Watch trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="space-y-14 px-5 py-12 md:space-y-20 md:px-10 md:py-16 xl:container xl:mx-auto">
        {show.partialError && (
          <ResourceError
            message="Some extras couldn't be loaded. You can still explore this series."
            retry={retry}
          />
        )}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <div className="min-w-0">
            <EpisodeBrowser
              key={show.id}
              show={show}
              suspended={modal?.type === "video"}
            />
          </div>
          <aside className="space-y-6">
            <NextEpisode id={show.id} />
            <section className="rounded-xl border border-white/10 p-5">
              <h2 className="mb-5 text-sm font-semibold">About this series</h2>
              <dl className="space-y-5">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt className="mb-1 text-[11px] text-white/40">{label}</dt>
                    <dd className="text-sm leading-6 text-white/75">
                      {value || "Not available"}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>
        <section>
          <Heading
            eyebrow="The people behind the story"
            title="Meet the cast"
          />
          <div className="flex snap-x gap-4 overflow-x-auto pb-4">
            {(show.aggregate_credits?.cast || []).slice(0, 20).map((person) => (
              <Link
                key={person.id}
                href={`/actors/${person.id}`}
                className={`w-28 shrink-0 snap-start rounded-xl sm:w-36 ${focus}`}
              >
                <Artwork
                  path={person.profile_path}
                  alt={person.name}
                  className="aspect-2/3 w-full rounded-xl object-cover object-top"
                />
                <h3 className="mt-3 text-sm font-medium">{person.name}</h3>
                <p className="mt-1 line-clamp-1 text-xs leading-5 text-white/40">
                  {person.roles
                    ?.map((role) => role.character)
                    .filter(Boolean)
                    .join(" / ")}
                </p>
              </Link>
            ))}
          </div>
          {!show.aggregate_credits?.cast?.length && (
            <p className="text-sm text-white/45">
              Cast information is not available.
            </p>
          )}
        </section>
        {videos.length > 0 && (
          <section>
            <Heading eyebrow="A closer look" title="Trailers & extras" />
            <div className="overflow-y-auto h-104">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videos?.map((video) => (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setModal({ type: "video", video })}
                    className={`group overflow-hidden rounded-xl border border-white/10 text-left ${focus}`}
                  >
                    <div className="relative aspect-video bg-zinc-900">
                      <img
                        src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover opacity-65 transition-opacity group-hover:opacity-90"
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <div className="border bg-black/40 rounded-full hover:border-0 hover:bg-red-600 cursor-pointer border-gray-100  size-12 flex flex-col items-center justify-center">
                          <Play className="size-5 fill-white" />
                        </div>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
        {gallery?.length > 0 && (
          <section>
            <Heading eyebrow="Inside the world" title="Gallery" />
            <div className="overflow-y-auto h-104">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {gallery.map((path, index) => (
                  <button
                    key={path}
                    type="button"
                    aria-label={`Enlarge ${show.name} image ${index + 1}`}
                    onClick={() => setModal({ type: "image", path, index })}
                    className={`overflow-hidden rounded-xl ${focus}`}
                  >
                    <Artwork
                      path={path}
                      size="w780"
                      alt={`${show.name}, scene ${index + 1}`}
                      className="aspect-video w-full object-cover transition-opacity hover:opacity-75"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
        <section>
          <Heading eyebrow="From the audience" title="Reviews" />
          {show.reviews?.results?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {show.reviews.results.slice(0, 4).map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-6"
                >
                  <h3 className="text-sm font-semibold">{review.author}</h3>
                  <p className="mt-4 line-clamp-4 whitespace-pre-line text-sm leading-7 text-white/55">
                    {review.content}
                  </p>
                  <details className="mt-4">
                    <summary
                      className={`cursor-pointer text-xs text-red-400 ${focus}`}
                    >
                      Read full review
                    </summary>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/65">
                      {review.content}
                    </p>
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-white/10 p-6 text-sm text-white/45">
              No audience reviews have been added yet.
            </p>
          )}
        </section>
        {show.recommendations?.results?.length > 0 && (
          <section>
            <Heading eyebrow="Keep discovering" title="More like this" />
            <div className={grid}>
              {show.recommendations.results
                .filter((item) => item.id !== show.id && !item.adult)
                .slice(0, 12)
                .map((item) => (
                  <TvSeriesPoster
                    key={item.id}
                    id={item.id}
                    title={item.name}
                    image={item.poster_path}
                    image2={item.backdrop_path}
                    rating={item.vote_average}
                    overview={item.overview}
                  />
                ))}
            </div>
          </section>
        )}
      </div>
      <MovieModal
        modal={modal}
        closeModal={closeModal}
        movie={{ ...show, title: show.name }}
        gallery={gallery}
        setModal={setModal}
      />
    </main>
  );
}

function SeriesTitle({ show, logo }) {
  const [failed, setFailed] = useState(false);
  return (
    <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
      {logo && !failed ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${logo.file_path}`}
          alt={show.name}
          width={logo.width}
          height={logo.height}
          onError={() => setFailed(true)}
          className="max-h-36 w-auto max-w-full object-contain object-left drop-shadow-lg lg:max-h-44"
        />
      ) : (
        show.name
      )}
    </h1>
  );
}
