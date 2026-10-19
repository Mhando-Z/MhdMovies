import Link from "next/link";

export default function AnimeNotFound() {
  return (
    <main className="flex min-h-[70svh] items-center justify-center bg-black px-5 pb-16 pt-32 text-white">
      <div className="max-w-md text-center">
        <p className="mb-3 text-xs uppercase tracking-widest text-red-400">
          Lost between worlds
        </p>
        <h1 className="text-3xl font-bold">Anime or episode not found</h1>
        <p className="mt-4 text-sm leading-7 text-white/55">
          This link may be incomplete or the entry is no longer in the catalog.
        </p>
        <Link
          href="/anime"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-red-600 px-5 text-sm font-medium hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
        >
          Explore anime
        </Link>
      </div>
    </main>
  );
}
