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
const originalFetch = globalThis.fetch;
const originalMappings = process.env.ANIME_BANGUMI_MAPPINGS;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalMappings === undefined) delete process.env.ANIME_BANGUMI_MAPPINGS;
  else process.env.ANIME_BANGUMI_MAPPINGS = originalMappings;
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
