"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

/**
 * VidstackPlayer
 * Supports YouTube, MP4, HLS and DASH sources. Provider embed pages belong
 * in MoviePlayer's iframe; passing an HTML page here cannot play its video.
 *
 * Core props
 * - src, title, poster, autoPlay
 * - storageKey   unique id used to remember the viewer's position (defaults to src)
 * - accent       brand colour for progress, focus and highlights
 * - className    extra classes for the outer wrapper
 *
 * Captions / subtitles (all source types, including YouTube)
 * - tracks       [{ src, kind: "subtitles" | "chapters", label, lang, default }]
 *                Vidstack renders these itself, so they work on top of YouTube too.
 *
 * Quality
 * - HLS / DASH   automatic: Settings > Quality (Auto + every rendition)
 * - MP4 files    qualities=[{ label: "1080p", src, type?, default? }, ...]
 *                adds a quality menu; switching keeps the viewer's position.
 * - YouTube      YouTube does not let embedded players change quality or read its
 *                caption list. The quality button offers YouTube's own controls
 *                (full quality + captions menus) and returns to custom controls.
 *
 * Extras
 * - thumbnails   WebVTT sprite for scrub previews
 * - introRange   [start, end] seconds -> "Skip intro"
 * - onNext, nextTitle  -> "Up next" end screen
 */

const YOUTUBE = /(?:youtube\.com|youtube-nocookie\.com|youtu\.be)|^youtube\//i;

const SHORTCUTS = [
  ["Space / K", "Play or pause"],
  ["J / ←", "Seek back"],
  ["L / →", "Seek forward"],
  ["↑ / ↓", "Volume up or down"],
  ["M", "Mute"],
  ["C", "Captions"],
  ["< / >", "Playback speed"],
  ["F", "Fullscreen"],
  ["I", "Picture-in-picture"],
  ["?", "Show shortcuts"],
];

const ERROR_COPY = {
  2: "Check your connection and try again.",
  3: "The video file is damaged or can't be decoded.",
  4: "Your browser can't play this video format.",
};

function formatTime(seconds = 0) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

