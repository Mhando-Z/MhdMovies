import axios from "axios";
import { createContext, useEffect, useState } from "react";

const TvSeriesContex = createContext();

export function TvSeriesProvider({ children }) {
  const [Tvlist, setList] = useState([]);
  const [Todaylist, setList2] = useState([]);
  const [TopRated, setTopRated] = useState([]);
  const [Page1, setPage1] = useState(1);
  const [Page2, setPage2] = useState(1);
  const [Page3, setPage3] = useState(1);
  const TvCollected = [...Tvlist, ...TopRated, ...Todaylist];

  const TvHandlePages = () => {
    setPage1(Page1 + 1);
    setPage3(Page3 + 1);
    setPage2(Page2 + 1);
  };
  const HandlePage = () => {
    setPage1(Page1 + 1);
  };
  const HandlePage3 = () => {
    setPage3(Page3 + 1);
  };
  const HandlePage2 = () => {
    setPage2(Page2 + 1);
  };

  async function getTv() {
    try {
      const { data } = await axios.get(
        ` https://api.themoviedb.org/3/tv/popular?language=en-US&page=${Page1}`,
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
  async function getTopRated() {
    try {
      const { data } = await axios.get(
        ` https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${Page3}`,
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
  async function getTodays() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=${Page2}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setList2(data.results);
    } catch (error) {}
  }
  useEffect(() => {
    getTopRated();
    getTodays();
    getTv();
  }, [Page1, Page2, Page3]);
  return (
    <TvSeriesContex.Provider
      value={{
        Tvlist,
        Todaylist,
        Page1,
        Page2,
        HandlePage,
        HandlePage2,
        HandlePage3,
        TvHandlePages,
        TopRated,
        TvCollected,
      }}
    >
      {children}
    </TvSeriesContex.Provider>
  );
}

export default TvSeriesContex;
