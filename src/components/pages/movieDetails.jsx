"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock3, Play, Star, UserRound } from "lucide-react";
import { useMovieDetails } from "@/context/movieDetailsContext";
import MovieTitle from "./movieTitle";
import MoviePoster from "../moviePoster";
import Loading from "@/app/movies/[id]/loading";
import MovieState from "../movieState";
import MoviePlayer from "../moviePlayer";
import MovieModal from "./movieModal";
import MovieSubtitles from "./movieSubtitles";
import { isMovieReleased } from "@/lib/movieRelease";
import { Artwork, formatMovieDate as date } from "./movieDetailsUI";
//

import {
  Creepster,
  Cinzel,
  Lobster_Two,
  Bricolage_Grotesque,
  Oswald,
} from "next/font/google";

const horrorFont = Creepster({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const sciFiFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});
const fantasyFont = Cinzel({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});
const romanceFont = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});
const actionFont = Oswald({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

/**
 * Title treatments, Netflix-style: each genre gets its own typeface plus
 * casing / tracking tuned to that face. First matching genre wins for movies
 * with multiple genres (order matters). `fallback` is used when nothing matches.
 */
const titleFonts = [
  { genreId: 27, font: horrorFont, className: "tracking-wide" },
  {
    genreId: 878,
    font: sciFiFont,
    className: "uppercase tracking-[0.12em]",
  },
  {
    genreId: 14,
    font: fantasyFont,
    className: "uppercase tracking-[0.08em]",
  },
  { genreId: 10749, font: romanceFont, className: "tracking-normal" },
  {
    genreId: 28,
    font: actionFont,
    className: "uppercase tracking-[0.04em]",
  },
  {
    genreId: 12,
    font: fantasyFont,
    className: "uppercase tracking-[0.08em]",
  },
  {
    genreId: 53,
    font: actionFont,
    className: "uppercase tracking-[0.04em]",
  },
];

const fallbackTitleStyle = {
  font: actionFont,
  className: "uppercase tracking-[0.04em]",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500";
const button = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${focus}`;
const money = (value) =>
  value > 0
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value)
    : "Not reported";
function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
          {eyebrow}
        </p>
        <h2 className="text-xl font-semibold tracking-tight ">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function MovieDetails() {
  const {
    Details: movie,
    Cast,
    Crew,
    Video,
    Image: images,
    Logos,
    Review,
    Similar,
    Loading: loading,
    Error: error,
    PartialError,
    retry,
    CastDetails,
    CastLoading,
    CastError,
    handleCast,
    retryCast,
  } = useMovieDetails();
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [playRequest, setPlayRequest] = useState(0);
  const reduceMotion = useReducedMotion();
  const closeModal = useCallback(() => {
    setModal(null);
    handleCast(null);
  }, [handleCast]);

  if (loading) return <Loading />;
  if (!movie) return <MovieState error={error} onRetry={retry} />;

  const released = isMovieReleased(movie);

  const logoData = [...Logos]
    .filter(
      (item) => item.file_path && (item.iso_639_1 === "en" || !item.iso_639_1),
    )
    .sort(
      (a, b) =>
        Number(b.iso_639_1 === "en") - Number(a.iso_639_1 === "en") ||
        (b.vote_average ?? 0) - (a.vote_average ?? 0),
    )[0];
  const logo = logoData
    ? {
        ...logoData,
        src: `https://image.tmdb.org/t/p/original${logoData.file_path}`,
      }
    : null;
  const videos = Video.filter(
    (item) => item.site === "YouTube" && /^[\w-]+$/.test(item.key),
  );
  const trailer =
    videos.find((item) => item.type === "Trailer" && item.official) ??
    videos.find((item) => item.type === "Trailer") ??
    videos[0];
  const directors = Crew.filter((person) => person.job === "Director");
  const writers = Crew.filter((person) =>
    ["Screenplay", "Writer"].includes(person.job),
  ).filter(
    (person, index, list) =>
      list.findIndex((item) => item.id === person.id) === index,
  );
  const certification = movie.release_dates?.results
    ?.find((item) => item.iso_3166_1 === "US")
    ?.release_dates?.find((item) => item.certification)?.certification;
  const related = Similar.filter((item) => item.id !== movie.id);
  const facts = [
    ["Status", movie.status],
    ["Original title", movie.original_title],
    ["Release date", date(movie.release_date)],
    [
      "Language",
      movie.spoken_languages?.map((item) => item.english_name).join(", "),
    ],
    ["Budget", money(movie.budget)],
    ["Box office", money(movie.revenue)],
    [
      "Production",
      movie.production_companies?.map((item) => item.name).join(", "),
    ],
  ];

  const titleStyle =
    titleFonts.find(
      ({ genreId }) =>
        movie.genres?.some((genre) => genre.id === genreId) ||
        movie.genre_ids?.includes(genreId),
    ) ?? fallbackTitleStyle;

  return (
    <main className="w-full bg-black font-roboto text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Artwork
            path={movie.backdrop_path || movie.poster_path}
            size="original"
            eager
            className="h-full w-full object-cover object-top  "
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/65 to-black/10" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-black/30" />
        </div>
        <div className="xl:mx-auto xl:container px-5 pb-12 pt-24 md:px-10 md:pb-16 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="grid items-end gap-10 md:grid-cols-[210px_1fr] lg:grid-cols-[260px_1fr] lg:gap-14"
          >
            <Artwork
              path={movie.poster_path}
              alt={`${movie.title} poster`}
              eager
              className="hidden aspect-2/3 w-full rounded-xl object-cover shadow-2xl ring-1 ring-white/15 md:block"
            />
            <div className="max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
                The movie collection{" "}
                {certification && (
                  <span className="rounded border border-white/30 px-2 py-1 tracking-normal">
                    {certification}
                  </span>
                )}
              </div>
              <MovieTitle movie={movie} logo={logo} titleStyle={titleStyle} />
              {movie.tagline && (
                <p className="text-base italic text-white/60 md:text-lg">
                  {movie.tagline}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/75">
                <span className="inline-flex items-center gap-2">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <strong className="text-white">
                    {movie.vote_average > 0
                      ? movie.vote_average.toFixed(1)
                      : "NR"}
                  </strong>
                  <span className="text-xs text-white/40">
                    {movie.vote_count > 0
                      ? `/ 10 (${movie.vote_count.toLocaleString("en-US")} votes)`
                      : "No ratings yet"}
                  </span>
                </span>
                {movie.release_date && (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-white/40" />
                    {movie.release_date.slice(0, 4)}
                  </span>
                )}
                {movie.runtime > 0 && (
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="size-4 text-white/40" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                )}
              </div>
              <ul aria-label="Genres" className="flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <li
                    key={genre.id}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
              <p className="max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                {movie.overview ||
                  "An overview has not been added for this movie yet."}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {released && (
                  <button
                    type="button"
                    onClick={() => {
                      setPlayRequest((value) => value + 1);
                      document.getElementById("movie-player")?.scrollIntoView({
                        behavior: reduceMotion ? "instant" : "smooth",
                        block: "start",
                      });
                    }}
                    className={`${button} cursor-pointer bg-red-600 hover:bg-red-700`}
                  >
                    <Play className="size-4 fill-current" /> Watch now
                  </button>
                )}
                <button
                  type="button"
                  disabled={!trailer}
                  onClick={() => setModal({ type: "video", video: trailer })}
                  className={`${button} cursor-pointer border border-white/20 bg-white/5 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  <Play className="size-4 fill-current" />
                  {trailer ? "Watch trailer" : "Trailer unavailable"}
                </button>
              </div>
              {!released && (
                <p className="flex items-center gap-2 text-sm text-amber-200/90">
                  <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                  {movie.status === "Canceled"
                    ? "This movie has been canceled."
                    : movie.release_date && new Date(`${movie.release_date}T00:00:00Z`) > new Date()
                      ? `Coming ${date(movie.release_date)}`
                      : "Release date to be announced"}
                </p>
              )}
              {(directors.length > 0 || writers.length > 0) && (
                <div className="flex flex-wrap gap-x-12 gap-y-4 border-t border-white/10 pt-5 text-sm">
                  {[
                    ["Directed by", directors],
                    ["Written by", writers],
                  ].map(
                    ([label, people]) =>
                      people.length > 0 && (
                        <div key={label}>
                          <p className="mb-1 text-xs text-white/40">{label}</p>
                          <p>
                            {people.map((person) => person.name).join(", ")}
                          </p>
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="xl:mx-auto xl:container space-y-14 px-5 py-12 md:space-y-20 md:px-10 md:py-16">
        {PartialError && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 px-5 py-3 text-sm text-white/60"
          >
            <p>{PartialError}</p>
            <button
              type="button"
              onClick={retry}
              className={`min-h-10 rounded px-3 text-red-400 hover:text-red-300 ${focus}`}
            >
              Try again
            </button>
          </div>
        )}
        {released && (
          <MoviePlayer
            movie={movie}
            playRequest={playRequest}
            suspended={modal?.type === "video"}
          />
        )}
        <MovieSubtitles key={movie.id} movie={movie} released={released} />
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <div className="min-w-0 space-y-14">
            <section>
              <SectionHeading
                eyebrow="The people behind the story"
                title="Meet the cast"
              />
              <div className="flex snap-x gap-4 overflow-x-auto pb-4">
                {Cast.slice(0, 20).map((person) => (
                  <button
                    key={person.credit_id || person.id}
                    type="button"
                    onClick={() => {
                      handleCast(person.id);
                      setModal({ type: "cast", name: person.name });
                    }}
                    className={`w-28 shrink-0 snap-start rounded-lg text-left sm:w-36 ${focus}`}
                  >
                    <Artwork
                      path={person.profile_path}
                      alt={person.name}
                      className="mb-3 aspect-[3/4] w-full rounded-lg object-cover transition-opacity hover:opacity-75"
                    />
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-white/40">
                      {person.character}
                    </p>
                  </button>
                ))}
              </div>
              {Cast.length === 0 && (
                <p className="text-sm text-white/50">
                  Cast information is not available yet.
                </p>
              )}
            </section>
            {videos.length > 0 && (
              <section>
                <SectionHeading
                  eyebrow="A closer look"
                  title="Trailers & extras"
                />

                <div className="overflow-y-auto h-135">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {videos?.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setModal({ type: "video", video: item })}
                        className={`group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left ${focus}`}
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={`https://i.ytimg.com/vi/${item.key}/hqdefault.jpg`}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover opacity-65 transition-opacity group-hover:opacity-90"
                          />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded-full border border-white/30 bg-black/40 p-4 backdrop-blur-sm">
                              <Play className="size-5 fill-white" />
                            </span>
                          </span>
                        </div>
                        <div className="p-4">
                          <p className="mb-1 text-[10px] uppercase tracking-widest text-red-400">
                            {item.type}
                          </p>
                          <p className="line-clamp-2 text-sm">{item.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
          <aside className="self-start rounded-xl border border-white/10 bg-white/[0.025] p-6">
            <h2 className="mb-6 text-lg font-semibold">Movie details</h2>
            <dl className="space-y-5">
              {facts.map(
                ([label, value]) =>
                  value && (
                    <div key={label}>
                      <dt className="mb-1.5 text-xs text-white/40">{label}</dt>
                      <dd className="text-sm leading-6 text-white/85">
                        {value}
                      </dd>
                    </div>
                  ),
              )}
            </dl>
          </aside>
        </div>

        {images?.length > 0 && (
          <section>
            <SectionHeading eyebrow="Inside the frame" title="Gallery">
              <span className="text-xs text-white/40">
                {images?.length} images
              </span>
            </SectionHeading>
            <div className="h-135 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {images?.map((image, index) => (
                  <button
                    key={image.file_path}
                    type="button"
                    onClick={() =>
                      setModal({ type: "image", path: image.file_path, index })
                    }
                    aria-label={`Enlarge ${movie.title} image ${index + 1}`}
                    className={`overflow-hidden cursor-pointer rounded-lg ${focus}`}
                  >
                    <Artwork
                      path={image.file_path}
                      alt={`${movie.title}, scene ${index + 1}`}
                      size="w780"
                      className="aspect-video w-full object-cover transition-opacity hover:opacity-75"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <SectionHeading eyebrow="From the audience" title="Reviews" />
          {Review.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Review.slice(0, 4).map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-5 md:p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-full bg-white/5 p-3">
                      <UserRound className="size-4 text-white/50" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium">
                        {review.author}
                      </h3>
                      <p className="mt-1 text-xs text-white/40">
                        Audience review
                      </p>
                    </div>
                    {review.author_details?.rating != null && (
                      <span className="flex items-center gap-1 text-sm text-amber-400">
                        <Star className="size-3.5" />
                        {review.author_details.rating}/10
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-4 whitespace-pre-line text-sm leading-7 text-white/60">
                    {review.content}
                  </p>
                  <details className="mt-4 text-sm text-white/70">
                    <summary
                      className={`cursor-pointer text-xs text-red-400 ${focus}`}
                    >
                      Read full review
                    </summary>
                    <p className="mt-4 whitespace-pre-line leading-7">
                      {review.content}
                    </p>
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-white/10 p-6 text-sm text-white/50">
              No audience reviews have been added yet.
            </p>
          )}
        </section>

        {related.length > 0 && (
          <section>
            <SectionHeading eyebrow="Keep discovering" title="More like this" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {related
                ?.filter(
                  (item) =>
                    item.poster_path &&
                    item.poster_path !== "null" &&
                    item.poster_path !== "undefined",
                )
                .slice(0, expanded ? 18 : 6)
                .map((item) => (
                  <MoviePoster
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.poster_path}
                    image2={item.backdrop_path}
                    rating={item.vote_average}
                    overview={item.overview}
                  />
                ))}
            </div>
            {related.length > 6 && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                className={`${button} cursor-pointer mx-auto mt-8 flex border border-white/15 hover:bg-white/5`}
              >
                {expanded ? "Show less" : "Discover more"}
              </button>
            )}
          </section>
        )}
      </div>

      <MovieModal
        modal={modal}
        closeModal={closeModal}
        movie={movie}
        gallery={images.map((image) => image.file_path)}
        setModal={setModal}
        CastLoading={CastLoading}
        CastError={CastError}
        CastDetails={CastDetails}
        retryCast={retryCast}
      />
    </main>
  );
}
