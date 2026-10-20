import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export{}", shortCircuit: true };
    if (specifier.startsWith("@/"))
      return next(
        new URL(`../src/${specifier.slice(2)}.js`, import.meta.url).href,
        context,
      );
    if (
      specifier.startsWith("./") &&
      context.parentURL?.includes("/lib/anime/") &&
      !specifier.endsWith(".js")
    )
      return next(`${specifier}.js`, context);
    return next(specifier, context);
  },
});
const { normalizeAnime, releasedEpisodeCount } =
  await import("../src/lib/anime/model.js");
const { getAnimeSources, readPlayerEvent } =
  await import("../src/lib/anime/sources.js");
const { canWatchEpisode, getChineseDetails, getCatalogue, getAnime, getHome } =
  await import("../src/lib/anime/catalogue.js");
const { GET: catalogueRoute } = await import("../src/app/api/anime/route.js");
const { getAnimeLogo } = await import("../src/lib/anime/tmdb.js");
const originalFetch = globalThis.fetch;
const originalMappings = process.env.ANIME_BANGUMI_MAPPINGS;
const logoEnvKeys = ["TMDB_ACCESS_TOKEN", "NEXT_PUBLIC_TMDB_ACCESS_TOKEN", "ANIME_TMDB_MAPPINGS"];
const originalLogoEnv = Object.fromEntries(logoEnvKeys.map((key) => [key, process.env[key]]));
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalMappings === undefined) delete process.env.ANIME_BANGUMI_MAPPINGS;
  else process.env.ANIME_BANGUMI_MAPPINGS = originalMappings;
  for (const key of logoEnvKeys) {
    if (originalLogoEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalLogoEnv[key];
  }
});

const logoAnime = {
  id: 1, title: "Example Anime", nativeTitle: "", aliases: [],
  year: 2024, country: "JP", format: "TV",
};
const tmdbMatch = {
  id: 42, name: "Example Anime", first_air_date: "2024-01-01",
  genre_ids: [16], origin_country: ["JP"], original_language: "ja",
};

test("anime logos search TV and movies separately and prefer English artwork", async () => {
  process.env.TMDB_ACCESS_TOKEN = "test-token";
  delete process.env.ANIME_TMDB_MAPPINGS;
  for (const type of ["tv", "movie"]) {
    const paths = [];
    globalThis.fetch = async (input, options) => {
      const url = new URL(input);
      paths.push(url.pathname);
      assert.equal(options.headers.Authorization, "Bearer test-token");
      if (url.pathname.includes("/search/")) {
        assert.equal(url.searchParams.get("query"), logoAnime.title);
        return Response.json({ results: [tmdbMatch] });
      }
      assert.equal(url.searchParams.get("language"), "");
      return Response.json({ logos: [
        { file_path: "/native.png", iso_639_1: "ja", vote_average: 10 },
        { file_path: "/english.svg", iso_639_1: "en", width: 500, height: 200 },
      ] });
    };
    assert.deepEqual(await getAnimeLogo({ ...logoAnime, format: type === "movie" ? "MOVIE" : "TV" }), {
      url: "https://image.tmdb.org/t/p/original/english.svg", width: 500, height: 200,
    });
    assert.deepEqual(paths, [`/3/search/${type}`, `/3/${type}/42/images`]);
  }
});

test("anime logo matching rejects unrelated, live-action, wrong-year, and ambiguous results", async () => {
  process.env.TMDB_ACCESS_TOKEN = "test-token";
  delete process.env.ANIME_TMDB_MAPPINGS;
  for (const results of [
    [], [{ ...tmdbMatch, name: "Another show" }],
    [{ ...tmdbMatch, genre_ids: [18] }],
    [{ ...tmdbMatch, first_air_date: "2001-01-01" }],
    [{ ...tmdbMatch, origin_country: ["US"], original_language: "en" }],
    [tmdbMatch, { ...tmdbMatch, id: 43 }],
  ]) {
    globalThis.fetch = async (input) => {
      assert.match(new URL(input).pathname, /search/);
      return Response.json({ results });
    };
    assert.equal(await getAnimeLogo(logoAnime), null);
  }
});

