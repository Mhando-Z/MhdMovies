"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Film, Images, MapPin, Search, Star, Tv } from "lucide-react";
import { Artwork, Modal, formatMovieDate } from "@/components/pages/movieDetailsUI";
import { personAge, personCredits, sortCredits } from "@/lib/people";
import { ActorError, ActorLoading, BackToActors, Portrait, useActorResource } from "./ActorUI";

function CreditCard({ credit }) {
  const isMovie = credit.media_type === "movie";
  // Television has no local detail route yet; link to the correct TMDB title.
  const href = isMovie ? `/movies/${credit.id}` : `https://www.themoviedb.org/tv/${credit.id}`;
  const roles = [...credit.characters.map((role) => `as ${role}`), ...credit.jobs];
  const content = <>
    <div className="actor-credit-art">
      <Artwork path={credit.poster_path} alt="" className="h-full w-full object-cover" />
      <span className="actor-credit-type">{isMovie ? <Film className="size-3" /> : <Tv className="size-3" />}{isMovie ? "Movie" : "TV series"}</span>
      {credit.vote_average > 0 && credit.vote_count > 0 && <span className="actor-credit-rating"><Star className="size-3 fill-amber-300 text-amber-300" />{credit.vote_average.toFixed(1)}</span>}
    </div>
    <h3 className="mt-3 text-sm font-semibold leading-6">{credit.title}{!isMovie && <span className="sr-only"> (opens on TMDB in a new tab)</span>}</h3>
    <p className="mt-1 text-xs text-white/45">{credit.date ? credit.date.slice(0, 4) : "Date not announced"}</p>
    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/60" title={roles.join(" · ")}>{roles.join(" · ") || "Cast member"}</p>
  </>;
  return isMovie ? <Link href={href} className="actor-credit-card">{content}</Link>
    : <a href={href} target="_blank" rel="noreferrer" className="actor-credit-card">{content}</a>;
}

