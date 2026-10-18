import { Suspense } from "react";
import { MovieDetailsProvider } from "@/context/movieDetailsContext";
import MovieDetails from "@/components/pages/movieDetails";
import Loading from "./loading";

async function MovieRoute({ params }) {
  const { id } = await params;
  return (
    <MovieDetailsProvider key={id} id={id}>
      <MovieDetails />
    </MovieDetailsProvider>
  );
}

export default function MoviePage({ params }) {
  return (
    <Suspense fallback={<Loading />}>
      <MovieRoute params={params} />
    </Suspense>
  );
}
