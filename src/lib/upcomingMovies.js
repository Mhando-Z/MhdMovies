export const UPCOMING_BATCH_SIZE = 20;

export async function collectUpcomingMovies({
  fetchPage,
  page,
  totalPages,
  buffered = [],
  existing = [],
  now,
}) {
  const ids = new Set(existing.map((movie) => movie.id));
  const collected = [];
  function collect(movies) {
    for (const movie of filterUpcomingMovies(movies, now)) {
      if (!ids.has(movie.id)) {
        ids.add(movie.id);
        collected.push(movie);
      }
    }
  }

  collect(buffered);
  while (collected.length < UPCOMING_BATCH_SIZE && page < totalPages) {
    const nextPage = page + 1;
    const data = await fetchPage(nextPage);
    collect(data.results ?? []);
    page = nextPage;
    totalPages = data.total_pages;
  }

  return {
    movies: collected.slice(0, UPCOMING_BATCH_SIZE),
    buffered: collected.slice(UPCOMING_BATCH_SIZE),
    page,
    totalPages,
  };
}

export function filterUpcomingMovies(movies, now) {
  // Compare calendar dates in the viewer's timezone, without UTC conversion.
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return movies.filter(({ release_date }) => {
    if (
      typeof release_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(release_date)
    ) {
      return false;
    }
    const parsed = new Date(`${release_date}T00:00:00Z`);
    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === release_date &&
      release_date >= today
    );
  });
}