test("verified anime mappings support grouped sequels and native logo fallback", async () => {
  process.env.TMDB_ACCESS_TOKEN = "test-token";
  process.env.ANIME_TMDB_MAPPINGS = '{"1":{"type":"tv","id":42}}';
  globalThis.fetch = async (input) => {
    assert.equal(new URL(input).pathname, "/3/tv/42/images");
    return Response.json({ logos: [{ file_path: "/native.png", iso_639_1: "ja", width: 300, height: 100 }] });
  };
  assert.equal((await getAnimeLogo({ ...logoAnime, year: 2026 })).url,
    "https://image.tmdb.org/t/p/original/native.png");
});

test("optional logos tolerate missing credentials, errors, and empty image lists", async () => {
  delete process.env.TMDB_ACCESS_TOKEN;
  delete process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  globalThis.fetch = () => { throw new Error("Unexpected fetch"); };
  assert.equal(await getAnimeLogo(logoAnime), null);
  process.env.TMDB_ACCESS_TOKEN = "test-token";
  process.env.ANIME_TMDB_MAPPINGS = '{"1":{"type":"tv","id":42}}';
  globalThis.fetch = async () => new Response(null, { status: 429 });
  assert.equal(await getAnimeLogo(logoAnime), null);
  globalThis.fetch = async () => Response.json({ logos: [] });
  assert.equal(await getAnimeLogo(logoAnime), null);
});

test("anime IDs remain separate and missing MAL IDs use AniList routes", () => {
  const sources = getAnimeSources({ id: 16498, malId: 5114 }, 7, "dub");
  assert.equal(sources[0].src, "https://zokoanime.video/stream/mal/5114/7/dub");
  assert.equal(sources[1].src, "https://nikastream.blog/embed/mal/5114/7/dub");
  assert.equal(sources[2].src, "https://anilink.cc/watch/16498/7?variant=dub");
  assert.match(
    getAnimeSources({ id: 16498 }, 1)[0].src,
    /anilist\/16498\/1\/sub$/,
  );
  assert.deepEqual(getAnimeSources({ id: "1/../../" }, 1), []);
  assert.deepEqual(getAnimeSources({ id: 1 }, 0), []);
  assert.deepEqual(getAnimeSources({ id: 1 }, 1, "en<script>"), []);
});

test("player messages require exact frame, origin, identity, and finite progress", () => {
  const source = getAnimeSources({ id: 1, malId: 21 }, 2)[1];
  const frame = {};
  const message = {
    source: frame,
    origin: "https://nikastream.blog",
    data: {
      source: "nikastream",
      type: "mal",
      id: 21,
      ep: 2,
      lang: "sub",
      event: "time",
      time: 60,
      duration: 1200,
    },
  };
  assert.deepEqual(readPlayerEvent(source, message, frame), {
    type: "progress",
    time: 60,
    duration: 1200,
  });
  for (const overrides of [
    { origin: "https://example.com" },
    { source: {} },
    { data: { ...message.data, ep: 3 } },
    { data: { ...message.data, duration: Infinity } },
    { data: { ...message.data, lang: "dub" } },
  ])
    assert.equal(
      readPlayerEvent(source, { ...message, ...overrides }, frame),
      null,
    );
});

test("normalization preserves donghua aliases and filters adult and non-anime relations", () => {
  const result = normalizeAnime({
    id: 1,
    countryOfOrigin: "CN",
    title: { english: "Example", native: "原名", romaji: "Yuan Ming" },
    description: "<b>Story</b><br>Text &amp; more",
    relations: {
      edges: [
        {
          relationType: "SEQUEL",
          node: { id: 2, type: "ANIME", title: { english: "Sequel" } },
        },
        { node: { id: 3, type: "MANGA" } },
        { node: { id: 4, type: "ANIME", isAdult: true } },
      ],
    },
  });
  assert.equal(result.country, "CN");
  assert.deepEqual(result.aliases, ["Yuan Ming", "原名"]);
  assert.equal(result.description, "Story\nText & more");
  assert.equal(result.related.length, 1);
  assert.equal(result.related[0].id, 2);
});

