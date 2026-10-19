"use client";

import { useEffect, useRef, useState } from "react";
import { Film, X } from "lucide-react";

export const formatMovieDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${value}T00:00:00Z`))
    : "Not announced";

export function Artwork({
  path,
  alt = "",
  className = "",
  size = "w500",
  eager = false,
}) {
  const src = path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
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
      onError={() => setFailedSrc(src)}
    />
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const close = () => {
      // Ignore the queued cleanup event if Strict Mode has reopened the dialog.
      if (!dialog.open) onClose();
    };
    dialog.addEventListener("close", close);
    return () => {
      dialog.removeEventListener("close", close);
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={`fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-0 text-white shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm ${wide ? "max-w-5xl" : "max-w-2xl"}`}
    >
      <div className="flex items-center justify-end gap-4 border-b border-white/10 px-5 py-4">
        {/* <h2 className="text-base font-semibold">{title}</h2> */}
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
        >
          <X className="size-5" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
