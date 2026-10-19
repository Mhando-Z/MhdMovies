import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { registerHooks } from "node:module";
import { isMovieReleased } from "../src/lib/movieRelease.js";
import {
  safeSubtitleFilename,
  subtitleToVtt,
} from "../src/lib/subtitleUtils.js";

// Next.js supplies this boundary marker; replace only that marker in Node tests.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export{}", shortCircuit: true };
    return next(specifier, context);
  },
});
const { searchSubtitles, getSubtitleDownload } =
  await import("../src/lib/subtitleProviders.js");
const originalFetch = globalThis.fetch;
const originalKeys = {
  subdl: process.env.SUBDL_API_KEY,
  open: process.env.OPENSUBTITLES_API_KEY,
  legacy: process.env.OPEN_SUBS_APIKEYS,
};
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [name, value] of [
    ["SUBDL_API_KEY", originalKeys.subdl],
    ["OPENSUBTITLES_API_KEY", originalKeys.open],
    ["OPEN_SUBS_APIKEYS", originalKeys.legacy],
  ]) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});
const signal = () => new AbortController().signal;
const openResult = {
  data: [
    {
      attributes: {
        release: "Movie.1080p",
        language: "en",
        hearing_impaired: true,
        download_count: 123,
        files: [{ file_id: 1234, file_name: "movie.srt" }],
      },
    },
  ],
  total_pages: 2,
};
function configure() {
  process.env.SUBDL_API_KEY = "test-subdl";
  process.env.OPENSUBTITLES_API_KEY = "test-open";
}

test("release gating handles future dates, unreleased statuses and missing dates", () => {
  const now = new Date("2026-10-19T12:00:00Z");
  for (const movie of [
    null,
    {},
    { status: "Post Production", release_date: "2020-01-01" },
    { status: "Canceled" },
    { status: "Released", release_date: "2027-01-01" },
    { release_date: "invalid" },
  ]) {
    assert.equal(isMovieReleased(movie, now), false);
  }
  for (const movie of [
    { status: "Released" },
    { status: "Released", release_date: "2026-10-19" },
    { release_date: "2020-01-01" },
  ]) {
    assert.equal(isMovieReleased(movie, now), true);
  }
});

test("SRT conversion handles BOM, CRLF, multiline cues and existing VTT", () => {
  const converted = subtitleToVtt(
    "\uFEFF1\r\n00:00:01,250 --> 00:00:03,500\r\nHello\r\nworld\r\n",
  );
  assert.equal(
    converted,
    "WEBVTT\n\n1\n00:00:01.250 --> 00:00:03.500\nHello\nworld\n",
  );
  assert.equal(
    subtitleToVtt("WEBVTT\n\n00:01.000 --> 00:02.000\nHi"),
    "WEBVTT\n\n00:01.000 --> 00:02.000\nHi",
  );
  assert.throws(() => subtitleToVtt("<html>Error</html>"));
  assert.equal(
    safeSubtitleFilename('../../movie"\r\n.srt', "vtt"),
    "movie___.vtt",
  );
});

test("SubDL is preferred and unpacked file metadata is retained", async () => {
  configure();
  globalThis.fetch = async (url, options) => {
    assert.equal(url.origin, "https://api.subdl.com");
    assert.equal(url.searchParams.get("tmdb_id"), "550");
    assert.equal(url.searchParams.get("type"), "movie");
    assert.equal(options.headers.Authorization, "Bearer test-subdl");
    return Response.json({
      status: true,
      subtitles: [
        {
          release_name: "Movie",
          fps: "23.976",
          unpack_files: [
            {
              file_n_id: "file1",
              url: "/subtitle/parent/file1?api_key=test-subdl",
              name: "movie.srt",
              format: "srt",
              hi: true,
            },
          ],
        },
      ],
    });
  };
  const result = await searchSubtitles("550", "en", 1, null, signal());
  assert.equal(result.provider, "subdl");
  assert.equal(result.subtitles[0].fps, "23.976");
  assert.equal(result.subtitles[0].hearingImpaired, true);
  assert.ok(result.subtitles[0].token);
  const payload = JSON.parse(
    Buffer.from(
      result.subtitles[0].token.split(".")[0],
      "base64url",
    ).toString(),
  );
  assert.ok(!payload.url.includes("test-subdl"));
  assert.equal(result.hasMore, false);
});

