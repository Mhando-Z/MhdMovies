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
      !/\.(js|json)$/.test(specifier)
    )
      return next(`${specifier}.js`, context);
    return next(specifier, context);
  },
});
const {
  normalizeAnime,
  normalizeMalAnime,
  releasedEpisodeCount,
  validAnimeKey,
  episodeAvailability,
} = await import("../src/lib/anime/model.js");
const { getPlaybackAnime, validEpisodeEmbed } = await import("../src/lib/anime/playback.js");
const { getAnimeSources, readPlayerEvent } =
  await import("../src/lib/anime/sources.js");
const {
  canWatchEpisode,
  getChineseDetails,
  getCatalogue,
  getAnime,
  getHome,
  getEpisodes,
} = await import("../src/lib/anime/catalogue.js");
const { GET: catalogueRoute } = await import("../src/app/api/anime/route.js");
const { getAnimeLogo } = await import("../src/lib/anime/tmdb.js");
const { animeTransport, createAnimeTransport } =
  await import("../src/lib/anime/transport.js");
const { getMalAnime, getMalCatalogue } =
  await import("../src/lib/anime/mal.js");
Object.assign(
  animeTransport,
  createAnimeTransport({ directory: false, interval: 0 }),
);
process.env.MAL_CLIENT_ID = "test-client";
const originalFetch = globalThis.fetch;
const originalMappings = process.env.ANIME_BANGUMI_MAPPINGS;
const originalStreamMappings = process.env.ANIME_STREAM_MAPPINGS;
const logoEnvKeys = [
  "TMDB_ACCESS_TOKEN",
  "NEXT_PUBLIC_TMDB_ACCESS_TOKEN",
  "ANIME_TMDB_MAPPINGS",
];
const originalLogoEnv = Object.fromEntries(
  logoEnvKeys.map((key) => [key, process.env[key]]),
);
afterEach(() => {
  Object.assign(
    animeTransport,
    createAnimeTransport({ directory: false, interval: 0 }),
  );
  globalThis.fetch = originalFetch;
  if (originalMappings === undefined) delete process.env.ANIME_BANGUMI_MAPPINGS;
  else process.env.ANIME_BANGUMI_MAPPINGS = originalMappings;
  if (originalStreamMappings === undefined) delete process.env.ANIME_STREAM_MAPPINGS;
  else process.env.ANIME_STREAM_MAPPINGS = originalStreamMappings;
  for (const key of logoEnvKeys) {
    if (originalLogoEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalLogoEnv[key];
  }
});

const streamAnime = { id: "mal-99", malId: 99, anilistId: 199, status: "RELEASING", episodes: 12 };
const streamEpisode = (number, audio = "sub") => ({ number, title: `Episode ${number}`,
  embed_url: { [audio]: `https://megaplay.buzz/stream/s-2/${1000 + number}/${audio}` } });
const streamResponse = (episodes, anime = { id: 7, mal_id: "99", ani_id: "199" }) =>
  Response.json({ ok: true, data: { anime, episodes } });

test("listed donghua episodes unlock only their audio without inventing broadcast dates", async () => {
  process.env.ANIME_STREAM_MAPPINGS = '{"mal-99":{"seriesId":7}}';
  globalThis.fetch = async (url) => {
    assert.equal(url, "https://anikotoapi.site/series/7");
    return streamResponse([streamEpisode(1), streamEpisode(3, "dub")]);
  };
  const anime = await getPlaybackAnime(streamAnime);
  assert.equal(anime.streamState, "checked");
  assert.equal(await canWatchEpisode(anime, 1, "sub"), true);
  assert.deepEqual(episodeAvailability(anime, 1), { aired: false, streamListed: true, canWatch: true });
  assert.equal(episodeAvailability(anime, 1, null, "dub").canWatch, false);
  assert.equal(episodeAvailability(anime, 2).canWatch, false);
  assert.equal(episodeAvailability(anime, 3, null, "dub").canWatch, true);
  assert.equal(episodeAvailability({ ...anime, status: "CANCELLED" }, 1).canWatch, false);
  assert.equal(await canWatchEpisode({ ...anime, status: "NOT_YET_RELEASED" }, 1), false);
  assert.equal(await canWatchEpisode({ ...anime, episodes: 2 }, 3, "dub"), false);
  const sources = getAnimeSources(anime, 1);
  assert.equal(sources[0].id, "anikoto");
  assert.equal(sources[0].availability, "listed");
  assert.equal(sources[1].src, "https://supaplay.fun/stream/s-2/1001/sub");
  assert.equal(sources[1].availability, "unknown");
  assert.ok(getAnimeSources(anime, 1, "dub").every((item) => item.availability === "unknown"));
});

test("discovery matches exact IDs, rejects ambiguous results, and never matches titles", async () => {
  delete process.env.ANIME_STREAM_MAPPINGS;
  for (const rows of [
    [{ id: 7, mal_id: "99", ani_id: "199" }],
    [{ id: 7, mal_id: "98", ani_id: "199", title: "Identical name" }],
    [{ id: 7, mal_id: "99", ani_id: "199" }, { id: 8, mal_id: "99", ani_id: "199" }],
  ]) {
    Object.assign(animeTransport, createAnimeTransport({ directory: false, interval: 0 }));
    let seriesCalls = 0;
    globalThis.fetch = async (url) => {
      if (url.includes("recent-anime")) return Response.json({ ok: true, data: rows });
      seriesCalls++;
      return streamResponse([streamEpisode(1)]);
    };
    const anime = await getPlaybackAnime(streamAnime);
    assert.equal(anime.streamEpisodes.length, rows.length === 1 && rows[0].mal_id === "99" ? 1 : 0);
    assert.equal(seriesCalls, anime.streamEpisodes.length);
  }
});

test("series identity is rechecked after discovery or a configured mapping", async () => {
  process.env.ANIME_STREAM_MAPPINGS = '{"mal-99":{"seriesId":7}}';
  globalThis.fetch = async () => streamResponse([streamEpisode(1)], { id: 7, mal_id: 98, ani_id: 199 });
  const anime = await getPlaybackAnime(streamAnime);
  assert.deepEqual(anime.streamEpisodes, []);
});

test("legacy AniList titles can use an exact shared MAL ID when the provider omits AniList", async () => {
  process.env.ANIME_STREAM_MAPPINGS = '{"mal-99":{"seriesId":7}}';
  globalThis.fetch = async () => streamResponse([streamEpisode(1)], { id: 7, mal_id: 99, ani_id: "" });
  const anime = await getPlaybackAnime({ ...streamAnime, id: 199 });
  assert.equal(anime.streamEpisodes.length, 1);
  assert.equal(anime.anilistId, 199);
});

test("explicit season mappings translate sparse episode numbers without guessing offsets", async () => {
  process.env.ANIME_STREAM_MAPPINGS = JSON.stringify({ "mal-99": {
    seriesId: 7, providerMalId: 98, episodeMap: { 1: 101, 2: 103, 13: 104 },
  } });
  globalThis.fetch = async () => streamResponse([streamEpisode(101), streamEpisode(103), streamEpisode(104)],
    { id: 7, mal_id: 98 });
  const anime = await getPlaybackAnime(streamAnime);
  assert.deepEqual(anime.streamEpisodes.map((item) => item.number), [1, 2]);
  assert.equal(getAnimeSources(anime, 2)[0].src, "https://megaplay.buzz/stream/s-2/1103/sub");
});

test("episode embeds reject untrusted hosts, credentials, paths, and audio mismatches", () => {
  for (const url of ["javascript:alert(1)", "http://megaplay.buzz/stream/s-2/1/sub",
    "https://megaplay.buzz.evil.test/stream/s-2/1/sub", "https://user:pass@megaplay.buzz/stream/s-2/1/sub",
    "https://megaplay.buzz/stream/s-2/1/dub", "https://megaplay.buzz/stream/s-2/1/sub?redirect=bad",
    "https://megaplay.buzz:444/stream/s-2/1/sub"])
    assert.equal(validEpisodeEmbed(url, "sub"), null);
  assert.equal(validEpisodeEmbed("https://megaplay.buzz/stream/s-2/1/sub", "sub"),
    "https://megaplay.buzz/stream/s-2/1/sub");
});

test("duplicate, fractional, unsafe, and out-of-range provider episodes do not unlock playback", async () => {
  process.env.ANIME_STREAM_MAPPINGS = '{"mal-99":{"seriesId":7}}';
  globalThis.fetch = async () => streamResponse([streamEpisode(1), streamEpisode(1), streamEpisode(1.5),
    streamEpisode(13), { ...streamEpisode(2), embed_url: { sub: "https://evil.test/stream/s-2/2/sub" } }]);
  assert.deepEqual((await getPlaybackAnime(streamAnime)).streamEpisodes, []);
});

test("provider outages leave catalog playback usable and do not assert availability", async () => {
  process.env.ANIME_STREAM_MAPPINGS = '{"mal-99":{"seriesId":7}}';
  globalThis.fetch = async () => new Response(null, { status: 503 });
  const anime = await getPlaybackAnime({ ...streamAnime, status: "FINISHED" });
  assert.equal(anime.streamState, "unavailable");
  assert.equal(await canWatchEpisode(anime, 1), true);
  assert.deepEqual(anime.streamEpisodes, []);
  assert.equal(getAnimeSources(anime, 1).length, 3);
});

test("MAL playback gains AniLink only from a verified reverse mapping", async () => {
  process.env.ANIME_STREAM_MAPPINGS = '{"mal-99":false}';
  globalThis.fetch = async (url) => {
    assert.equal(url, "https://api.ani.zip/mappings?mal_id=99");
    return Response.json({ mappings: { mal_id: 99, anilist_id: 199 } });
  };
  const anime = await getPlaybackAnime({ ...streamAnime, anilistId: null });
  assert.equal(anime.anilistId, 199);
  assert.equal(getAnimeSources(anime, 1).at(-1).id, "anilink");
  Object.assign(animeTransport, createAnimeTransport({ directory: false, interval: 0 }));
  globalThis.fetch = async () => Response.json({ mappings: { mal_id: 98, anilist_id: 199 } });
  const rejected = await getPlaybackAnime({ ...streamAnime, anilistId: null });
  assert.equal(rejected.anilistId, null);
  assert.equal(getAnimeSources(rejected, 1).length, 2);
});

test("provider episodes merge into paginated metadata even when Jikan returns no rows", async () => {
  globalThis.fetch = async () => Response.json({ data: [], pagination: { has_next_page: false } });
  const anime = { ...streamAnime, episodes: null, streamState: "checked", streamEpisodes: [
    { number: 1, title: "First", streams: { sub: "listed" } },
    { number: 101, title: "Next range", streams: { dub: "listed" } },
  ] };
  const first = await getEpisodes(anime, 1);
  assert.equal(first.hasNextPage, true);
  assert.deepEqual(first.results, [{ number: 1, title: "First", aired: null, streamAudio: ["sub"] }]);
  const second = await getEpisodes(anime, 2);
  assert.equal(second.hasNextPage, false);
  assert.equal(second.results[0].number, 101);
  assert.equal(episodeAvailability(anime, 101, second.results[0], "dub").canWatch, true);
});

const logoAnime = {
  id: 1,
  title: "Example Anime",
  nativeTitle: "",
  aliases: [],
  year: 2024,
  country: "JP",
  format: "TV",
};
const tmdbMatch = {
  id: 42,
  name: "Example Anime",
  first_air_date: "2024-01-01",
  genre_ids: [16],
  origin_country: ["JP"],
  original_language: "ja",
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
      return Response.json({
        logos: [
          { file_path: "/native.png", iso_639_1: "ja", vote_average: 10 },
          {
            file_path: "/english.svg",
            iso_639_1: "en",
            width: 500,
            height: 200,
          },
        ],
      });
    };
    assert.deepEqual(
      await getAnimeLogo({
        ...logoAnime,
        format: type === "movie" ? "MOVIE" : "TV",
      }),
      {
        url: "https://image.tmdb.org/t/p/original/english.svg",
        width: 500,
        height: 200,
      },
    );
    assert.deepEqual(paths, [`/3/search/${type}`, `/3/${type}/42/images`]);
  }
});

