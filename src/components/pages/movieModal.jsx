"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Loader2, RotateCw } from "lucide-react";
import MoviePoster from "../moviePoster";
import { Artwork, Modal, formatMovieDate as date } from "./movieDetailsUI";

const VidstackPlayer = dynamic(() => import("../vidstackPlayer"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="flex aspect-video items-center justify-center text-white/60"
    >
      Loading player...
    </div>
  ),
});

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function ageFrom(birthday, deathday) {
  const end = deathday ? new Date(deathday) : new Date();
  const start = new Date(birthday);
  let age = end.getFullYear() - start.getFullYear();
  const hadBirthday =
    end.getMonth() > start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() >= start.getDate());
  return hadBirthday ? age : age - 1;
}

/* ------------------------------------------------------------------ */
/* Gallery: prev / next, counter, arrow-key support                   */
/* ------------------------------------------------------------------ */

function GalleryViewer({ movie, gallery, index, onChange }) {
  const total = gallery.length;
  const go = (step) => onChange((index + step + total) % total);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        go(e.key === "ArrowLeft" ? -1 : 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // re-bind each render so `index` is never stale

  const navButton =
    "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full " +
    "bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <div className="relative bg-black">
      <Artwork
        path={gallery[index]}
        size="original"
        alt={`${movie.title}, scene ${index + 1} of ${total}`}
        eager
        className="max-h-[75dvh] w-full object-contain"
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className={`${navButton} left-3`}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className={`${navButton} right-3`}
          >
            <ChevronRight className="size-6" />
          </button>
          <p
            aria-live="polite"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs tabular-nums text-white/80 backdrop-blur"
          >
            {index + 1} / {total}
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cast profile                                                       */
/* ------------------------------------------------------------------ */

function CastSkeleton() {
  // Mirrors the real layout so the modal doesn't jump when data arrives.
  return (
    <div role="status" aria-label="Loading profile" className="p-5 sm:p-6">
      <div className="flex gap-5 motion-safe:animate-pulse">
        <div className="aspect-[3/4] w-24 shrink-0 rounded-lg bg-white/10 sm:w-32" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-5 w-1/2 rounded bg-white/10" />
          <div className="h-4 w-1/3 rounded bg-white/10" />
          <div className="h-3 w-2/3 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-6 space-y-2 motion-safe:animate-pulse">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-4/5 rounded bg-white/10" />
      </div>
      <span className="sr-only">
        <Loader2 className="size-4" /> Loading profile…
      </span>
    </div>
  );
}

function CastError({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 px-6 py-14 text-center"
    >
      <p className="max-w-xs text-sm text-white/70">
        {message || "We couldn’t load this profile."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <RotateCw className="size-4" />
          Try again
        </button>
      )}
    </div>
  );
}

function CastProfile({ details, currentMovieId, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  // Dedupe, drop the current film, sort by popularity, keep the top 3.
  const knownFor = useMemo(() => {
    const credits = details.movie_credits?.cast ?? [];
    const unique = new Map(
      credits
        .filter((c) => c.poster_path && c.id !== currentMovieId)
        .sort((a, b) => b.popularity - a.popularity)
        .map((c) => [c.id, c]),
    );
    return [...unique.values()].slice(0, 3);
  }, [details, currentMovieId]);

  const bio = details.biography?.trim();
  const isLongBio = bio && bio.length > 420;

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-start gap-5">
        <Artwork
          path={details.profile_path}
          alt=""
          className="aspect-3/4 w-24 shrink-0 rounded-lg object-cover sm:w-32"
        />

        <div className="min-w-0">
          {/* The modal header already shows the name, so don't repeat it. */}
          {details.known_for_department && (
            <span className="inline-block rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-300">
              {details.known_for_department}
            </span>
          )}

          <dl className="mt-3 space-y-1.5 text-sm text-white/65">
            {details.birthday && (
              <div>
                <dt className="sr-only">Born</dt>
                <dd>
                  {date(details.birthday)}
                  {!details.deathday &&
                    ` · ${ageFrom(details.birthday)} years old`}
                </dd>
              </div>
            )}
            {details.deathday && (
              <div>
                <dt className="sr-only">Died</dt>
                <dd>
                  Died {date(details.deathday)}
                  {details.birthday &&
                    ` (aged ${ageFrom(details.birthday, details.deathday)})`}
                </dd>
              </div>
            )}
            {details.place_of_birth && (
              <div>
                <dt className="sr-only">Birthplace</dt>
                <dd>{details.place_of_birth}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <section className="mt-6" aria-label="Biography">
        {bio ? (
          <>
            <p
              className={` text-justify whitespace-pre-line text-sm leading-7 text-white/75 ${
                expanded || !isLongBio ? "" : "line-clamp-5"
              }`}
            >
              {bio}
            </p>
            {isLongBio && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-2 cursor-pointer text-sm font-medium text-red-300 hover:text-red-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </>
        ) : (
          <p className="text-sm text-white/60">No biography available yet.</p>
        )}
      </section>

      {knownFor.length > 0 && (
        <section className="mt-8 border-t border-white/10 pt-6">
          <h3 className="mb-4 text-base font-semibold">Also known for</h3>
          {/* Three items, three columns at every width: no orphaned poster. */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {knownFor.map((item) => (
              <div key={item.id} onClick={onNavigate}>
                <MoviePoster
                  id={item.id}
                  title={item.title}
                  image={item.poster_path}
                  rating={item.vote_average}
                  overview={item.overview}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The modal                                                          */
/* ------------------------------------------------------------------ */

// Gallery paths match the indices used by movieDetails' gallery buttons.
export default function MovieModal({
  modal,
  closeModal,
  movie,
  gallery = [],
  setModal,
  CastLoading,
  CastError: castErrorMessage,
  CastDetails,
  retryCast,
}) {
  if (!modal) return null;

  const isCast = modal.type === "cast";
  const isVideo = modal.type === "video";

  const title = isVideo
    ? modal.video.name
    : isCast
      ? modal.name
      : `${movie.title} · Gallery`;

  return (
    <Modal title={title} onClose={closeModal} wide={!isCast}>
      {isVideo && (
        <div className="aspect-video w-full bg-black">
          <VidstackPlayer
            key={modal.video.key}
            src={`youtube/${modal.video.key}`}
            title={modal.video.name}
            poster={`https://i.ytimg.com/vi/${modal.video.key}/hqdefault.jpg`}
            autoPlay
          />
        </div>
      )}

      {modal.type === "image" && (
        <GalleryViewer
          movie={movie}
          gallery={gallery.length ? gallery : [modal.path]}
          index={gallery.length ? (modal.index ?? 0) : 0}
          onChange={(index) =>
            setModal?.({ ...modal, index, path: gallery[index] })
          }
        />
      )}

      {isCast &&
        (CastLoading ? (
          <CastSkeleton />
        ) : castErrorMessage ? (
          <CastError message={castErrorMessage} onRetry={retryCast} />
        ) : (
          CastDetails && (
            <CastProfile
              details={CastDetails}
              currentMovieId={movie.id}
              onNavigate={closeModal}
            />
          )
        ))}
    </Modal>
  );
}
