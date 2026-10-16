"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const MovieDetailsContext = createContext(null);

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchJson(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function fetchTmdb(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.search = new URLSearchParams(params).toString();

  return fetchJson(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
    },
  });
}

export function MovieDetailsProvider({ id, children }) {
  // Movie state
  const [details, setDetails] = useState(null);
  const [review, setReview] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState([]);
  const [cast, setCast] = useState([]);
  const [mediaInfo, setMediaInfo] = useState(null);

  // Cast details state
  const [castId, setCastId] = useState(null);
  const [castDetails, setCastDetails] = useState(null);
  const [castMovies, setCastMovies] = useState(null);
  const [castTvSeries, setCastTvSeries] = useState(null);
  const [castImage, setCastImage] = useState(null);

  // UI state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [select, setSelect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [trailer, setTrailer] = useState(false);
  const [watch, setWatch] = useState(false);
  const [watch2, setWatch2] = useState(false);
  const [showWatchOptions, setShowWatchOptions] = useState(false);
  const [showCastDetails, setShowCastDetails] = useState(false);

  // Fetch movie details
  const getDetails = useCallback(async () => {
    const data = await fetchTmdb(`/movie/${id}`, {
      language: "en-US",
    });

    setDetails(data);
    return data;
  }, [id]);

  // Fetch movie reviews
  const getReview = useCallback(async () => {
    const data = await fetchTmdb(`/movie/${id}/reviews`, {
      language: "en-US",
    });

    setReview(data.results ?? []);
  }, [id]);

  // Fetch similar movies
  const getSimilar = useCallback(async () => {
    const data = await fetchTmdb(`/movie/${id}/similar`, {
      language: "en-US", page,
    });

    setSimilar(data.results ?? []);
  }, [id, page]);

  // Fetch movie backdrops
  const getImages = useCallback(async () => {
    const data = await fetchTmdb(`/movie/${id}/images`);

    setImage(data.backdrops ?? []);
  }, [id]);

  // Fetch trailers and other videos
  const getVideo = useCallback(async () => {
    const data = await fetchTmdb(`/movie/${id}/videos`, {
      language: "en-US",
    });

    const videos = data.results ?? [];
    setVideo(videos);

    setSelect((current) =>
      videos.some((item) => item.key === current)
        ? current
        : (videos.find((item) => item.site === "YouTube")?.key ??
          videos[0]?.key ??
          null),
    );
  }, [id]);

  // Fetch movie cast
  const getCasts = useCallback(async () => {
    const data = await fetchTmdb(`/movie/${id}/credits`, {
      language: "en-US",
    });

    setCast(data.cast ?? []);
  }, [id]);

  // Fetch cast biography and profile details
  const getCastsDetails = useCallback(async () => {
    const data = await fetchTmdb(`/person/${castId}`, {
      language: "en-US",
    });

    setCastDetails(data);
  }, [castId]);

  // Fetch cast movies
  const getCastsMovies = useCallback(async () => {
    const data = await fetchTmdb(`/person/${castId}/movie_credits`, {
      language: "en-US",
    });

    setCastMovies(data);
  }, [castId]);

  // Fetch cast TV series
  const getCastsTvSeries = useCallback(async () => {
    const data = await fetchTmdb(`/person/${castId}/tv_credits`, {
      language: "en-US",
    });

    setCastTvSeries(data);
  }, [castId]);

  // Fetch cast images
  const getCastsImages = useCallback(async () => {
    const data = await fetchTmdb(`/person/${castId}/images`);

    setCastImage(data);
  }, [castId]);

  // Fetch torrent listing metadata from YTS
  const fetchMovieData = useCallback(async (imdbId) => {
    const url = new URL("https://yts.mx/api/v2/list_movies.json");
    url.search = new URLSearchParams({ query_term: imdbId }).toString();
    const data = await fetchJson(url);

    return data.data?.movies?.[0] ?? null;
  }, []);

  const fetchMediaInfo = useCallback(async () => {
    if (!details?.imdb_id) {
      setMediaInfo(null);
      return;
    }

    try {
      const movie = await fetchMovieData(details.imdb_id);
      setMediaInfo(movie);
    } catch (err) {
      console.error("Failed to fetch media information:", err);
      setMediaInfo(null);
    }
  }, [details?.imdb_id, fetchMovieData]);

  // Fetch movie information when the movie ID or page changes
  useEffect(() => {
    if (!id) {
      setDetails(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadMovie() {
      setLoading(true);
      setError(null);
      setDetails(null);

      try {
        const results = await Promise.allSettled([
          getDetails(),
          getReview(),
          getSimilar(),
          getImages(),
          getVideo(),
          getCasts(),
        ]);

        if (cancelled) return;

        const failed = results.find((result) => result.status === "rejected");

        if (failed) {
          console.error("Some movie requests failed:", failed.reason);
          setError("Some movie information could not be loaded.");
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load movie information.");
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    page,
    getDetails,
    getReview,
    getSimilar,
    getImages,
    getVideo,
    getCasts,
  ]);

  // Fetch additional media metadata when the IMDb ID becomes available
  useEffect(() => {
    fetchMediaInfo();
  }, [fetchMediaInfo]);

  // Fetch selected cast member information
  useEffect(() => {
    if (!castId) return;

    let cancelled = false;

    async function loadCast() {
      setLoading(true);

      const results = await Promise.allSettled([
        getCastsDetails(),
        getCastsMovies(),
        getCastsTvSeries(),
        getCastsImages(),
      ]);

      if (cancelled) return;

      const failed = results.some((result) => result.status === "rejected");

      if (failed) {
        console.error("Some cast information could not be loaded.");
      }

      setLoading(false);
    }

    loadCast();

    return () => {
      cancelled = true;
    };
  }, [
    castId,
    getCastsDetails,
    getCastsMovies,
    getCastsTvSeries,
    getCastsImages,
  ]);

  // Movie and cast helpers
  const handleCast = (personId) => {
    setCastId(personId);
    setShowCastDetails(true);
  };

  const handleSelect = (key) => setSelect(key);

  const handleTrailer = () => {
    setWatch(false);
    setWatch2(false);
    setTrailer((value) => !value);
  };

  const handleWatch = () => {
    setShowWatchOptions(false);
    setTrailer(false);
    setWatch2(false);
    setWatch(true);
  };

  const handleWatch2 = () => {
    setShowWatchOptions(false);
    setTrailer(false);
    setWatch(false);
    setWatch2(true);
  };

  const handleWatchClick = () => {
    setShowWatchOptions((value) => !value);
    setWatch(false);
    setWatch2(false);
  };

  const handleIncrese = () => {
    setCount((value) => Math.min(value + 6, 20));
  };

  const handleDecrease = () => {
    setCount((value) => Math.max(value - 6, 0));
  };

  const handlePages = () => setPage((value) => value + 1);
  const handlePage = () => setPage((value) => Math.max(value - 1, 1));

  const Similars = similar.filter((movie) => movie.poster_path);
  const Casts = cast.filter((person) => person.profile_path);

  const value = {
    // Movie data
    Details: details,
    Review: review,
    Similar: similar,
    Image: image,
    Video: video,
    Cast: cast,
    MediaInfo: mediaInfo,
    Similars,
    Casts,

    // Cast data
    CastId: castId,
    CastDetails: castDetails,
    CastMovies: castMovies,
    CastTvSeries: castTvSeries,
    CastImage: castImage,

    // UI state
    Page: page,
    Count: count,
    Select: select,
    Loading: loading,
    Error: error,
    Trailer,
    Watch: watch,
    Watch2: watch2,
    ShowWatchOptions: showWatchOptions,
    ShowCastDetails: showCastDetails,

    // State setters
    setPage,
    setCount,
    setSelect,
    setTrailer,
    setWatch,
    setWatch2,
    setShowWatchOptions,
    setShowCastDetails,
    setCastId,

    // API functions
    getDetails,
    getReview,
    getSimilar,
    getImages,
    getVideo,
    getCasts,
    getCastsDetails,
    getCastsMovies,
    getCastsTvSeries,
    getCastsImages,
    fetchMediaInfo,
    fetchMovieData,

    // Event handlers
    handleCast,
    handleSelect,
    handleTrailer,
    handleWatch,
    handleWatch2,
    handleWatchClick,
    handleIncrese,
    handleDecrease,
    handlePages,
    handlePage,
  };

  return (
    <MovieDetailsContext.Provider value={value}>
      {children}
    </MovieDetailsContext.Provider>
  );
}

export function useMovieDetails() {
  const context = useContext(MovieDetailsContext);

  if (!context) {
    throw new Error("useMovieDetails must be used inside MovieDetailsProvider");
  }

  return context;
}