test("anime logo matching rejects unrelated, live-action, wrong-year, and ambiguous results", async () => {
  process.env.TMDB_ACCESS_TOKEN = "test-token";
  delete process.env.ANIME_TMDB_MAPPINGS;
  for (const results of [
    [],
    [{ ...tmdbMatch, name: "Another show" }],
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
    return Response.json({
      logos: [
        { file_path: "/native.png", iso_639_1: "ja", width: 300, height: 100 },
      ],
    });
  };
  assert.equal(
    (await getAnimeLogo({ ...logoAnime, year: 2026 })).url,
    "https://image.tmdb.org/t/p/original/native.png",
  );
});

test("optional logos tolerate missing credentials, errors, and empty image lists", async () => {
  delete process.env.TMDB_ACCESS_TOKEN;
  delete process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  globalThis.fetch = () => {
    throw new Error("Unexpected fetch");
  };
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
    await canWatchEpisode({ status: "RELEASING", malId: 2 }, 1),
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
  await getCatalogue(new URLSearchParams({ country: "JP" }));
  assert.deepEqual(Object.keys(body.variables).sort(), [
    "country",
    "page",
    "sort",
  ]);
});

test("provider throttling and malformed GraphQL responses return controlled errors", async () => {
  globalThis.fetch = async () => new Response(null, { status: 429 });
  assert.equal(
    (await catalogueRoute(new Request("https://example.com/api/anime"))).status,
    429,
  );
  globalThis.fetch = async () =>
    Response.json({ errors: [{ message: "internal detail" }] });
  Object.assign(
    animeTransport,
    createAnimeTransport({ directory: false, interval: 0 }),
  );
  await assert.rejects(getHome(), /unavailable/);
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

test("MAL records use distinct URL keys and never invent country or aired counts", () => {
  const anime = normalizeMalAnime({
    id: 5114,
    title: "Fullmetal Alchemist",
    status: "currently_airing",
    num_episodes: 64,
  });
  assert.equal(anime.id, "mal-5114");
  assert.equal(anime.malId, 5114);
  assert.equal(anime.anilistId, null);
  assert.equal(anime.country, null);
  assert.equal(releasedEpisodeCount(anime), null);
  assert.equal(validAnimeKey("mal-5114"), true);
  assert.equal(validAnimeKey("mal-../20"), false);
  const sources = getAnimeSources(anime, 1);
  assert.equal(sources.length, 2);
  assert.match(sources[0].src, /\/mal\/5114\/1\/sub$/);
  assert.ok(sources.every((source) => source.id !== "anilink"));
});

test("MAL search sends credentials only in a server header and encodes the query", async () => {
  globalThis.fetch = async (input, options) => {
    const url = new URL(input);
    assert.equal(url.host, "api.myanimelist.net");
    assert.equal(url.searchParams.get("q"), 'A "title" & another');
    assert.equal(url.searchParams.get("offset"), "24");
    assert.equal(options.headers["X-MAL-CLIENT-ID"], "test-client");
    assert.ok(!url.href.includes("test-client"));
    return Response.json({
      data: [
        { node: { id: 20, title: "Naruto", nsfw: "white" } },
        { node: { id: 2, title: "Adult", nsfw: "black" } },
      ],
      paging: { next: "next" },
    });
  };
  const data = await getCatalogue(
    new URLSearchParams({ search: 'A "title" & another', page: "2" }),
  );
  assert.equal(data.provider, "mal");
  assert.deepEqual(
    data.results.map((anime) => anime.id),
    ["mal-20"],
  );
  assert.equal(data.hasNextPage, true);
});

test("MAL outage falls back to Jikan details with the same MAL identity", async () => {
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    if (url.includes("api.myanimelist"))
      return new Response(null, { status: 503 });
    return Response.json({
      data: {
        mal_id: 20,
        title: "Naruto",
        episodes: 220,
        status: "Finished Airing",
      },
    });
  };
  const anime = await getMalAnime(20);
  assert.equal(anime.id, "mal-20");
  assert.equal(anime.provider, "jikan");
  assert.equal(anime.episodes, 220);
  assert.equal(calls.length, 2);
});

test("MAL not-found and adult titles do not fall back to a different title", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response(null, { status: 404 });
  };
  await assert.rejects(getMalAnime(876), { status: 404 });
  assert.equal(calls, 1);
  globalThis.fetch = async () =>
    Response.json({ id: 23, title: "Restricted", nsfw: "black" });
  await assert.rejects(getMalAnime(23), { status: 404 });
});

