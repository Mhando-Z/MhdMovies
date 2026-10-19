import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { safeSubtitleFilename, subtitleToVtt } from "./subtitleUtils.js";

const SUBDL = "https://api.subdl.com";
const OPEN = "https://api.opensubtitles.com/api/v1";
const userAgent = "Movies v0.1.0";
const maxBytes = 5 * 1024 * 1024;
const openKey = () => process.env.OPENSUBTITLES_API_KEY || process.env.OPEN_SUBS_APIKEYS;
const keyFor = (provider) => provider === "subdl" ? process.env.SUBDL_API_KEY : openKey();
const fail = (message, status = 502) => Object.assign(new Error(message), { status });

function checkResponse(response) {
  if (response.ok) return;
  if ([406, 429].includes(response.status)) {
    throw fail("The subtitle provider's download or request limit has been reached. Please try again later.", 429);
  }
  if ([401, 403].includes(response.status)) {
    throw fail("This subtitle provider is temporarily unavailable. Please try again later.", 503);
  }
  throw fail("Subtitles could not be loaded. Please try again.");
}

async function providerJson(provider, path, params, signal, body) {
  const url = new URL(`${provider === "subdl" ? SUBDL : OPEN}${path}`);
  if (params) url.search = new URLSearchParams(Object.entries(params).sort(([a], [b]) => a.localeCompare(b))).toString();
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Accept: "application/json", "User-Agent": userAgent,
      ...(provider === "subdl" ? { Authorization: `Bearer ${keyFor(provider)}` } : { "Api-Key": keyFor(provider) }),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body), cache: "no-store" } : { next: { revalidate: 300 } }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
  });
  checkResponse(response);
  const data = await response.json();
  if (data.status === false) throw fail("The subtitle provider could not complete this search. Please try again.");
  return data;
}

