import { Suspense } from "react";
import TvDetails, { TvDetailsLoading } from "@/components/tvSeries/TvDetails";

export const metadata = {
  title: "Series details",
  description:
    "Explore TV series, seasons, episodes, cast, trailers and subtitles.",
};

async function SeriesRoute({ params }) {
  const { id } = await params;
  return <TvDetails key={id} id={id} />;
}

export default function SeriesPage({ params }) {
  return (
    <Suspense fallback={<TvDetailsLoading />}>
      <SeriesRoute params={params} />
    </Suspense>
  );
}