test("legacy AniList URLs resolve only through an explicit mapping", async () => {
  globalThis.fetch = async (url) => {
    if (url.includes("ani.zip"))
      return Response.json({ mappings: { anilist_id: 123, mal_id: 456 } });
    assert.match(url, /myanimelist\.net\/v2\/anime\/456\?/);
    return Response.json({ id: 456, title: "Mapped title" });
  };
  const anime = await getAnime("123");
  assert.equal(anime.id, 123);
  assert.equal(anime.anilistId, 123);
  assert.equal(anime.malId, 456);
});

test("a wrong legacy mapping cannot silently swap title identities", async () => {
  globalThis.fetch = async (url) => {
    if (url.includes("ani.zip"))
      return Response.json({ mappings: { anilist_id: 999, mal_id: 456 } });
    assert.equal(url, "https://graphql.anilist.co");
    return Response.json({
      data: {
        Media: { id: 123, idMal: 789, title: { english: "Original title" } },
      },
    });
  };
  const anime = await getAnime("123");
  assert.equal(anime.malId, 789);
  assert.equal(anime.title, "Original title");
});

test("exact filters use Jikan and MAL fallback discloses its limited scope", async () => {
  globalThis.fetch = async (input) => {
    const url = new URL(input);
    if (url.host === "api.jikan.moe") {
      assert.equal(url.searchParams.get("genres"), "1");
      assert.equal(url.searchParams.get("status"), "complete");
      return new Response(null, { status: 503 });
    }
    return Response.json({
      data: [
        {
          node: {
            id: 20,
            title: "Match",
            genres: [{ name: "Action" }],
            status: "finished_airing",
          },
        },
        {
          node: {
            id: 21,
            title: "Wrong genre",
            genres: [{ name: "Drama" }],
            status: "finished_airing",
          },
        },
      ],
    });
  };
  const result = await getMalCatalogue({
    page: 1,
    sort: "popular",
    genre: "Action",
    status: "FINISHED",
  });
  assert.equal(result.limited, true);
  assert.match(result.notice, /first 100/);
  assert.deepEqual(
    result.results.map(({ id }) => id),
    ["mal-20"],
  );
});

