"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const MovieListContext = createContext(null);

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Store your TMDB Read Access Token in .env.local
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

async function fetchMovies(endpoint, page = 1) {
  const separator = endpoint.includes("?") ? "&" : "?";

  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}${separator}language=en-US&page=${page}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
      // Revalidate cached data every 5 minutes.
      next: { revalidate: 300 },
    },
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results ?? [];
}

export function MovieProvider({ children }) {
  const [Movielists, setList] = useState([]);
  const [Trending, setTrend] = useState([]);
  const [TopRated, setTopRated] = useState([]);
  const [UpComingMovies, setUFuture] = useState([]);

  const [visible, setVisible] = useState(false);

  const [Page1, setPage1] = useState(1);
  const [Page2, setPage2] = useState(3);
  const [Page3, setPage3] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if the window object is available
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      handleResize(); // Set initial state
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const Collected = useMemo(
    () => [...Movielists, ...TopRated, ...UpComingMovies],
    [Movielists, TopRated, UpComingMovies],
  );

  const getTrending = useCallback(async () => {
    return fetchMovies("/trending/movie/day");
  }, []);

  const HandlePages = useCallback(() => {
    setPage1((page) => page + 1);
    setPage2((page) => page + 1);
    setPage3((page) => page + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      setLoading(true);
      setError(null);

      try {
        const [popular, topRated, upcoming, trending] = await Promise.all([
          fetchMovies("/movie/popular", Page1),
          fetchMovies("/movie/top_rated", Page3),
          fetchMovies("/movie/upcoming", Page2),
          fetchMovies("/trending/movie/day"),
        ]);

        if (cancelled) return;

        setList(popular);
        setTopRated(topRated);
        setUFuture(upcoming);
        setTrend(trending);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load movies.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [Page1, Page2, Page3]);

  const value = useMemo(
    () => ({
      Movielists,
      UpComingMovies,
      Collected,
      visible,
      setVisible,
      getTrending,
      setPage1,
      setPage2,
      setPage3,
      HandlePages,
      TopRated,
      Trending,
      Page1,
      Page2,
      Page3,
      loading,
      error,
      isMobile,
    }),
    [
      Movielists,
      UpComingMovies,
      Collected,
      visible,
      getTrending,
      HandlePages,
      TopRated,
      Trending,
      Page1,
      Page2,
      Page3,
      loading,
      error,
    ],
  );

  return (
    <MovieListContext.Provider value={value}>
      {children}
    </MovieListContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieListContext);

  if (!context) {
    throw new Error("useMovies must be used inside MovieProvider");
  }

  return context;
}

export default MovieListContext;
