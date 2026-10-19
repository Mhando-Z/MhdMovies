"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Captions, Download, Loader2, Search } from "lucide-react";
import { subtitleLanguages } from "@/lib/subtitleUtils";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500";
const action = `inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-xs font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 ${focus}`;

export default function MovieSubtitles({ movie, released }) {
  const [language, setLanguage] = useState("en");
  const [query, setQuery] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [releaseFilter, setReleaseFilter] = useState("");
  const [hearingImpaired, setHearingImpaired] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [downloadError, setDownloadError] = useState(null);
  const [notice, setNotice] = useState(null);
  const downloadController = useRef(null);

  useEffect(() => () => downloadController.current?.abort(), []);

  useEffect(() => {
    if (!query || !released) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setResult(null);
    async function search() {
      try {
        const params = new URLSearchParams({ tmdb_id: String(movie.id), language: query.language, page: String(query.page) });
        if (query.provider) params.set("provider", query.provider);
        const response = await fetch(`/api/subtitles?${params}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Subtitles could not be loaded.");
        if (!controller.signal.aborted) setResult(data);
      } catch (error) {
        if (!controller.signal.aborted) setError(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    search();
    return () => controller.abort();
  }, [movie.id, query, released]);

  const subtitles = useMemo(() => (result?.subtitles ?? []).filter((item) =>
    (!hearingImpaired || item.hearingImpaired) && item.release.toLowerCase().includes(releaseFilter.toLowerCase()),
  ), [result, hearingImpaired, releaseFilter]);

  function startSearch(event) {
    event.preventDefault();
    downloadController.current?.abort();
    setDownloading(null);
    setDownloadError(null);
    setNotice(null);
    setReleaseFilter("");
    setHearingImpaired(false);
    setQuery({ language, page: 1 });
  }

  async function download(subtitle, format) {
    downloadController.current?.abort();
    const controller = new AbortController();
    downloadController.current = controller;
    setDownloading(`${subtitle.id}-${format}`);
    setDownloadError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/subtitles/download", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: subtitle.token, format }), signal: controller.signal,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "The subtitle could not be downloaded.");
      }
      const blob = await response.blob();
      if (controller.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] || `subtitle.${format === "vtt" ? "vtt" : subtitle.format}`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      const remaining = response.headers.get("x-downloads-remaining");
      setNotice(`Your subtitle is ready.${remaining !== null ? ` ${remaining} provider downloads remaining today.` : ""}`);
    } catch (error) {
      if (!controller.signal.aborted) setDownloadError(error.message);
    } finally {
      if (!controller.signal.aborted) setDownloading(null);
    }
  }

  return (
    <section aria-labelledby="movie-subtitles-title" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-4">
        <span className="rounded-xl border border-white/10 bg-white/5 p-3 text-red-400"><Captions aria-hidden="true" className="size-6" /></span>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">Every word of the story</p>
          <h2 id="movie-subtitles-title" className="text-xl font-semibold tracking-tight">Download subtitles</h2>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        {!released ? (
          <p className="text-sm leading-7 text-white/60">Subtitle downloads will be available to search after this movie is released.</p>
        ) : (
          <>
            <p className="mb-5 max-w-3xl text-sm leading-7 text-white/60">Choose a language, then find a subtitle that matches your video release. Download the original file or a WebVTT version for compatible players.</p>
            <form onSubmit={startSearch} className="flex flex-wrap items-end gap-3">
              <label className="flex min-w-48 flex-1 flex-col gap-2 text-xs text-white/65 sm:max-w-xs">
                Subtitle language
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className={`min-h-11 rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white ${focus}`}>
                  {subtitleLanguages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </label>
              <button type="submit" disabled={loading || Boolean(downloading)} className={`${action} border-red-500/40 bg-red-600 text-white hover:bg-red-700`}>
                {loading ? <Loader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" /> : <Search aria-hidden="true" className="size-4" />}
                {loading ? "Searching…" : "Find subtitles"}
              </button>
            </form>
            {loading && <p role="status" className="mt-5 text-sm text-white/60">Finding subtitles for {movie.title}…</p>}
            {error && <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200"><p>{error}</p><button type="button" onClick={() => setQuery({ ...query })} className={action}>Try again</button></div>}
            {result && (
              <div className="mt-6 space-y-5">
                <p role="status" className="text-xs text-white/50">{result.subtitles.length} results on page {result.page} · {result.provider === "subdl" ? "SubDL" : "OpenSubtitles"} · {subtitleLanguages.find(([code]) => code === query.language)?.[1]}</p>
                {result.subtitles.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex min-w-48 flex-1 flex-col gap-2 text-xs text-white/65 sm:max-w-sm">Filter this page by release
                      <input type="search" value={releaseFilter} onChange={(event) => setReleaseFilter(event.target.value)} placeholder="e.g. BluRay, WEB-DL, 1080p" className={`min-h-11 rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white placeholder:text-white/30 ${focus}`} />
                    </label>
                    <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-white/70"><input type="checkbox" checked={hearingImpaired} onChange={(event) => setHearingImpaired(event.target.checked)} className={`size-4 accent-red-600 ${focus}`} />Hearing impaired (SDH) only</label>
                  </div>
                )}
                {subtitles.length > 0 ? (
                  <ul className="divide-y divide-white/10">
                    {subtitles.map((item) => (
                      <li key={item.id} className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
                        <div className="min-w-0 space-y-2">
                          <p className="wrap-anywhere text-sm font-medium leading-6 text-white/85">{item.release}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/50">
                            <span className="rounded bg-white/10 px-2 py-1 uppercase">{item.format}</span>
                            {item.hearingImpaired && <span className="rounded bg-red-500/10 px-2 py-1 text-red-300">SDH</span>}
                            {item.foreignPartsOnly && <span>Foreign dialogue only</span>}
                            {item.machineTranslated && <span>Machine translated</span>}
                            {item.fps && <span>{item.fps} FPS</span>}
                            {item.downloads != null && <span>{Number(item.downloads).toLocaleString("en-US")} downloads</span>}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button type="button" disabled={Boolean(downloading)} onClick={() => download(item, "original")} aria-label={`Download original subtitle: ${item.release}`} className={action}>
                            {downloading === `${item.id}-original` ? <Loader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" /> : <Download aria-hidden="true" className="size-4" />}Download {item.format.toUpperCase()}
                          </button>
                          {item.format === "srt" && <button type="button" disabled={Boolean(downloading)} onClick={() => download(item, "vtt")} aria-label={`Download WebVTT subtitle: ${item.release}`} className={action}>{downloading === `${item.id}-vtt` && <Loader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />}VTT</button>}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p className="rounded-lg border border-white/10 p-5 text-sm leading-7 text-white/60">{result.subtitles.length ? "No subtitles on this page match your filters. Try another release name or turn off the SDH filter." : "No subtitles were found in this language. Try another language or check back later."}</p>}
                {(result.page > 1 || result.hasMore) && <nav aria-label="Subtitle results pages" className="flex items-center justify-between gap-3">
                  <button type="button" disabled={result.page <= 1 || Boolean(downloading)} onClick={() => { setReleaseFilter(""); setQuery({ ...query, page: result.page - 1, provider: result.provider }); }} className={action}>Previous</button>
                  <span className="text-xs text-white/50">Page {result.page}</span>
                  <button type="button" disabled={!result.hasMore || Boolean(downloading)} onClick={() => { setReleaseFilter(""); setQuery({ ...query, page: result.page + 1, provider: result.provider }); }} className={action}>Next</button>
                </nav>}
              </div>
            )}
            {downloadError && <p role="alert" className="mt-4 text-sm leading-6 text-amber-200">{downloadError}</p>}
            {notice && <p role="status" className="mt-4 text-sm leading-6 text-emerald-300">{notice}</p>}
            <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-6 text-white/40">These files are for your own player. To watch here, choose subtitles in the streaming server’s controls. Subtitle timing depends on the video release; each provider sets its download limits.</p>
          </>
        )}
      </div>
    </section>
  );
}
