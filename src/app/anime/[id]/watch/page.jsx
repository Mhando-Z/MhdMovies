import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { canWatchEpisode, getAnime } from "@/lib/anime/catalogue";
import { getPlaybackAnime } from "@/lib/anime/playback";
import AnimeWatch from "@/components/anime/AnimeWatch";
import { AnimeLoading } from "@/components/anime/AnimeUI";

export const metadata = {
  title: "Watch anime",
  robots: { index: false, follow: true },
};

async function AnimeWatchContent({ params, searchParams }) {
  // Cache freshness and episode release checks must use the live request clock.
  await connection();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const episode = query.episode === undefined ? 1 : Number(query.episode);
  const audio = query.audio || "sub";
  if (
    !Number.isSafeInteger(episode) ||
    episode < 1 ||
    episode > 100000 ||
    !["sub", "dub"].includes(audio)
  )
    notFound();
  let anime;
  try {
    anime = await getAnime(id);
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }
  anime = await getPlaybackAnime(anime);
  const [playable, nextPlayable] = await Promise.all([
    canWatchEpisode(anime, episode, audio),
    canWatchEpisode(anime, episode + 1, audio),
  ]);
  return (
    <AnimeWatch
      anime={anime}
      episode={episode}
      audio={audio}
      playable={playable}
      nextEpisode={nextPlayable ? episode + 1 : null}
    />
  );
}

export default function AnimeWatchPage({ params, searchParams }) {
  return (
    <Suspense fallback={<AnimeLoading />}>
      <AnimeWatchContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
