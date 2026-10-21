"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const onCloseRef = useRef(onClose);
  const [closing, setClosing] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Triggers the exit variant; onClose fires when it finishes.
  const requestClose = useCallback(() => setClosing(true), []);

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    const close = () => {
      // Ignore the queued cleanup event if Strict Mode has reopened the dialog.
      if (!dialog.open) onCloseRef.current();
    };
    // Esc plays the exit animation instead of snapping shut.
    const cancel = (event) => {
      event.preventDefault();
      requestClose();
    };

    dialog.addEventListener("close", close);
    dialog.addEventListener("cancel", cancel);
    return () => {
      dialog.removeEventListener("close", close);
      dialog.removeEventListener("cancel", cancel);
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, [requestClose]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.26, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.16, ease: "easeIn" } },
  };

  const panelVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        hidden: { opacity: 0, y: 14, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 380,
            damping: 32,
            mass: 0.8,
          },
        },
        exit: {
          opacity: 0,
          y: 6,
          scale: 0.98,
          transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
        },
      };

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none items-center justify-center bg-transparent p-0 text-white backdrop:bg-transparent open:flex"
    >
      <motion.div
        aria-hidden="true"
        variants={backdropVariants}
        initial="hidden"
        animate={closing ? "exit" : "visible"}
        className="pointer-events-none absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate={closing ? "exit" : "visible"}
        onAnimationComplete={(definition) => {
          if (definition === "exit") onCloseRef.current();
        }}
        className={`relative max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 text-white shadow-2xl ${wide ? "max-w-5xl" : "max-w-2xl"}`}
      >
        <div className="flex items-center justify-end gap-4 border-b border-white/10 px-5 py-4">
          <button
            type="button"
            aria-label="Close dialog"
            onClick={requestClose}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </dialog>
  );
}