function signDownload(payload) {
  const data = Buffer.from(JSON.stringify({ ...payload, expires: Date.now() + 3600000 })).toString("base64url");
  const signature = createHmac("sha256", keyFor(payload.provider)).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function readDownload(token) {
  try {
    if (typeof token !== "string" || token.length > 6000) throw new Error();
    const [data, signature, extra] = token.split(".");
    if (extra || !data || !signature) throw new Error();
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (!["subdl", "opensubtitles"].includes(payload.provider) || !keyFor(payload.provider)) throw new Error();
    const expected = createHmac("sha256", keyFor(payload.provider)).update(data).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error();
    if (!Number.isFinite(payload.expires) || payload.expires < Date.now()) throw new Error();
    return payload;
  } catch {
    throw fail("This subtitle link has expired. Search again to get a fresh download link.", 400);
  }
}

// Validate every redirect as well as the original provider URL.
function allowedDownload(value, provider) {
  const url = new URL(value, provider === "subdl" ? "https://dl.subdl.com" : OPEN);
  const domains = provider === "subdl" ? ["api.subdl.com", "dl.subdl.com"] : ["opensubtitles.com"];
  if (url.protocol !== "https:" || url.port || url.username || url.password ||
    !domains.some((domain) => url.hostname === domain || (provider === "opensubtitles" && url.hostname.endsWith(`.${domain}`)))) {
    throw fail("The subtitle provider returned an unsupported download link.");
  }
  // Search responses must never embed the application's API key in a client token.
  url.searchParams.delete("api_key");
  return url;
}

function withToken(item, payload) {
  return { ...item, token: signDownload(payload) };
}

async function searchSubdl(movieId, language, page, signal) {
  const data = await providerJson("subdl", "/api/v2/subtitles/search", {
    tmdb_id: movieId, type: "movie", languages: language, unpack: "1",
    subs_per_page: "30", page: String(page), releases: "1",
  }, signal);
  const subtitles = (data.subtitles ?? []).flatMap((parent) => {
    const files = parent.unpack_files?.length ? parent.unpack_files.map((file) => ({ ...parent, ...file })) : [parent];
    return files.flatMap((file) => {
      const fileId = file.n_id || file.nId;
      const url = file.url || file.download_url || (fileId ? `${SUBDL}/api/v2/subtitles/${encodeURIComponent(fileId)}/download?format=file` : null);
      if (!url) return [];
      let download;
      try { download = allowedDownload(url, "subdl").href; } catch { return []; }
      const format = String(file.format || (/\.zip(?:\?|$)/i.test(download) ? "zip" : "srt")).toLowerCase();
      if (!["srt", "vtt", "ass", "ssa", "sub", "zip"].includes(format)) return [];
      const name = file.name || file.release_name || "Subtitle";
      return [withToken({
        id: `subdl-${file.file_n_id || fileId || download}`, provider: "SubDL",
        release: file.release_name || name, language, format,
        hearingImpaired: file.hi === true || file.hi === 1,
        fps: file.fps || null, downloads: null,
      }, { provider: "subdl", url: download, filename: safeSubtitleFilename(name, format), format, language })];
    });
  });
  return { subtitles, hasMore: Number(data.total_pages ?? data.pagination?.total_pages) > page };
}

async function searchOpen(movieId, language, page, signal) {
  const data = await providerJson("opensubtitles", "/subtitles", {
    tmdb_id: movieId, languages: language, type: "movie", page: String(page),
    order_by: "download_count", order_direction: "desc",
  }, signal);
  const subtitles = (data.data ?? []).flatMap(({ attributes: item }) =>
    (item?.files ?? []).filter((file) => Number.isSafeInteger(file.file_id) && file.file_id > 0).map((file) => withToken({
      id: `opensubtitles-${file.file_id}`, provider: "OpenSubtitles",
      release: item.release || file.file_name || "Subtitle", language: item.language || language,
      format: "srt", hearingImpaired: item.hearing_impaired === true,
      fps: item.fps || null, downloads: item.download_count ?? null,
      machineTranslated: item.machine_translated || item.ai_translated || false,
      foreignPartsOnly: item.foreign_parts_only || false,
    }, { provider: "opensubtitles", fileId: file.file_id,
      filename: safeSubtitleFilename(file.file_name || item.release), format: "srt", language: item.language || language })),
  );
  return { subtitles, hasMore: Number(data.total_pages) > page };
}

export async function searchSubtitles(movieId, language, page, provider, signal) {
  const configured = [process.env.SUBDL_API_KEY && "subdl", openKey() && "opensubtitles"].filter(Boolean);
  if (!configured.length) throw fail("Subtitle downloads are not available yet. Please try again later.", 503);
  const providers = provider ? configured.filter((item) => item === provider) : configured;
  if (!providers.length) throw fail("This subtitle provider is unavailable.", 503);
  let lastError;
  let empty;
  for (const item of providers) {
    try {
      const result = await (item === "subdl" ? searchSubdl : searchOpen)(movieId, language, page, signal);
      const response = { ...result, provider: item, page };
      if (result.subtitles.length || provider) return response;
      empty = response;
    } catch (error) {
      if (signal.aborted) throw error;
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return empty;
}

async function downloadFile(value, provider, signal) {
  let url = allowedDownload(value, provider);
  for (let redirect = 0; redirect < 5; redirect++) {
    const response = await fetch(url, {
      cache: "no-store", redirect: "manual", signal,
      headers: { "User-Agent": userAgent,
        ...(url.origin === SUBDL ? { Authorization: `Bearer ${keyFor(provider)}` } : {}),
      },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (!location) throw fail("The subtitle provider returned an invalid redirect.");
      url = allowedDownload(new URL(location, url).href, provider);
      continue;
    }
    checkResponse(response);
    if (Number(response.headers.get("content-length")) > maxBytes) {
      await response.body?.cancel();
      throw fail("This subtitle file is too large to download.");
    }
    const reader = response.body?.getReader();
    if (!reader) throw fail("The subtitle provider returned an empty file.");
    const chunks = [];
    let size = 0;
    try {
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        size += chunk.length;
        if (size > maxBytes) throw fail("This subtitle file is too large to download.");
        chunks.push(Buffer.from(chunk));
      }
    } finally { await reader.cancel(); }
    return Buffer.concat(chunks);
  }
  throw fail("The subtitle provider returned too many redirects.");
}

export async function getSubtitleDownload(token, format, requestSignal) {
  const payload = readDownload(token);
  const signal = AbortSignal.any([requestSignal, AbortSignal.timeout(20000)]);
  let url = payload.url;
  let remaining;
  if (payload.provider === "opensubtitles") {
    const data = await providerJson("opensubtitles", "/download", null, signal, { file_id: payload.fileId, sub_format: "srt" });
    url = data.link;
    remaining = data.remaining;
  }
  if (!url) throw fail("The subtitle provider did not return a file.");
  let bytes = await downloadFile(url, payload.provider, signal);
  let extension = payload.format;
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (!bytes.length || (!isZip && /^\s*(?:<!doctype|<html|\{)/i.test(bytes.toString("utf8", 0, 150)))) {
    throw fail("The subtitle provider returned an invalid subtitle file.");
  }
  if (format === "vtt") {
    if (isZip || !["srt", "vtt"].includes(extension)) throw fail("Download the original file to use these subtitles.", 422);
    try { bytes = Buffer.from(subtitleToVtt(bytes.toString("utf8"))); }
    catch (error) { throw fail(error.message, 422); }
    extension = "vtt";
  } else if (isZip) extension = "zip";
  return { bytes, filename: safeSubtitleFilename(payload.filename, extension), extension, remaining };
}

export function subtitleError(error) {
  return Response.json({ error: error.status ? error.message : "We couldn't reach the subtitle provider. Please try again." },
    { status: error.status || 502, headers: { "Cache-Control": "no-store" } });
}
