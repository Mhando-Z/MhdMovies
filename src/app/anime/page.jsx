import { Suspense } from "react";
import AnimeDirectory from "@/components/anime/AnimeDirectory";
import { AnimeLoading } from "@/components/anime/AnimeUI";

export const metadata = {
  title: "Anime & Donghua",
  description:
    "Discover Japanese anime and Chinese donghua. Explore trending titles, episodes, sequels, and your next favourite story.",
};

export default function AnimePage() {
  return (
    <Suspense fallback={<AnimeLoading />}>
      <AnimeDirectory />
    </Suspense>
  );
}
