import { TvSeriesProvider } from "@/context/tvseriesContext";
import TvDirectory from "@/components/tvSeries/TvDirectory";

export const metadata = {
  title: "TV Series",
  description:
    "Discover trending, popular and top-rated TV series. Explore seasons, episodes and upcoming releases.",
};

export default function SeriesPage() {
  return (
    <TvSeriesProvider>
      <TvDirectory />
    </TvSeriesProvider>
  );
}
