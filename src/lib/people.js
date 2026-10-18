// TMDB IDs are unique within a media type, not across movies and television.
export function personCredits(person) {
  const combined = person.combined_credits;
  const cast = combined?.cast ?? [
    ...(person.movie_credits?.cast ?? []).map((item) => ({
      ...item,
      media_type: "movie",
    })),
    ...(person.tv_credits?.cast ?? []).map((item) => ({
      ...item,
      media_type: "tv",
    })),
  ];
  const crew = combined?.crew ?? [
    ...(person.movie_credits?.crew ?? []).map((item) => ({
      ...item,
      media_type: "movie",
    })),
    ...(person.tv_credits?.crew ?? []).map((item) => ({
      ...item,
      media_type: "tv",
    })),
  ];
  const titles = new Map();
  for (const [items, contribution] of [
    [cast, "acting"],
    [crew, "crew"],
  ]) {
    for (const item of items) {
      if (!item.id || !["movie", "tv"].includes(item.media_type)) continue;
      const key = `${item.media_type}-${item.id}`;
      const credit = titles.get(key) ?? {
        ...item,
        key,
        title: item.title || item.name || "Untitled",
        date: item.release_date || item.first_air_date || "",
        characters: [],
        jobs: [],
        acting: false,
        crew: false,
      };
      credit[contribution] = true;
      if (
        contribution === "acting" &&
        item.character &&
        !credit.characters.includes(item.character)
      ) {
        credit.characters.push(item.character);
      }
      if (
        contribution === "crew" &&
        item.job &&
        !credit.jobs.includes(item.job)
      )
        credit.jobs.push(item.job);
      titles.set(key, credit);
    }
  }
  return [...titles.values()];
}

export function sortCredits(credits, sort = "newest") {
  return [...credits].sort((a, b) => {
    if (sort === "popular")
      return (
        (b.popularity ?? 0) - (a.popularity ?? 0) ||
        a.title.localeCompare(b.title)
      );
    // Undated and announced titles remain discoverable at the end in either direction.
    if (!a.date || !b.date)
      return (
        Number(!a.date) - Number(!b.date) || a.title.localeCompare(b.title)
      );
    return (
      (sort === "oldest"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date)) || a.title.localeCompare(b.title)
    );
  });
}

export function personAge(birthday, deathday, today = new Date()) {
  if (!birthday) return null;
  const start = new Date(`${birthday}T00:00:00Z`);
  const end = deathday ? new Date(`${deathday}T00:00:00Z`) : today;
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  )
    return null;
  const hadBirthday =
    end.getUTCMonth() > start.getUTCMonth() ||
    (end.getUTCMonth() === start.getUTCMonth() &&
      end.getUTCDate() >= start.getUTCDate());
  return end.getUTCFullYear() - start.getUTCFullYear() - Number(!hadBirthday);
}
