import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { registerHooks } from "node:module";
import { getTvSources, isEpisodeReleased } from "../src/lib/tvseries.js";

registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export{}", shortCircuit: true };
    if (specifier.startsWith("@/"))
      return next(
        new URL(`../src/${specifier.slice(2)}.js`, import.meta.url).href,
        context,
      );
    return next(specifier, context);
  },
});
const { tvmazeDetails } = await import("../src/lib/tmdbTV.js");
const { GET: search } = await import("../src/app/api/search/route.js");
const { GET: series } = await import("../src/app/api/tvseries/route.js");
const { GET: subtitles } = await import("../src/app/api/subtitles/route.js");
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("episode embeds preserve provider-specific IDs and episode selection", () => {
  for (const show of [{ id: 1399 }, { id: 1399, imdb_id: "tt0944947" }]) {
    const sources = getTvSources(show, 2, 3);
    assert.equal(sources.length, 2);
    assert.ok(sources[0].src.endsWith(`/${show.imdb_id || show.id}/2/3`));
    const url = new URL(sources[1].src);
    assert.equal(
      url.searchParams.get("video_id"),
      show.imdb_id || String(show.id),
    );
    assert.equal(url.searchParams.get("s"), "2");
    assert.equal(url.searchParams.get("e"), "3");
    assert.equal(url.searchParams.get("tmdb"), show.imdb_id ? null : "1");
  }
  assert.deepEqual(getTvSources({ id: "1/../../movie" }, 1, 1), []);
  assert.deepEqual(getTvSources({ id: 1399 }, -1, 1), []);
  assert.deepEqual(getTvSources({ id: 1399 }, 1, 0), []);
  assert.equal(getTvSources({ id: 1399 }, 0, 1).length, 2);
});

test("future, unknown and invalid episode dates never enable playback", () => {
  const now = new Date("2026-10-19T12:00:00Z");
  assert.equal(
    isEpisodeReleased({ episode_number: 1, air_date: "2026-10-18" }, now),
    true,
  );
  for (const air_date of [null, "", "unknown", "2026-10-20"])
    assert.equal(
      isEpisodeReleased({ episode_number: 1, air_date }, now),
      false,
    );
});

test("TVmaze lookup falls back from IMDb to TVDB without title guessing", async () => {
  const calls = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    calls.push(url);
    if (url.includes("imdb=")) return new Response(null, { status: 404 });
    if (url.includes("thetvdb=")) return Response.json({ id: 82 });
    return Response.json({
      id: 82,
      status: "Ended",
      _embedded: { previousepisode: { id: 123 } },
    });
  };
  const result = await tvmazeDetails({ imdb_id: "tt0944947", tvdb_id: 121361 });
  assert.equal(result.id, 82);
  assert.equal(result.previousEpisode.id, 123);
  assert.equal(result.nextEpisode, null);
  assert.equal(calls.length, 3);
  assert.ok(calls[2].includes("/shows/82?"));
});

test("missing external identifiers skip TVmaze requests", async () => {
  globalThis.fetch = () => {
    throw new Error("Unexpected request");
  };
  assert.equal(await tvmazeDetails({}), null);
});

test("invalid search, catalogue and episode subtitle filters never reach providers", async () => {
  globalThis.fetch = () => {
    throw new Error("Unexpected request");
  };
  for (const query of ["category=toString", "page=501", "genre=bad"])
    assert.equal(
      (await series(new Request(`https://local/api/tvseries?${query}`))).status,
      400,
    );
  assert.equal(
    (await search(new Request("https://local/api/search?type=person"))).status,
    400,
  );
  assert.equal(
    (
      await subtitles(
        new Request(
          "https://local/api/subtitles?tmdb_id=1399&type=tv&season=1",
        ),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await subtitles(
        new Request(
          "https://local/api/subtitles?tmdb_id=1399&type=movie&season=1&episode=1",
        ),
      )
    ).status,
    400,
  );
});

test("search keeps movie and TV IDs separate and filters people and adult results", async () => {
  const previous = process.env.TMDB_ACCESS_TOKEN;
  process.env.TMDB_ACCESS_TOKEN = "test-only";
  globalThis.fetch = async () =>
    Response.json({
      page: 1,
      total_pages: 800,
      results: [
        { id: 10, media_type: "movie" },
        { id: 10, media_type: "tv" },
        { id: 11, media_type: "person" },
        { id: 12, media_type: "movie", adult: true },
      ],
    });
  try {
    const response = await search(
      new Request("https://local/api/search?query=test"),
    );
    const data = await response.json();
    assert.deepEqual(
      data.results.map((item) => item.media_type),
      ["movie", "tv"],
    );
    assert.equal(data.total_pages, 500);
  } finally {
    if (previous === undefined) delete process.env.TMDB_ACCESS_TOKEN;
    else process.env.TMDB_ACCESS_TOKEN = previous;
  }
});
