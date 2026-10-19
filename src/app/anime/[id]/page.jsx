import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAnime } from "@/lib/anime/catalogue";
import AnimeDetails from "@/components/anime/AnimeDetails";
import { AnimeLoading } from "@/components/anime/AnimeUI";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const anime = await getAnime(id);
    return {
      title: anime.title,
      description: anime.description.slice(0, 160),
      openGraph: {
        images: anime.cover ? [{ url: anime.cover, alt: anime.title }] : [],
      },
    };
  } catch {
    return { title: "Anime" };
  }
}

async function AnimeTitleContent({ params }) {
  const { id } = await params;
  let anime;
  try {
    anime = await getAnime(id);
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }
  return <AnimeDetails anime={anime} />;
}

export default function AnimeTitlePage({ params }) {
  return (
    <Suspense fallback={<AnimeLoading />}>
      <AnimeTitleContent params={params} />
    </Suspense>
  );
}
