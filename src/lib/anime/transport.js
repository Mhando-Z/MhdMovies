import "server-only";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, rename, readdir, unlink } from "node:fs/promises";
import path from "node:path";

export const serviceError = (message, status = 502) => Object.assign(new Error(message), { status });

// A separate transport can be constructed for deterministic outage/cache tests.
export function createAnimeTransport({
  directory = process.env.ANIME_CACHE_DIR || path.join(process.cwd(), ".next/cache/anime-v2"),
  now = Date.now,
  fetcher = (...args) => fetch(...args),
  interval = 1000,
} = {}) {
  const entries = new Map();
  const pending = new Map();
  const circuits = new Map();
  const queues = new Map();
  const maxAge = 7 * 86400 * 1000;
  let writes = 0;

  async function load(key) {
    if (entries.has(key)) return entries.get(key);
    if (!directory) return null;
    try {
      const entry = JSON.parse(await readFile(/* turbopackIgnore: true */ path.join(directory, `${key}.json`), "utf8"));
      if (entry && Number.isFinite(entry.at) && entry.data && now() - entry.at < maxAge) return entry;
    } catch { /* Empty or unavailable disk cache: continue with the upstream. */ }
    return null;
  }

  async function save(key, entry) {
    entries.delete(key);
    entries.set(key, entry);
    if (entries.size > 300) entries.delete(entries.keys().next().value);
    if (!directory) return;
    const file = path.join(directory, `${key}.json`);
    const temporary = `${file}.${process.pid}.tmp`;
    try {
      await mkdir(directory, { recursive: true });
      await writeFile(temporary, JSON.stringify(entry));
      await rename(temporary, file);
      // Bound disk growth from distinct searches; files contain only public data.
      if (++writes % 50 === 0) {
        const files = (await readdir(/* turbopackIgnore: true */ directory)).filter((name) => /^[a-f0-9]{64}\.json$/.test(name));
        if (files.length > 500) {
          const records = await Promise.all(files.map(async (name) => {
            try { return { name, at: JSON.parse(await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ directory, name), "utf8")).at }; }
            catch { return { name, at: 0 }; }
          }));
          await Promise.all(records.sort((a, b) => a.at - b.at).slice(0, files.length - 500)
            .map(({ name }) => unlink(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ directory, name)).catch(() => {})));
        }
      }
    } catch { /* Read-only hosts still get bounded memory and Next's fetch cache. */ }
  }

  async function schedule(host, task) {
    const previous = queues.get(host) || Promise.resolve();
    let started = 0;
    const next = previous.catch(() => {}).then(async () => {
      started = Date.now();
      const result = await task();
      return result;
    });
    // Pace successes and failures, including concurrent requests to different URLs.
    const tail = next.catch(() => {}).then(() => new Promise((resolve) => setTimeout(resolve, Math.max(0, interval - (Date.now() - started)))));
    queues.set(host, tail);
    void tail.then(() => { if (queues.get(host) === tail) queues.delete(host); });
    return next;
  }

  async function request(url, options = {}, { ttl = 900, validate = (data) => Boolean(data), stale = true } = {}) {
    const host = new URL(url).host;
    // Credentials are deliberately excluded from both cache keys and disk values.
    const key = createHash("sha256").update(`${url}|${options.method || "GET"}|${options.body || ""}`).digest("hex");
    if (pending.has(key)) return pending.get(key);
    const promise = (async () => {
      let saved = await load(key);
      if (saved && !validate(saved.data)) saved = null;
      if (saved && now() - saved.at < ttl * 1000) return saved.data;
      const cached = () => saved && now() - saved.at < maxAge && stale
        ? { ...saved.data, _stale: true } : null;
      const unavailable = () => serviceError("The anime service is temporarily unavailable. Please try again shortly.");
      const circuit = circuits.get(host);
      if (circuit?.until > now()) {
        const previous = cached();
        if (previous) return previous;
        throw serviceError(circuit.message, circuit.status);
      }
      try {
        const data = await schedule(host, async () => {
          const blocked = circuits.get(host);
          if (blocked?.until > now()) throw serviceError(blocked.message, blocked.status);
          const response = await fetcher(url, {
            ...options,
            cache: "force-cache",
            next: { revalidate: ttl },
            // Shared work must not be cancelled by a single browser navigating away.
            signal: AbortSignal.timeout(8000),
          });
          if (!response.ok) {
            const error = serviceError(response.status === 404 ? "This anime could not be found."
              : response.status === 429 ? "The anime collection is busy. Please try again shortly."
                : "The anime service is temporarily unavailable. Please try again shortly.",
            [404, 429].includes(response.status) ? response.status : 502);
            if ([401, 403, 429].includes(response.status) || response.status >= 500) {
              const retry = Number(response.headers.get("retry-after"));
              circuits.set(host, { until: now() + Math.min(300000, Math.max(30000, retry * 1000 || 60000)), message: error.message, status: error.status });
            }
            throw error;
          }
          const result = await response.json();
          if (!validate(result)) throw unavailable();
          return result;
        });
        circuits.delete(host);
        await save(key, { at: now(), data });
        return data;
      } catch (error) {
        if (error.status === 404) throw error;
        if ((!error.status || error.status === 502) && (circuits.get(host)?.until || 0) <= now())
          circuits.set(host, { until: now() + 30000, message: unavailable().message, status: 502 });
        const previous = cached();
        if (previous) return previous;
        throw error.status ? error : unavailable();
      }
    })();
    pending.set(key, promise);
    try { return await promise; }
    finally { pending.delete(key); }
  }
  return { request };
}

export const animeTransport = createAnimeTransport();
