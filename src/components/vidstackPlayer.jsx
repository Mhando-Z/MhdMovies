"use client";

import { useState } from "react";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

// Supports YouTube, MP4, HLS and DASH sources. Provider embed pages belong
// in MoviePlayer's iframe; passing an HTML page here cannot play its video.
export default function VidstackPlayer({ src, title, poster, autoPlay = false }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  return (
    <div className="bg-black">
      <MediaPlayer
        key={`${typeof src === "string" ? src : src.src}-${attempt}`}
        src={src}
        title={title}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        load="visible"
        aspectRatio="16/9"
        onError={() => setFailed(true)}
        onCanPlay={() => setFailed(false)}
        style={{ "--media-brand": "#dc2626", "--media-focus-ring-color": "#ef4444" }}
      >
        <MediaProvider>
          {poster && <Poster className="vds-poster" alt={`${title} poster`} />}
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
      {failed && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm text-white/70">
          <span>This video could not be played.</span>
          <button
            type="button"
            onClick={() => { setFailed(false); setAttempt((value) => value + 1); }}
            className="min-h-10 rounded-lg border border-white/20 px-4 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-red-500"
          >
            Retry video
          </button>
        </div>
      )}
    </div>
  );
}
