"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Film,
  Loader2,
  MapPin,
  RotateCw,
  Tv,
} from "lucide-react";
import { personAge as ageFrom, personCredits, sortCredits } from "@/lib/people";
import { Modal, formatMovieDate as date } from "./movieDetailsUI";
import { Artwork, GalleryViewer } from "./movieImages";

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
  const reducedMotion = useReducedMotion();
  const credits = useMemo(() => personCredits(details), [details]);
  const knownFor = useMemo(
    () =>
      sortCredits(
        credits.filter(
          (credit) =>
            credit.acting &&
            !(credit.media_type === "movie" && credit.id === currentMovieId),
        ),
        "popular",
      ).slice(0, 3),
    [credits, currentMovieId],
  );
  const movieCount = credits.filter(
    (credit) => credit.media_type === "movie",
  ).length;
  const tvCount = credits.filter((credit) => credit.media_type === "tv").length;
  const age = ageFrom(details.birthday, details.deathday);
  const bio = details.biography?.trim();
  const isLongBio = bio && bio.length > 420;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
      className="p-5 sm:p-7"
    >
      <div className="flex items-start gap-5 sm:gap-6">
        <Artwork
          path={details.profile_path}
          alt={details.name}
          eager
          className="aspect-[3/4] w-28 shrink-0 rounded-xl border border-white/10 object-cover object-top shadow-xl sm:w-36"
        />

        <div className="min-w-0 flex-1 pt-1">
          <h1 className="text-xl font-bold text-white sm:text-xl">
            {details.name}
          </h1>
          {details.known_for_department && (
            <span className="inline-block rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-red-300">
              {details.known_for_department}
            </span>
          )}

          <dl className="mt-4 space-y-3 text-xs leading-6 text-white/65 sm:text-sm">
            {details.birthday && (
              <div>
                <dt className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/35">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  Born
                </dt>
                <dd className="pl-5.5">
                  {date(details.birthday)}
                  {!details.deathday && age !== null && (
                    <span className="block text-xs text-white/45">
                      {age} years old
                    </span>
                  )}
                </dd>
              </div>
            )}
            {details.deathday && (
              <div>
                <dt className="sr-only">Died</dt>
                <dd>
                  Died {date(details.deathday)}
                  {age !== null && ` (aged ${age})`}
                </dd>
              </div>
            )}
            {details.place_of_birth && (
              <div>
                <dt className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/35">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  Birthplace
                </dt>
                <dd className="pl-5.5">{details.place_of_birth}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.025] py-4 text-center">
        {[
          [movieCount, "Movies"],
          [tvCount, "TV series"],
          [details.images?.profiles?.length ?? 0, "Portraits"],
        ].map(([count, label]) => (
          <div key={label}>
            <p className="text-xl font-medium tabular-nums tracking-tight text-white">
              {count}
            </p>
            <p className="mt-1 text-[10px] text-white/40">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6" aria-label="Biography">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          The story so far
        </h3>
        {bio ? (
          <>
            <p
              className={`whitespace-pre-line text-sm leading-7 text-white/65 ${
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

      <Link
        href={`/actors/${details.id}`}
        onClick={onNavigate}
        className="mt-6 cursor-pointer flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
      >
        Explore full profile{" "}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
      <p className="mt-2 text-center text-[10px] text-white/35">
        Biography, complete filmography &amp; photo gallery
      </p>

      {knownFor.length > 0 && (
        <section className="mt-8 border-t border-white/10 pt-6">
          <h3 className="mb-4 text-base font-semibold">Also known for</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {knownFor.map((item) => {
              const isMovie = item.media_type === "movie";
              const content = (
                <>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-white/10">
                    <Artwork
                      path={item.poster_path}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-black/80 px-1.5 py-1 text-[9px] text-white/80">
                      {isMovie ? (
                        <Film className="size-2.5" />
                      ) : (
                        <Tv className="size-2.5" />
                      )}
                      {isMovie ? "Movie" : "TV"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-white/80">
                    {item.title}
                  </p>
                  {!isMovie && (
                    <span className="sr-only">Opens on TMDB in a new tab</span>
                  )}
                </>
              );
              const className =
                "group min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400";
              return (
                <Link
                  key={item.key}
                  href={`/${isMovie ? "movies" : "series"}/${item.id}`}
                  onClick={onNavigate}
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </motion.div>
  );
}

function getYouTubeId(video) {
  const raw = video?.url || video?.src || video?.key;
  if (typeof raw !== "string" || !raw.trim()) return null;

  // Respect TMDB's video provider.
  if (video?.site && video.site.toLowerCase() !== "youtube") {
    return null;
  }

  const value = raw.trim();
  const validId = (id) => (/^[a-zA-Z0-9_-]{11}$/.test(id || "") ? id : null);

  // TMDB YouTube ID or Vidstack-style source.
  if (validId(value)) return value;
  if (value.startsWith("youtube/")) {
    return validId(value.slice(8));
  }

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();

    if (["youtu.be", "www.youtu.be"].includes(host)) {
      return validId(url.pathname.split("/")[1]);
    }

    const allowedHosts = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "music.youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
    ];

    if (!allowedHosts.includes(host)) return null;

    if (url.pathname === "/watch") {
      return validId(url.searchParams.get("v"));
    }

    const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/]+)/);

    return validId(match?.[1]);
  } catch {
    return null;
  }
}

function ModalVideoPlayer({ video }) {
  const youtubeId = getYouTubeId(video);
  const source = video?.url || video?.src || video?.key;

  // YouTube videos use the official embedded player.
  if (youtubeId) {
    return (
      <iframe
        key={youtubeId}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={video?.name || "YouTube video"}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  if (!source) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/60">
        Video unavailable.
      </div>
    );
  }

  // Non-YouTube videos use the existing player.
  return (
    <VidstackPlayer
      key={source}
      src={source}
      title={video?.name || "Video"}
      autoPlay
    />
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
          <ModalVideoPlayer video={modal.video} />
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
              key={CastDetails.id}
              details={CastDetails}
              currentMovieId={movie.id}
              onNavigate={closeModal}
            />
          )
        ))}
    </Modal>
  );
}