test("concurrent identical requests are deduplicated", async () => {
  let calls = 0;
  const transport = createAnimeTransport({
    directory: false,
    interval: 0,
    fetcher: async () => {
      calls++;
      return Response.json({ data: [1] });
    },
  });
  const results = await Promise.all(
    Array.from({ length: 8 }, () =>
      transport.request("https://example.test/anime"),
    ),
  );
  assert.equal(calls, 1);
  assert.ok(results.every((result) => result.data[0] === 1));
});

test("outages serve stale successes, open a circuit, and retry after cooldown", async () => {
  let time = 0;
  let calls = 0;
  const transport = createAnimeTransport({
    directory: false,
    interval: 0,
    now: () => time,
    fetcher: async () => {
      calls++;
      return calls === 1
        ? Response.json({ data: [1] })
        : new Response(null, { status: 429, headers: { "Retry-After": "60" } });
    },
  });
  await transport.request("https://example.test/a", {}, { ttl: 1 });
  time = 2000;
  const stale = await transport.request(
    "https://example.test/a",
    {},
    { ttl: 1 },
  );
  assert.equal(stale._stale, true);
  await assert.rejects(transport.request("https://example.test/b"), {
    status: 429,
  });
  assert.equal(calls, 2);
  time += 61000;
  await assert.rejects(transport.request("https://example.test/b"), {
    status: 429,
  });
  assert.equal(calls, 3);
});

