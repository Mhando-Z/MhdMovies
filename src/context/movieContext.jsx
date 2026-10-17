"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MovieListContext = createContext(null);

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Store your TMDB Read Access Token in .env.local
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

async function fetchMovies(endpoint, page = 1, includePagination = false) {
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
  if (includePagination) return data;
  return data.results ?? [];
}

export function MovieProvider({ children }) {
  const [Movielists, setList] = useState([]);
  const [Trending, setTrend] = useState([]);
  const [trendingPage, setTrendingPage] = useState(0);
  const [trendingTotalPages, setTrendingTotalPages] = useState(1);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);
  const trendingRequest = useRef(false);
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

  const loadMoreTrending = useCallback(async () => {
    if (trendingRequest.current || trendingPage >= trendingTotalPages) return;
    trendingRequest.current = true;
    setTrendingLoading(true);
    setTrendingError(null);
    try {
      const data = await fetchMovies("/trending/movie/day", trendingPage + 1, true);
      setTrend((previous) => {
        const ids = new Set(previous.map((movie) => movie.id));
        return [...previous, ...(data.results ?? []).filter((movie) => !ids.has(movie.id))];
      });
      setTrendingPage(data.page);
      setTrendingTotalPages(data.total_pages);
    } catch (err) {
      setTrendingError(err.message || "Failed to load trending movies.");
    } finally {
      trendingRequest.current = false;
      setTrendingLoading(false);
    }
  }, [trendingPage, trendingTotalPages]);

  useEffect(() => {
    if (trendingPage === 0) loadMoreTrending();
  }, [trendingPage, loadMoreTrending]);

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
        const [popular, topRated, upcoming] = await Promise.all([
          fetchMovies("/movie/popular", Page1),
          fetchMovies("/movie/top_rated", Page3),
          fetchMovies("/movie/upcoming", Page2),
        ]);

        if (cancelled) return;

        setList(popular);
        setTopRated(topRated);
        setUFuture(upcoming);
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
      loadMoreTrending,
      trendingLoading,
      trendingError,
      hasMoreTrending: trendingPage < trendingTotalPages,
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
      loadMoreTrending,
      trendingLoading,
      trendingError,
      trendingPage,
      trendingTotalPages,
      Page1,
      Page2,
      Page3,
      loading,
      error,
      isMobile,
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
