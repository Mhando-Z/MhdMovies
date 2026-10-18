import { Suspense } from "react";
import ActorDetails from "@/components/actors/ActorDetails";
import { ActorLoading } from "@/components/actors/ActorUI";

export const metadata = {
  title: "Actor profile",
  description:
    "Explore an actor's biography, movie and television credits, and photo gallery.",
};

async function ActorRoute({ params }) {
  const { id } = await params;
  return <ActorDetails key={id} id={id} />;
}

export default function ActorPage({ params }) {
  return (
    <Suspense fallback={<ActorLoading />}>
      <ActorRoute params={params} />
    </Suspense>
  );
}