test("upcoming and out-of-range episodes cannot start a player", async () => {
  assert.equal(
    releasedEpisodeCount({
      status: "RELEASING",
      episodes: 24,
      nextAiring: { episode: 4 },
    }),
    3,
  );
  assert.equal(
    await canWatchEpisode({ status: "NOT_YET_RELEASED", episodes: 12 }, 1),
    false,
  );
  assert.equal(
    await canWatchEpisode({ status: "FINISHED", episodes: 12 }, 13),
    false,
  );
  assert.equal(
    await canWatchEpisode({ status: "FINISHED", episodes: 12 }, 12),
    true,
  );
  assert.equal(await canWatchEpisode({ status: "RELEASING" }, 1), false);
  globalThis.fetch = async () =>
    Response.json({ data: { mal_id: 1, aired: "2099-01-01" } });
  assert.equal(
    await canWatchEpisode({ status: "RELEASING", malId: 1 }, 1),
    false,
  );
  globalThis.fetch = async () =>
    Response.json({ data: { mal_id: 1, aired: "2020-01-01" } });
  assert.equal(
    await canWatchEpisode({ status: "RELEASING", malId: 1 }, 1),
    true,
  );
});

test("invalid filters return 400 without calling upstream services", async () => {
  globalThis.fetch = () => {
    throw new Error("Unexpected fetch");
  };
  for (const query of [
    "page=-1",
    "page=1.5",
    "country=XX",
    "year=1",
    "sort=hack",
    "format=INVALID",
    "genre=Invalid",
    "status=INVALID",
    `search=${"a".repeat(151)}`,
  ]) {
    const response = await catalogueRoute(
      new Request(`https://example.com/api/anime?${query}`),
    );
    assert.equal(response.status, 400, query);
  }
});

test("catalog filters are GraphQL variables and never interpolated into queries", async () => {
  let body;
  globalThis.fetch = async (_url, options) => {
    body = JSON.parse(options.body);
    return Response.json({
      data: { Page: { pageInfo: { hasNextPage: false }, media: [] } },
    });
  };
  await getCatalogue(
    new URLSearchParams({
      search: 'A "title"',
      country: "CN",
      year: "2024",
      sort: "score",
    }),
  );
  assert.equal(body.variables.country, "CN");
  assert.equal(body.variables.year, 2024);
  assert.equal(body.variables.search, 'A "title"');
  assert.deepEqual(body.variables.sort, ["SCORE_DESC"]);
  assert.ok(!body.query.includes('A "title"'));
  assert.ok(!Object.hasOwn(body.variables, "format"));
  assert.ok(!Object.hasOwn(body.variables, "status"));
  await getCatalogue(new URLSearchParams());
  assert.deepEqual(Object.keys(body.variables).sort(), ["page", "sort"]);
});

test("provider throttling and malformed GraphQL responses return controlled errors", async () => {
  globalThis.fetch = async () => new Response(null, { status: 429 });
  assert.equal(
    (await catalogueRoute(new Request("https://example.com/api/anime"))).status,
    429,
  );
  globalThis.fetch = async () =>
    Response.json({ errors: [{ message: "internal detail" }] });
  await assert.rejects(getHome(), /could not be loaded/);
});

test("Bangumi is queried only for explicitly mapped Chinese entries", async () => {
  globalThis.fetch = () => {
    throw new Error("Unexpected fetch");
  };
  assert.equal(await getChineseDetails({ id: 1, country: "CN" }), null);
  process.env.ANIME_BANGUMI_MAPPINGS = '{"1":42}';
  assert.equal(await getChineseDetails({ id: 1, country: "JP" }), null);
  let called;
  globalThis.fetch = async (url) => {
    called = url;
    return Response.json({ id: 42, type: 2, name_cn: "名称" });
  };
  assert.equal(
    (await getChineseDetails({ id: 1, country: "CN" })).title,
    "名称",
  );
  assert.equal(called, "https://api.bgm.tv/v0/subjects/42");
});

test("invalid title IDs are rejected before any API call", async () => {
  globalThis.fetch = () => {
    throw new Error("Unexpected fetch");
  };
  await assert.rejects(getAnime("../../etc"), { status: 404 });
});
