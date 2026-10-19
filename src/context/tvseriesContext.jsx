"use client";

import { createContext, useContext, useState } from "react";
import { useResource } from "@/components/tvSeries/TvUI";

const TvSeriesContext = createContext(null);

export function TvSeriesProvider({ children }) {
  const [category, setCategory] = useState("trending");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const featured = useResource("/api/tvseries?category=trending");
  const genres = useResource("/api/tvseries?genres=1");
  const catalogue = useResource(
    `/api/tvseries?${new URLSearchParams({ category, genre, page: String(page) })}`,
  );
  function changeCategory(value) {
    setCategory(value);
    setGenre("");
    setPage(1);
  }
  function changeGenre(value) {
    setGenre(value);
    setPage(1);
  }
  return (
    <TvSeriesContext.Provider
      value={{
        category,
        genre,
        page,
        setPage,
        changeCategory,
        changeGenre,
        featured,
        genres,
        catalogue,
      }}
    >
      {children}
    </TvSeriesContext.Provider>
  );
}

export function useTvSeries() {
  const context = useContext(TvSeriesContext);
  if (!context) throw new Error("useTvSeries requires TvSeriesProvider");
  return context;
}