function readSaved(key) {
  try {
    const value = Number(window.localStorage.getItem(key));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function writeSaved(key, value) {
  try {
    if (value == null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, String(Math.floor(value)));
  } catch {
    /* storage unavailable (private mode, quota) – resume is optional */
  }
}

/* ---------- small presentational pieces ---------- */

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const KeyboardIcon = () => (
  <svg {...iconProps}>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7.5 14h9" />
  </svg>
);

const ReplayIcon = () => (
  <svg {...iconProps}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

const SkipIcon = () => (
  <svg {...iconProps} width={18} height={18}>
    <path d="M5 5l9 7-9 7V5z" />
    <path d="M19 5v14" />
  </svg>
);

const AlertIcon = () => (
  <svg {...iconProps} width={28} height={28}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </svg>
);

const CloseIcon = () => (
  <svg {...iconProps} width={18} height={18}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const CheckIcon = () => (
  <svg {...iconProps} width={18} height={18}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const primaryBtn =
  "inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const ghostBtn =
  "inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const glass =
  "rounded-xl bg-neutral-950/85 text-white shadow-xl ring-1 ring-white/10 backdrop-blur-md";

/* ---------- component ---------- */

export default function VidstackPlayer({
  src,
  title,
  poster,
  autoPlay = false,
  tracks = [],
  qualities = [],
  thumbnails,
  introRange,
  onNext,
  nextTitle,
  storageKey,
  accent = "#dc2626",
  className = "",
}) {
  const playerRef = useRef(null);
  const resumedRef = useRef(false);
  const lastSavedRef = useRef(0);
  const lastTimeRef = useRef(0);
  const pendingRef = useRef(null); // { time, play } applied after a source/UI swap

  const [error, setError] = useState(null); // { code, message } | null
  const [attempt, setAttempt] = useState(0);
  const [ended, setEnded] = useState(false);
  const [inIntro, setInIntro] = useState(false);
  const [toast, setToast] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [menu, setMenu] = useState(null); // null | "quality" | "youtube"
  const [nativeUI, setNativeUI] = useState(false); // YouTube's own controls
  const [qIndex, setQIndex] = useState(() => {
    const i = qualities.findIndex((q) => q.default);
    return i >= 0 ? i : 0;
  });

  const hasQualities = qualities.length > 1;
  const baseSrc = src ?? qualities[0]?.src;
  const baseString = typeof baseSrc === "string" ? baseSrc : baseSrc?.src;
  const isYouTube = YOUTUBE.test(baseString ?? "");
  const activeSrc = hasQualities
    ? {
        src: qualities[qIndex].src,
        type: qualities[qIndex].type ?? "video/mp4",
      }
    : src;
  const resumeKey = storageKey ?? `vp:resume:${baseString}`;
  const showQualityButton = !nativeUI && (hasQualities || isYouTube);

  // Reset per-video state when the video changes.
  useEffect(() => {
    resumedRef.current = false;
    lastSavedRef.current = 0;
    lastTimeRef.current = 0;
    pendingRef.current = null;
    setError(null);
    setEnded(false);
    setInIntro(false);
    setToast(null);
    setMenu(null);
    setNativeUI(false);
  }, [resumeKey]);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(id);
  }, [toast]);

  const focusPlayer = useCallback(() => {
    playerRef.current?.el?.focus?.();
  }, []);

  const closeShortcuts = useCallback(() => {
    setShowShortcuts(false);
    focusPlayer();
  }, [focusPlayer]);

  const handleKeyDown = (event) => {
    if (event.key === "?") {
      event.preventDefault();
      setShowShortcuts((open) => !open);
    } else if (event.key === "Escape") {
      if (showShortcuts) {
        event.stopPropagation();
        closeShortcuts();
      } else if (menu) {
        event.stopPropagation();
        setMenu(null);
        focusPlayer();
      }
    }
  };

  /** Remember position + play state so a swap feels seamless. */
  const rememberPosition = () => {
    const player = playerRef.current;
    pendingRef.current = {
      time: player?.currentTime || lastTimeRef.current,
      play: player ? !player.paused : false,
    };
  };

  const switchQuality = (index) => {
    setMenu(null);
    if (index === qIndex) return;
    rememberPosition();
    setError(null);
    setQIndex(index);
  };

  const switchUI = (native) => {
    rememberPosition();
    setMenu(null);
    setEnded(false);
    setError(null);
    setNativeUI(native);
  };

  const handleCanPlay = () => {
    setError(null);
    const player = playerRef.current;
    const pending = pendingRef.current;

    if (pending && player) {
      pendingRef.current = null;
      resumedRef.current = true;
      if (pending.time > 0) player.currentTime = pending.time;
      if (pending.play) player.play()?.catch?.(() => {});
      return;
    }

    if (resumedRef.current) return;
    resumedRef.current = true;

    const saved = readSaved(resumeKey);
    const duration = player?.duration || 0;
    if (!player || saved < 5 || (duration && saved > duration - 15)) return;

    player.currentTime = saved;
    setToast({
      text: `Resumed from ${formatTime(saved)}`,
      action: "Start over",
    });
  };

  const handleTimeUpdate = (detail) => {
    const t = detail?.currentTime ?? 0;
    lastTimeRef.current = t;

    if (Math.abs(t - lastSavedRef.current) >= 5) {
      lastSavedRef.current = t;
      if (t > 5) writeSaved(resumeKey, t);
    }

    if (introRange) {
      const [start, end] = introRange;
      setInIntro(t >= start && t < end - 0.5);
    }
  };

  const handleEnded = () => {
    writeSaved(resumeKey, null);
    setEnded(true);
  };

  const handleError = (detail) => {
    setError({ code: detail?.code, message: detail?.message });
  };

  const startOver = () => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime = 0;
    writeSaved(resumeKey, null);
    setToast(null);
  };

  const replay = () => {
    const player = playerRef.current;
    if (!player) return;
    setEnded(false);
    player.currentTime = 0;
    player.play();
  };

  const skipIntro = () => {
    const player = playerRef.current;
    if (player && introRange) player.currentTime = introRange[1];
    setInIntro(false);
  };

  const retry = () => {
    setError(null);
    resumedRef.current = false;
    setAttempt((value) => value + 1);
  };

  const slots = useMemo(
    () => ({
      // Title sits in the top bar and fades with the controls.
      topControlsGroupStart: (
        <h2 className="pointer-events-none max-w-[70%] truncate px-2 text-base font-medium text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
          {title}
        </h2>
      ),
      beforeFullscreenButton: (
        <>
          {showQualityButton && (
            <button
              type="button"
              className="vds-button"
              style={{ width: "auto", minWidth: 40, padding: "0 6px" }}
              aria-label={
                hasQualities ? "Video quality" : "Quality and captions"
              }
              aria-haspopup="menu"
              title={hasQualities ? "Video quality" : "Quality and captions"}
              onClick={() =>
                setMenu((open) =>
                  open ? null : hasQualities ? "quality" : "youtube",
                )
              }
            >
              <span className="vp-time rounded border border-current px-1.5 py-0.5 text-[11px] font-semibold leading-none">
                {hasQualities ? qualities[qIndex].label : "HD"}
              </span>
            </button>
          )}
          <button
            type="button"
            className="vds-button"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
            onClick={() => setShowShortcuts(true)}
          >
            <KeyboardIcon />
          </button>
        </>
      ),
    }),
    [title, showQualityButton, hasQualities, qualities, qIndex],
  );

  return (
    <div
      onKeyDown={handleKeyDown}
      className={`vp-root relative isolate overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/40 ring-1 ring-white/10 ${className}`}
      style={{ "--vp-accent": accent }}
    >
      <style>{`
        .vp-root {
          --media-brand: var(--vp-accent);
          --video-brand: var(--vp-accent);
          --media-focus-ring-color: color-mix(in srgb, var(--vp-accent) 70%, white);
          --video-border-radius: 0;
        }
        .vp-root [data-media-player] { border-radius: 0; }
        .vp-root .vp-time { font-variant-numeric: tabular-nums; }
        @media (prefers-reduced-motion: no-preference) {
          .vp-pop { animation: vp-pop .22s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes vp-pop {
          from { opacity: 0; transform: translateY(6px) scale(.98); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="relative">
        <MediaPlayer
          ref={playerRef}
          key={`${baseString}-${attempt}-${nativeUI ? "native" : "custom"}`}
          src={activeSrc}
          title={title}
          poster={poster}
          autoPlay={autoPlay}
          playsInline
          load="visible"
          aspectRatio="16/9"
          controls={nativeUI} // YouTube's own UI (quality + captions) when true
          storage="vp-preferences" // remembers volume, mute, captions, speed
          onCanPlay={handleCanPlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => setEnded(false)}
          onError={handleError}
        >
          <MediaProvider>
            {poster && (
              <Poster
                className="vds-poster object-cover"
                alt={title ? `Poster for ${title}` : "Video poster"}
              />
            )}
            {tracks.map((track) => (
              <Track key={`${track.kind}-${track.src}`} {...track} />
            ))}
          </MediaProvider>

          {!nativeUI && (
            <DefaultVideoLayout
              icons={defaultLayoutIcons}
              colorScheme="dark"
              thumbnails={thumbnails}
              slots={slots}
            />
          )}
        </MediaPlayer>

        {/* Resume toast */}
        {toast && !error && !nativeUI && (
          <div
            role="status"
            className={`vp-pop absolute bottom-24 left-4 z-20 flex items-center gap-3 py-2 pl-4 pr-2 text-sm ${glass}`}
          >
            <span className="vp-time">{toast.text}</span>
            <button
              type="button"
              onClick={startOver}
              className="min-h-9 rounded-md px-3 font-medium text-white underline-offset-4 hover:bg-white/10 hover:underline focus-visible:outline-2 focus-visible:outline-white"
            >
              {toast.action}
            </button>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss"
              className="grid size-9 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Skip intro */}
        {inIntro && !error && !ended && !nativeUI && (
          <button
            type="button"
            onClick={skipIntro}
            className={`vp-pop absolute bottom-24 right-4 z-20 ${primaryBtn} shadow-lg`}
          >
            <SkipIcon />
            Skip intro
          </button>
        )}

        {/* Quality / YouTube menu */}
        {menu && !nativeUI && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setMenu(null)}
              className="absolute inset-0 z-30 cursor-default"
            />
            <div
              role="menu"
              aria-label={
                menu === "quality" ? "Video quality" : "Quality and captions"
              }
              className={`vp-pop absolute bottom-20 right-4 z-40 w-64 p-2 ${glass}`}
            >
              {menu === "quality" ? (
                <>
                  <p className="px-3 pb-1 pt-2 text-sm font-semibold">
                    Quality
                  </p>
                  {qualities.map((q, i) => (
                    <button
                      key={q.src}
                      type="button"
                      role="menuitemradio"
                      aria-checked={i === qIndex}
                      autoFocus={i === qIndex}
                      onClick={() => switchQuality(i)}
                      className="flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <span
                        className={
                          i === qIndex ? "font-semibold" : "text-white/80"
                        }
                      >
                        {q.label}
                      </span>
                      {i === qIndex && (
                        <span style={{ color: accent }}>
                          <CheckIcon />
                        </span>
                      )}
                    </button>
                  ))}
                </>
              ) : (
                <div className="flex flex-col gap-3 p-2">
                  <p className="text-sm font-semibold">Quality and captions</p>
                  <p className="text-sm leading-relaxed text-white/70">
                    YouTube manages these inside its own player. Switch to its
                    controls to change them. Your place in the video is kept.
                  </p>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => switchUI(true)}
                    className={primaryBtn}
                  >
                    Use YouTube controls
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Ended */}
        {ended && !error && !nativeUI && (
          <div className="absolute inset-0 z-30 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="vp-pop flex max-w-md flex-col items-center gap-5 text-center">
              <div>
                <p className="text-lg font-semibold text-white">
                  {onNext ? "Up next" : "Finished watching"}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {onNext && nextTitle ? nextTitle : title}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {onNext && (
                  <button type="button" onClick={onNext} className={primaryBtn}>
                    <SkipIcon />
                    Play next
                  </button>
                )}
                <button
                  type="button"
                  onClick={replay}
                  className={onNext ? ghostBtn : primaryBtn}
                >
                  <ReplayIcon />
                  Watch again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="absolute inset-0 z-40 grid place-items-center bg-neutral-950/90 p-6 text-center backdrop-blur-md"
          >
            <div className="vp-pop flex max-w-sm flex-col items-center gap-4">
              <span className="grid size-14 place-items-center rounded-full bg-white/10 text-white/80">
                <AlertIcon />
              </span>
              <div>
                <p className="text-base font-semibold text-white">
                  This video can't be played
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {ERROR_COPY[error.code] ??
                    "Something went wrong while loading the video."}
                </p>
              </div>
              <button type="button" onClick={retry} className={primaryBtn}>
                <ReplayIcon />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Keyboard shortcuts */}
        {showShortcuts && !nativeUI && (
          <div
            className="absolute inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={closeShortcuts}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard shortcuts"
              onClick={(event) => event.stopPropagation()}
              className={`vp-pop w-full max-w-md p-5 ${glass}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Keyboard shortcuts</h3>
                <button
                  type="button"
                  autoFocus
                  onClick={closeShortcuts}
                  aria-label="Close shortcuts"
                  className="grid size-9 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                >
                  <CloseIcon />
                </button>
              </div>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
                {SHORTCUTS.map(([keys, action]) => (
                  <div
                    key={keys}
                    className="flex items-center justify-between gap-3 py-1.5 text-sm"
                  >
                    <dt className="text-white/70">{action}</dt>
                    <dd>
                      <kbd className="rounded-md bg-white/10 px-2 py-0.5 font-sans text-xs text-white">
                        {keys}
                      </kbd>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* YouTube-controls footer: always gives a way back */}
      {nativeUI && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white/70">
          <span>
            YouTube controls are on. Use the gear icon for quality and captions.
          </span>
          <button
            type="button"
            onClick={() => switchUI(false)}
            className={ghostBtn}
          >
            Use custom controls
          </button>
        </div>
      )}
    </div>
  );
}