test("persistent cache survives a new transport and contains no credentials", async () => {
  const { mkdtemp, readFile, readdir, unlink, rmdir } =
    await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const directory = await mkdtemp(path.join(tmpdir(), "movies-anime-cache-"));
  try {
    const first = createAnimeTransport({
      directory,
      interval: 0,
      now: () => 1000,
      fetcher: async () => Response.json({ data: [20] }),
    });
    await first.request(
      "https://example.test/anime/20",
      { headers: { "X-MAL-CLIENT-ID": "private-client" } },
      { ttl: 1 },
    );
    const second = createAnimeTransport({
      directory,
      interval: 0,
      now: () => 5000,
      fetcher: async () => new Response(null, { status: 503 }),
    });
    assert.equal(
      (await second.request("https://example.test/anime/20", {}, { ttl: 1 }))
        ._stale,
      true,
    );
    const files = await readdir(directory);
    assert.equal(files.length, 1);
    assert.ok(
      !(await readFile(path.join(directory, files[0]), "utf8")).includes(
        "private-client",
      ),
    );
  } finally {
    for (const name of await readdir(directory))
      await unlink(path.join(directory, name));
    await rmdir(directory);
  }
});

test("MAL-key details fall back to AniList by idMal without changing their URL identity", async () => {
  globalThis.fetch = async (url, options) => {
    if (url.includes("graphql.anilist")) {
      const body = JSON.parse(options.body);
      assert.match(body.query, /Media\(idMal: \$id/);
      assert.equal(body.variables.id, 456);
      return Response.json({
        data: {
          Media: { id: 123, idMal: 456, title: { english: "Fallback title" } },
        },
      });
    }
    return new Response(null, { status: 503 });
  };
  const anime = await getAnime("mal-456");
  assert.equal(anime.id, "mal-456");
  assert.equal(anime.malId, 456);
  assert.equal(anime.anilistId, 123);
  assert.equal(anime.provider, "anilist");
});

test("episode metadata falls back by explicit MAL identity and excludes special numbering", async () => {
  globalThis.fetch = async (url) => {
    if (url.includes("jikan")) return new Response(null, { status: 503 });
    assert.match(url, /mappings\?mal_id=20$/);
    return Response.json({
      mappings: { mal_id: 20 },
      episodes: {
        1: {
          title: { en: "First episode" },
          airDateUtc: "2002-10-03T10:30:00Z",
        },
        2: { title: { en: "Upcoming" }, airDateUtc: "2099-01-01T00:00:00Z" },
        S1: { title: { en: "A special" } },
      },
    });
  };
  const result = await getEpisodes({ malId: 20 }, 1);
  assert.equal(result.results.length, 2);
  assert.equal(result.results[0].title, "First episode");
  assert.equal(
    await canWatchEpisode({ malId: 20, status: "RELEASING" }, 1),
    true,
  );
  assert.equal(
    await canWatchEpisode({ malId: 20, status: "RELEASING" }, 2),
    false,
  );
});

test("expired stale records cannot keep titles available indefinitely", async () => {
  let time = 1000;
  let fail = false;
  const transport = createAnimeTransport({
    directory: false,
    interval: 0,
    now: () => time,
    fetcher: async () =>
      fail ? new Response(null, { status: 503 }) : Response.json({ data: [1] }),
  });
  await transport.request("https://example.test/title", {}, { ttl: 1 });
  time += 8 * 86400 * 1000;
  fail = true;
  await assert.rejects(
    transport.request("https://example.test/title", {}, { ttl: 1 }),
    { status: 502 },
  );
});

test("searching within upcoming collection applies its status filter", async () => {
  globalThis.fetch = async (input) => {
    const url = new URL(input);
    assert.equal(url.host, "api.jikan.moe");
    assert.equal(url.searchParams.get("q"), "Naruto");
    assert.equal(url.searchParams.get("status"), "upcoming");
    return Response.json({ data: [], pagination: { has_next_page: false } });
  };
  assert.equal(
    (await getMalCatalogue({ search: "Naruto", sort: "upcoming", page: 1 }))
      .provider,
    "jikan",
  );
});
