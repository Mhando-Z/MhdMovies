"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Film,
  Loader2,
  RotateCw,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export const tmdbImageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const slugify = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "image";

// <a download> is ignored for cross-origin URLs, so fetch the file as a blob
// and download that. If the CDN blocks the request (CORS), open it in a new
// tab so the person can still save it.
async function downloadImage(url, filename) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    return "downloaded";
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return "opened";
  }
}

/* ------------------------------------------------------------------ */
/* Artwork: one image, with a fallback tile                           */
/* ------------------------------------------------------------------ */

export function Artwork({
  path,
  alt = "",
  className = "",
  size = "w500",
  eager = false,
  onLoad,
  onError,
}) {
  const src = tmdbImageUrl(path, size);
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-900 text-white/20 ${className}`}
      >
        <Film aria-hidden="true" className="size-10" />
        <span className="sr-only">
          {alt ? `${alt}: image unavailable` : "Image unavailable"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={onLoad}
      onError={(e) => {
        setFailedSrc(src);
        onError?.(e);
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Gallery: prev / next, counter, keys, loading, retry, download      */
/* ------------------------------------------------------------------ */

export function GalleryViewer({ movie, gallery, index, onChange }) {
  const total = gallery.length;
  const go = (step) => onChange((index + step + total) % total);

  const path = gallery[index];
  const nextPath = gallery[(index + 1) % total];
  const prevPath = gallery[(index - 1 + total) % total];

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [attempt, setAttempt] = useState(0); // bump to retry a failed image
  const [download, setDownload] = useState("idle"); // idle | busy | done | opened

  // Reset when the image changes. Depends on the path string (not the
  // `gallery` array) so a parent re-render can't reset a loaded image.
  // The spinner appears only after 150ms so cached loads don't flash it.
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setShowSpinner(false);
    setDownload("idle");
    const t = setTimeout(() => setShowSpinner(true), 150);
    return () => clearTimeout(t);
  }, [path, attempt]);

  // Warm the cache for neighbours so next / previous feels instant.
  useEffect(() => {
    if (total < 2) return;
    [nextPath, prevPath].forEach((p) => {
      const url = tmdbImageUrl(p, "original");
      if (url) new Image().src = url;
    });
  }, [nextPath, prevPath, total]);

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

  const handleDownload = async () => {
    if (download === "busy") return;
    setDownload("busy");
    const ext = path.split(".").pop() || "jpg";
    const filename = `${slugify(movie.title)}-scene-${index + 1}.${ext}`;
    setDownload(await downloadImage(tmdbImageUrl(path, "original"), filename));
  };

  const roundButton =
    "absolute z-10 grid size-11 place-items-center rounded-full " +
    "bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " +
    "disabled:cursor-not-allowed disabled:opacity-50";
  const navButton = `${roundButton} top-1/2 -translate-y-1/2`;

  const ready = loaded && !failed;

  return (
    // min-h reserves space so the layout doesn't jump when the image arrives
    <div className="relative grid min-h-[40dvh] place-items-center bg-black">
      <Artwork
        key={`${path}-${attempt}`} // remount per image so the fade-in replays
        path={path}
        size="original"
        alt={`${movie.title}, scene ${index + 1} of ${total}`}
        eager
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`max-h-[75dvh] w-full object-contain transition-opacity duration-300 motion-reduce:transition-none ${
          loaded || failed ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading state */}
      {!loaded && !failed && (
        <div
          role="status"
          className="pointer-events-none absolute inset-0 grid place-items-center bg-white/5 motion-safe:animate-pulse"
        >
          {showSpinner && (
            <span
              aria-hidden="true"
              className="size-9 rounded-full border-2 border-white/20 border-t-white motion-safe:animate-spin"
            />
          )}
          <span className="sr-only">Loading image</span>
        </div>
      )}

      {/* Error state: explains what happened and offers a retry */}
      {failed && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-900 p-6 text-center"
        >
          <p className="max-w-xs text-sm text-white/70">
            This image couldn’t be loaded. Retry, or go to the next one.
          </p>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <RotateCw className="size-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      )}

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
            className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs tabular-nums text-white/80 backdrop-blur"
          >
            {index + 1} / {total}
          </p>
        </>
      )}

      {/* Download: bottom-right so it never collides with the modal's close button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={!ready || download === "busy"}
        aria-label="Download image"
        title="Download full-size image"
        className={`${roundButton} cursor-pointer bottom-3 right-3`}
      >
        {download === "busy" ? (
          <Loader2
            className="size-5 motion-safe:animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Download className="size-5" aria-hidden="true" />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {download === "busy" && "Downloading image"}
        {download === "done" && "Image downloaded"}
        {download === "opened" && "Image opened in a new tab"}
      </span>
    </div>
  );
}