test("empty or failed SubDL searches fall back to OpenSubtitles", async () => {
  configure();
  for (const status of [200, 503]) {
    globalThis.fetch = async (url) =>
      url.hostname === "api.subdl.com"
        ? Response.json({ subtitles: [] }, { status })
        : Response.json(openResult);
    const result = await searchSubtitles("550", "en", 1, null, signal());
    assert.equal(result.provider, "opensubtitles");
    assert.equal(result.hasMore, true);
    assert.equal(result.subtitles[0].hearingImpaired, true);
  }
});

test("signed downloads convert to VTT and preserve provider allowance information", async () => {
  configure();
  globalThis.fetch = async () => Response.json(openResult);
  const result = await searchSubtitles(
    "550",
    "en",
    1,
    "opensubtitles",
    signal(),
  );
  globalThis.fetch = async (url, options) => {
    if (String(url).includes("api.opensubtitles.com")) {
      assert.equal(JSON.parse(options.body).file_id, 1234);
      assert.equal(options.cache, "no-store");
      return Response.json({
        link: "https://dl.opensubtitles.com/download/movie",
        remaining: 4,
      });
    }
    assert.equal(options.headers["Api-Key"], undefined);
    return new Response("1\n00:00:01,000 --> 00:00:02,000\nHello\n");
  };
  const file = await getSubtitleDownload(
    result.subtitles[0].token,
    "vtt",
    signal(),
  );
  assert.equal(file.extension, "vtt");
  assert.equal(file.filename, "movie.vtt");
  assert.equal(file.remaining, 4);
  assert.match(file.bytes.toString(), /^WEBVTT/);
});

test("tampered and expired tokens are rejected before any provider request", async () => {
  configure();
  globalThis.fetch = async () => Response.json(openResult);
  const result = await searchSubtitles(
    "550",
    "en",
    1,
    "opensubtitles",
    signal(),
  );
  const token = result.subtitles[0].token;
  const [encoded, signature] = token.split(".");
  const data = JSON.parse(Buffer.from(encoded, "base64url").toString());
  data.fileId = 999;
  globalThis.fetch = async () => {
    throw new Error("Unexpected fetch");
  };
  await assert.rejects(
    getSubtitleDownload(
      `${Buffer.from(JSON.stringify(data)).toString("base64url")}.${signature}`,
      "original",
      signal(),
    ),
    { status: 400 },
  );
  const originalNow = Date.now;
  try {
    Date.now = () => originalNow() + 3600001;
    await assert.rejects(getSubtitleDownload(token, "original", signal()), {
      status: 400,
    });
  } finally {
    Date.now = originalNow;
  }
});

test("untrusted provider links and redirects cannot reach arbitrary hosts", async () => {
  configure();
  globalThis.fetch = async () => Response.json(openResult);
  const result = await searchSubtitles(
    "550",
    "en",
    1,
    "opensubtitles",
    signal(),
  );
  const token = result.subtitles[0].token;
  for (const link of [
    "http://127.0.0.1/private",
    "https://opensubtitles.com.evil.test/file",
    "https://user@dl.opensubtitles.com/file",
  ]) {
    globalThis.fetch = async () => Response.json({ link });
    await assert.rejects(
      getSubtitleDownload(token, "original", signal()),
      /unsupported download link/,
    );
  }
  globalThis.fetch = async (url) =>
    String(url).includes("api.opensubtitles.com")
      ? Response.json({ link: "https://dl.opensubtitles.com/file" })
      : new Response(null, {
          status: 302,
          headers: { location: "http://127.0.0.1/private" },
        });
  await assert.rejects(
    getSubtitleDownload(token, "original", signal()),
    /unsupported download link/,
  );
});

test("provider quota errors and oversized downloads return actionable errors", async () => {
  configure();
  globalThis.fetch = async () => Response.json({}, { status: 429 });
  await assert.rejects(
    searchSubtitles("550", "en", 1, "opensubtitles", signal()),
    { status: 429 },
  );
  globalThis.fetch = async () => Response.json(openResult);
  const result = await searchSubtitles(
    "550",
    "en",
    1,
    "opensubtitles",
    signal(),
  );
  globalThis.fetch = async (url) =>
    String(url).includes("api.opensubtitles.com")
      ? Response.json({ link: "https://dl.opensubtitles.com/file" })
      : new Response("too big", {
          headers: { "content-length": String(6 * 1024 * 1024) },
        });
  await assert.rejects(
    getSubtitleDownload(result.subtitles[0].token, "original", signal()),
    /too large/,
  );
});
