import Link from "next/link";
import { ArrowUpRight, Clapperboard, Loader2, RotateCcw } from "lucide-react";
import styles from "./movieState.module.css";

export default function MovieState({ loading = false, error, onRetry }) {
  const notFound = !error || error === "Movie not found.";

  return (
    <section
      aria-labelledby={loading ? undefined : "movie-state-title"}
      className="relative isolate flex min-h-[90svh] w-full items-center justify-center overflow-hidden bg-[#080808] px-5 pb-16 pt-28 font-roboto text-white"
    >
      <div aria-hidden="true" className={styles.ambient} />
      <div aria-hidden="true" className={styles.grid} />
      <div className="relative mx-auto w-full max-w-3xl text-center">
        <div className="mb-8 inline-flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
          <span
            className={`size-1.5 rounded-full ${loading ? "bg-red-500 motion-safe:animate-pulse" : "bg-white/40"}`}
          />
          MHD Movies <span className="mx-1 text-white/20">/</span>{" "}
          {loading ? "Now preparing" : "An unexpected intermission"}
        </div>

        <div aria-hidden="true" className={styles.frame}>
          <div className={styles.perforations} />
          <div className={styles.screen}>
            {loading ? (
              <div className={styles.countdown}>
                <div className={styles.crosshair} />
                <div className={styles.sweep} />
                <div className={styles.innerRing} />
                <Clapperboard
                  className="relative z-10 size-12 text-white/85 md:size-16"
                  strokeWidth={1.25}
                />
              </div>
            ) : (
              <div className="relative flex items-center justify-center py-4">
                <span className={styles.errorCode}>
                  {notFound ? "404" : "CUT"}
                </span>
                <span className="absolute -rotate-12 rounded border border-red-400/40 bg-[#140b0b]/95 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.35em] text-red-300 shadow-xl md:text-xs">
                  {notFound ? "Scene missing" : "Signal lost"}
                </span>
              </div>
            )}
            <div className="absolute bottom-3 left-4 right-4 flex justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
              <span>{loading ? "Picture loading" : "End of reel"}</span>
              <span>MHD / 35mm</span>
            </div>
          </div>
          <div className={styles.perforations} />
        </div>

        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="mx-auto mt-9 max-w-md"
          >
            <h1 className="text-3xl font-semibold tracking-tight  ">
              Setting the scene.
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/45">
              A great story deserves a proper entrance.
              <br />
              Your movie is on its way.
            </p>
            <div
              aria-hidden="true"
              className="mx-auto mt-7 h-px w-40 overflow-hidden bg-white/10"
            >
              <div className={styles.progress} />
            </div>
            <div
              aria-hidden="true"
              className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/35"
            >
              <Loader2 className="size-3 motion-safe:animate-spin" />
              Preparing your movie
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-9 max-w-lg">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
              {notFound
                ? "This scene didn't make the cut"
                : "A brief technical intermission"}
            </p>
            <h1
              id="movie-state-title"
              className="text-3xl font-semibold tracking-tight"
            >
              {notFound ? "A plot twist. No movie." : "Let's take that again."}
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-white/50">
              {notFound
                ? "This title may have left the collection, or the link took a wrong turn. Your next great watch is still out there."
                : "We couldn't connect to the movie collection. Give it another take, or discover something new while we reconnect."}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-red-600 px-6 text-sm font-semibold transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Discover movies <ArrowUpRight className="size-4" />
              </Link>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex cursor-pointer min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <RotateCcw className="size-3.5" />
                  Try again
                </button>
              )}
            </div>
          </div>
        )}
        <p
          aria-hidden="true"
          className="mt-12 text-[9px] uppercase tracking-[0.35em] text-white/20"
        >
          Every frame, a new discovery
        </p>
      </div>
    </section>
  );
}
