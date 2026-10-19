export function isMovieReleased(movie, now = new Date()) {
  if (!movie) return false;
  if (movie.status && movie.status !== "Released") return false;
  if (!movie.release_date) return movie.status === "Released";
  const date = new Date(`${movie.release_date}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date <= now;
}
