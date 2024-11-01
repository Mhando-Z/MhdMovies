import { createContext, useEffect, useState } from "react";
import axios from "axios";

const MovieListContext = createContext();

export function MovieProvider({ children }) {
  const [Movielists, setList] = useState([]);
  const [Trending, setTrend] = useState([]);
  const [TopRated, setTopRated] = useState([]);
  const [UpComingMovies, setUFuture] = useState([]);
  const [visible, setVisible] = useState("");
  const [Page1, setPage1] = useState(1);
  const [Page2, setPage2] = useState(3);
  const [Page3, setPage3] = useState(1);
  const Collected = [...Movielists, ...TopRated, ...UpComingMovies];

  const HandlePages = () => {
    setPage1(Page1 + 1);
    setPage3(Page3 + 1);
    setPage2(Page2 + 1);
  };

  //APIS calls
  async function getTopRated() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${Page3}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setTopRated(data.results);
    } catch (error) {}
  }
  async function getTrending() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/day?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setTrend(data.results);
    } catch (error) {}
  }

  async function getMovies() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${Page1}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setList(data.results);
    } catch (error) {}
  }
  async function getFutureMovies() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${Page2}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setUFuture(data.results);
    } catch (error) {}
  }
  useEffect(() => {
    getTrending();
    getTopRated();
    getFutureMovies();
    getMovies();
  }, [Page1, Page2, Page3]);

  return (
    <MovieListContext.Provider
      value={{
        Movielists,
        UpComingMovies,
        Collected,
        visible,
        setVisible,
        setPage1,
        setPage2,
        setPage3,
        HandlePages,
        TopRated,
        Trending,
        Page1,
        Page3,
        Page2,
      }}
    >
      {children}
    </MovieListContext.Provider>
  );
}
export default MovieListContext;
