import assert from "node:assert/strict";
import { test } from "node:test";
import { personAge, personCredits, sortCredits } from "../src/lib/people.js";

test("a movie and a TV series with the same ID remain separate, including posterless credits", () => {
  const credits = personCredits({ combined_credits: { cast: [
    { id: 10, media_type: "movie", title: "A film", character: "Lead", poster_path: null },
    { id: 10, media_type: "tv", name: "A series", first_air_date: "2020-01-01" },
  ] } });
  assert.equal(credits.length, 2);
  assert.equal(credits[0].key, "movie-10");
  assert.equal(credits[1].key, "tv-10");
  assert.equal(credits[1].title, "A series");
  assert.equal(credits[1].date, "2020-01-01");
});

test("repeated cast and crew credits preserve all roles without duplicating the title", () => {
  const movie = { id: 11, media_type: "movie", title: "Multiple hats" };
  const [credit] = personCredits({ combined_credits: {
    cast: [{ ...movie, character: "One" }, { ...movie, character: "Two" }, { ...movie, character: "One" }],
    crew: [{ ...movie, job: "Director" }, { ...movie, job: "Producer" }, { ...movie, job: "Producer" }],
  } });
  assert.deepEqual(credit.characters, ["One", "Two"]);
  assert.deepEqual(credit.jobs, ["Director", "Producer"]);
  assert.equal(credit.acting, true);
  assert.equal(credit.crew, true);
});

test("modal movie/TV responses normalize to the same filmography and keep crew-only work", () => {
  const credits = personCredits({
    movie_credits: { cast: [{ id: 1, title: "Film" }], crew: [{ id: 2, title: "Directed film", job: "Director" }] },
    tv_credits: { cast: [{ id: 1, name: "Series" }] },
  });
  assert.equal(credits.length, 3);
  assert.equal(credits.find((credit) => credit.id === 2).acting, false);
  assert.equal(credits.find((credit) => credit.id === 2).crew, true);
  assert.deepEqual(personCredits({}), []);
});

test("date sorting includes announced and undated work without mutating the source", () => {
  const credits = [
    { title: "Undated", date: "", popularity: 100 },
    { title: "Older", date: "1999-01-01", popularity: 20 },
    { title: "Upcoming", date: "2030-01-01", popularity: 10 },
  ];
  assert.deepEqual(sortCredits(credits).map((credit) => credit.title), ["Upcoming", "Older", "Undated"]);
  assert.deepEqual(sortCredits(credits, "oldest").map((credit) => credit.title), ["Older", "Upcoming", "Undated"]);
  assert.deepEqual(sortCredits(credits, "popular").map((credit) => credit.title), ["Undated", "Older", "Upcoming"]);
  assert.equal(credits[0].title, "Undated");
});

test("ages respect birthdays, UTC date boundaries, and the date of death", () => {
  assert.equal(personAge("1980-10-19", null, new Date("2026-10-18T23:59:00Z")), 45);
  assert.equal(personAge("1980-10-19", null, new Date("2026-10-19T00:00:00Z")), 46);
  assert.equal(personAge("1980-10-19", "2020-10-18"), 39);
  assert.equal(personAge(null), null);
  assert.equal(personAge("invalid"), null);
});
