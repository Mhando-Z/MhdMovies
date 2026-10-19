import { validAnimeId } from "./model";

export function getAnimeSources(anime, episode, audio = "sub") {
  if (
    !Number.isSafeInteger(episode) ||
    episode < 1 ||
    episode > 100000 ||
    !["sub", "dub"].includes(audio)
  )
    return [];
  const mal = validAnimeId(anime?.malId) ? anime.malId : null;
  const ani = validAnimeId(anime?.id) ? anime.id : null;
  if (!mal && !ani) return [];
  return [
    {
      id: "zoko",
      name: "Zokoanime",
      src: `https://zokoanime.video/stream/${mal ? "mal" : "anilist"}/${mal || ani}/${episode}/${audio}`,
    },
    {
      id: "nika",
      name: "NikaStream",
      src: `https://nikastream.blog/embed/${mal ? "mal" : "ani"}/${mal || ani}/${episode}/${audio}`,
    },
    ...(ani
      ? [
          {
            id: "anilink",
            name: "AniLink",
            src: `https://anilink.cc/watch/${ani}/${episode}?variant=${audio}`,
          },
        ]
      : []),
  ];
}

// Only NikaStream's documented event schema is enabled. Other players remain
// usable without pretending that an iframe load means successful playback.
export function readPlayerEvent(source, event, frameWindow) {
  if (
    !source ||
    event.source !== frameWindow ||
    event.origin !== new URL(source.src).origin
  )
    return null;
  const data = event.data;
  if (source.id !== "nika" || !data || data.source !== "nikastream")
    return null;
  const [, , type, id, episode, audio] = new URL(source.src).pathname.split(
    "/",
  );
  if (
    data.type !== type ||
    String(data.id) !== id ||
    Number(data.ep) !== Number(episode) ||
    data.lang !== audio
  )
    return null;
  if (data.event === "complete") return { type: "complete" };
  if (data.event === "error") return { type: "error" };
  if (
    ["time", "watching-log"].includes(data.event) &&
    Number.isFinite(data.time) &&
    Number.isFinite(data.duration) &&
    data.time >= 0 &&
    data.duration > 0 &&
    data.time <= data.duration + 5
  )
    return { type: "progress", time: data.time, duration: data.duration };
  return null;
}