function Filmography({ credits }) {
  const [type, setType] = useState("all");
  const [contribution, setContribution] = useState("all");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(24);
  const filtered = useMemo(() => sortCredits(credits.filter((credit) =>
    (type === "all" || credit.media_type === type) &&
    (contribution === "all" || credit[contribution]) &&
    credit.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), sort),
  [credits, type, contribution, sort, query]);
  const counts = { all: credits.length, movie: credits.filter((item) => item.media_type === "movie").length,
    tv: credits.filter((item) => item.media_type === "tv").length };

  return <section id="filmography" className="actor-section" aria-labelledby="filmography-title">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="actor-eyebrow mb-3">Every role. Every story.</p><h2 id="filmography-title" className="actor-section-title">Filmography</h2></div>
      <span className="text-xs text-white/45">{credits.length} titles in the collection</span>
    </div>
    <div className="actor-filmography-tools">
      <div className="actor-tabs" role="group" aria-label="Filter by media type">
        {[["all", "All titles"], ["movie", "Movies"], ["tv", "TV series"]].map(([value, label]) => (
          <button key={value} type="button" aria-pressed={type === value} onClick={() => { setType(value); setLimit(24); }}>
            {label}<span className="ml-2 text-[10px] opacity-50">{counts[value]}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="credit-contribution">Contribution</label>
        <select id="credit-contribution" className="actor-select" value={contribution} onChange={(event) => { setContribution(event.target.value); setLimit(24); }}>
          <option value="all">All contributions</option><option value="acting">Acting</option><option value="crew">Behind the camera</option>
        </select>
        <label className="sr-only" htmlFor="credit-sort">Sort filmography</label>
        <select id="credit-sort" className="actor-select" value={sort} onChange={(event) => { setSort(event.target.value); setLimit(24); }}>
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="popular">Most popular</option>
        </select>
      </div>
      <div className="actor-search actor-filmography-search">
        <Search className="size-4 shrink-0 text-white/40" aria-hidden="true" />
        <label className="sr-only" htmlFor="credit-search">Search this filmography</label>
        <input id="credit-search" type="search" placeholder="Find a movie or series..." value={query} onChange={(event) => { setQuery(event.target.value); setLimit(24); }} />
      </div>
    </div>
    <p className="mb-6 text-xs text-white/40" role="status">{filtered.length} {filtered.length === 1 ? "title" : "titles"}{query.trim() ? ` matching “${query.trim()}”` : ""} · TV titles open on TMDB</p>
    {filtered.length ? <>
      <div className="actor-credits-grid">{filtered.slice(0, limit).map((credit) => <CreditCard key={credit.key} credit={credit} />)}</div>
      {limit < filtered.length && <div className="mt-10 text-center"><button type="button" className="actor-button actor-button-secondary" onClick={() => setLimit((value) => value + 24)}>
        Show more titles <ArrowDown className="size-4" aria-hidden="true" />
      </button><p className="mt-3 text-xs text-white/40">Showing {Math.min(limit, filtered.length)} of {filtered.length}</p></div>}
    </> : <div className="actor-empty"><Film className="mx-auto mb-4 size-8 text-white/30" aria-hidden="true" /><p className="text-sm text-white/60">{credits.length ? "No titles match these filters." : "No credits have been added for this actor yet."}</p></div>}
  </section>;
}

function PhotoViewer({ photos, index, setIndex, name }) {
  const go = useCallback((step) => setIndex((current) => (current + step + photos.length) % photos.length), [photos.length, setIndex]);
  useEffect(() => {
    const onKey = (event) => {
      if (["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); go(event.key === "ArrowLeft" ? -1 : 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);
  return <div className="relative bg-black p-3 sm:p-5">
    <Artwork path={photos[index].file_path} size="original" alt={`${name}, portrait ${index + 1}`} eager className="mx-auto max-h-[65dvh] w-full object-contain" />
    {photos.length > 1 && <div className="mt-4 flex items-center justify-between">
      <button type="button" className="actor-photo-nav" aria-label="Previous portrait" onClick={() => go(-1)}><ChevronLeft className="size-5" /></button>
      <p className="text-xs tabular-nums text-white/65" aria-live="polite">{index + 1} / {photos.length}</p>
      <button type="button" className="actor-photo-nav" aria-label="Next portrait" onClick={() => go(1)}><ChevronRight className="size-5" /></button>
    </div>}
  </div>;
}

function ProfileContent({ person, retry }) {
  const credits = useMemo(() => personCredits(person), [person]);
  const highlights = useMemo(() => sortCredits(credits.filter((credit) => credit.acting), "popular").slice(0, 6), [credits]);
  const photos = person.images?.profiles?.filter((photo) => photo.file_path) ?? [];
  const [photoIndex, setPhotoIndex] = useState(null);
  const [bioExpanded, setBioExpanded] = useState(false);
  const closePhoto = useCallback(() => setPhotoIndex(null), []);
  const age = personAge(person.birthday, person.deathday);
  const movieCount = credits.filter((item) => item.media_type === "movie").length;
  const tvCount = credits.filter((item) => item.media_type === "tv").length;
  const backdrop = highlights.find((credit) => credit.backdrop_path)?.backdrop_path;
  const biography = person.biography?.trim();
  const imdb = person.external_ids?.imdb_id;

  return <main className="actors-page">
    <section className="actor-profile-hero" aria-labelledby="actor-name">
      {backdrop && <Artwork path={backdrop} size="w1280" className="actor-profile-backdrop" eager />}
      <div className="actor-profile-shade" aria-hidden="true" />
      <div className="actor-container relative z-10">
        <BackToActors />
        <div className="actor-profile-intro actor-reveal">
          <div className="actor-profile-portrait"><Portrait path={person.profile_path} name={person.name} className="h-full w-full object-cover object-top" eager /></div>
          <div className="min-w-0 self-end pb-1">
            <p className="actor-eyebrow mb-4"><span /> {person.known_for_department || "Actor profile"}</p>
            <h1 id="actor-name">{person.name}</h1>
            {person.place_of_birth && <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-white/65"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{person.place_of_birth}</p>}
            <div className="actor-profile-stats">
              <div><strong>{person.combined_credits ? movieCount : "—"}</strong><span>Movies</span></div>
              <div><strong>{person.combined_credits ? tvCount : "—"}</strong><span>TV series</span></div>
              <div><strong>{person.images ? photos.length : "—"}</strong><span>Portraits</span></div>
            </div>
            <a href="#filmography" className="actor-button mt-7">Explore filmography <ArrowDown className="size-4" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>

    <div className="actor-container">
      <nav className="actor-profile-nav" aria-label="Actor profile sections">
        <a href="#biography">Biography</a><a href="#filmography">Filmography <span>{credits.length}</span></a>
        <a href="#portraits">Photo gallery <span>{photos.length}</span></a>
      </nav>
      {person.unavailable?.length > 0 && <div role="status" className="actor-partial-error">
        <p>We couldn't load {person.unavailable.join(", ")}. The rest of this profile is ready to explore.</p>
        <button type="button" onClick={retry}>Try again</button>
      </div>}
      <div className="actor-profile-body">
        <aside className="actor-facts" aria-label="Personal information">
          <p className="actor-eyebrow mb-6">At a glance</p>
          <dl>
            <div><dt>Known for</dt><dd>{person.known_for_department || "Not available"}</dd></div>
            <div><dt>Born</dt><dd>{person.birthday ? formatMovieDate(person.birthday) : "Not available"}
              {!person.deathday && age !== null && <span className="block text-white/45">{age} years old</span>}</dd></div>
            {person.deathday && <div><dt>Died</dt><dd>{formatMovieDate(person.deathday)}{age !== null && <span className="block text-white/45">Aged {age}</span>}</dd></div>}
            <div><dt>Place of birth</dt><dd>{person.place_of_birth || "Not available"}</dd></div>
            {person.also_known_as?.length > 0 && <div><dt>Also known as</dt><dd><details className="actor-aliases"><summary>{person.also_known_as[0]}{person.also_known_as.length > 1 ? ` +${person.also_known_as.length - 1}` : ""}</summary>
              {person.also_known_as.length > 1 && <ul className="mt-2 space-y-1 text-white/55">{person.also_known_as.slice(1).map((name) => <li key={name}>{name}</li>)}</ul>}
            </details></dd></div>}
          </dl>
          <div className="mt-7 flex flex-wrap gap-2">
            <a className="actor-external-link" href={`https://www.themoviedb.org/person/${person.id}`} target="_blank" rel="noreferrer">TMDB <ArrowUpRight className="size-3.5" /><span className="sr-only"> (opens in a new tab)</span></a>
            {/^nm\d+$/.test(imdb || "") && <a className="actor-external-link" href={`https://www.imdb.com/name/${imdb}/`} target="_blank" rel="noreferrer">IMDb <ArrowUpRight className="size-3.5" /><span className="sr-only"> (opens in a new tab)</span></a>}
          </div>
        </aside>

        <div className="min-w-0">
          <section id="biography" className="actor-section pt-0" aria-labelledby="biography-title">
            <p className="actor-eyebrow mb-3">Behind the performances</p>
            <h2 id="biography-title" className="actor-section-title">The story so far.</h2>
            <p className={`mt-6 whitespace-pre-line text-sm leading-8 text-white/65 sm:text-base ${!bioExpanded && biography?.length > 600 ? "line-clamp-7" : ""}`}>
              {biography || "A biography hasn't been added for this actor yet. Explore their work below to discover their story on screen."}
            </p>
            {biography?.length > 600 && <button type="button" className="actor-text-button mt-4" aria-expanded={bioExpanded} onClick={() => setBioExpanded((value) => !value)}>
              {bioExpanded ? "Read less" : "Read full biography"}<ArrowDown className={`size-3.5 ${bioExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>}
          </section>
          {highlights.length > 0 && <section className="actor-section" aria-labelledby="known-for-title">
            <h2 id="known-for-title" className="actor-section-title">Known for</h2>
            <div className="actor-known-for mt-6">{highlights.map((credit) => <CreditCard key={credit.key} credit={credit} />)}</div>
          </section>}
          {person.combined_credits ? <Filmography credits={credits} /> : <section id="filmography" className="actor-section">
            <h2 className="actor-section-title">Filmography</h2><ActorError message="The filmography couldn't be loaded." onRetry={retry} />
          </section>}
          <section id="portraits" className="actor-section" aria-labelledby="portraits-title">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="actor-eyebrow mb-3">A closer look</p><h2 id="portraits-title" className="actor-section-title">Photo gallery</h2></div>
              <span className="text-xs text-white/45">{photos.length} {photos.length === 1 ? "portrait" : "portraits"}</span></div>
            {photos.length > 0 ? <div className="actor-photos mt-7">{photos.map((photo, index) => (
              <button key={photo.file_path} type="button" className="actor-photo" aria-label={`View portrait ${index + 1} of ${person.name}`} onClick={() => setPhotoIndex(index)}>
                <Portrait path={photo.file_path} className="h-full w-full object-cover object-top" /><span><Images className="size-4" aria-hidden="true" /></span>
              </button>
            ))}</div> : <div className="actor-empty"><Images className="mx-auto mb-4 size-8 text-white/30" aria-hidden="true" /><p className="text-sm text-white/50">{person.images ? "No portraits have been added yet." : "Photos couldn't be loaded."}</p></div>}
          </section>
        </div>
      </div>
      <div className="border-t border-white/10 py-8"><BackToActors /></div>
    </div>
    {photoIndex !== null && <Modal title={`${person.name} · Photo gallery`} onClose={closePhoto} wide>
      <PhotoViewer photos={photos} index={photoIndex} setIndex={setPhotoIndex} name={person.name} />
    </Modal>}
  </main>;
}

export default function ActorDetails({ id }) {
  const { data, loading, error, retry } = useActorResource(`/api/actors/${encodeURIComponent(id)}`);
  if (loading) return <ActorLoading />;
  if (error) return <main className="actors-page min-h-[80vh] px-6 pb-20 pt-28"><div className="actor-container"><BackToActors /><ActorError message={error} onRetry={retry} /></div></main>;
  return <ProfileContent key={data.id} person={data} retry={retry} />;
}
