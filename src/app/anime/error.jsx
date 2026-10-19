"use client";

import Link from "next/link";
import { button } from "@/components/anime/AnimeUI";

export default function AnimeError({ retry }) {
  return (
    <main className="flex min-h-[70svh] items-center justify-center bg-black px-5 pb-16 pt-32 text-white">
      <div className="max-w-md text-center">
        <p className="mb-3 text-xs uppercase tracking-widest text-red-400">
          A brief intermission
        </p>
        <h1 className="text-3xl font-bold">Couldn't load this anime</h1>
        <p className="mt-4 text-sm leading-7 text-white/55">
          The anime service may be busy. Please try again in a moment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={retry}
            className={`${button} bg-red-600 hover:bg-red-700`}
          >
            Try again
          </button>
          <Link href="/anime" className={button}>
            Browse anime
          </Link>
        </div>
      </div>
    </main>
  );
}
