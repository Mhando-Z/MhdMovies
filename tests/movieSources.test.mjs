import assert from "node:assert/strict";
import { test } from "node:test";
import { getMovieSources } from "../src/lib/movieSources.js";

test("movie IDs map to distinct HTTPS providers without reusing the example movie", () => {
  const sources = getMovieSources({ id: 550, imdb_id: "tt0137523" });
  assert.equal(sources.length, 6);
  assert.equal(
    new Set(sources.map((source) => source.id)).size,
    sources.length,
  );
  for (const source of sources) {
    const url = new URL(source.src);
    assert.equal(url.protocol, "https:");
    assert.ok(
      source.src.includes(source.id === "videasy" ? "550" : "tt0137523"),
    );
    assert.ok(!source.src.includes("969681"));
  }
});

test("SuperEmbed modes distinguish numeric TMDB IDs from IMDb IDs", () => {
  for (const movie of [{ id: 550 }, { id: 550, imdb_id: "tt0137523" }]) {
    const sources = getMovieSources(movie).filter((source) =>
      source.id.startsWith("superembed"),
    );
    assert.equal(sources.length, 2);
    for (const source of sources) {
      const url = new URL(source.src);
      assert.equal(url.searchParams.get("video_id"), movie.imdb_id ?? "550");
      assert.equal(url.searchParams.get("tmdb"), movie.imdb_id ? null : "1");
    }
  }
});

test("malformed IMDb IDs fall back to the numeric TMDB ID", () => {
  for (const imdb_id of [null, "", "tt1?other=value", "javascript:alert(1)"]) {
    const sources = getMovieSources({ id: 550, imdb_id });
    assert.equal(sources.length, 6);
    assert.ok(sources.every((source) => source.src.includes("550")));
  }
});

test("invalid or missing movie IDs never generate broken embeds", () => {
  for (const movie of [
    null,
    {},
    { id: 0 },
    { id: -1 },
    { id: "550/../../tv" },
  ]) {
    assert.deepEqual(getMovieSources(movie), []);
  }
});

test("IMDb-only movies omit the TMDB-only Videasy source", () => {
  const sources = getMovieSources({ imdb_id: "tt0137523" });
  assert.equal(sources.length, 5);
  assert.ok(sources.every((source) => source.id !== "videasy"));
});

test("VidFast uses documented options and defers autoplay", () => {
  const url = new URL(
    getMovieSources({ id: 550 }).find((source) => source.id === "vidfast").src,
  );
  assert.equal(url.pathname, "/movie/550");
  assert.equal(url.searchParams.get("autoPlay"), "false");
  assert.equal(url.searchParams.get("theme"), "dc2626");
});
