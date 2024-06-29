import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Movie from "../Components/Movie";

function ResultsPage() {
  const [Dataquery, setData] = useState();
  const { id } = useParams();
  const [count, setCount] = useState(14);
  const [Page, setPage] = useState(1);

  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    } else {
      setPage(Page + 1);
    }
  };

  async function getDetails() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/multi?query=${id}&include_adult=false&language=en-US&page=${Page}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setData(data.results);
    } catch (error) {}
  }
  useEffect(() => {
    getDetails();
  }, [id]);

  return (
    <div className="flex flex-col">
      <div className="lg:px-10 px-2">
        <h1 className="lg:text-2xl text-xl px-4 mb-7 text-slate-200 py-4 border-l-8 border-yellow-400">
          Search Results for... "{id}"
        </h1>
      </div>
      <div className="flex flex-col sm:items-center ">
        <div>
          <div className="md:px-10 p-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-3 gap-y-5">
            {Dataquery?.slice(0, count).map((data, index) => {
              return (
                <Movie
                  key={index + data.id}
                  title={data.title}
                  title2={data.name}
                  image={data.poster_path}
                  image2={data.backdrop_path}
                  id={data.id}
                  type={data.media_type}
                />
              );
            })}
          </div>
          <div className="flex gap-x-5 items-end justify-end px-10 py-4">
            <h1 className="text-slate-200 text-xl font-semibold ">
              Page {Page}
            </h1>
            <h1
              onClick={handleIncrese}
              className="text-slate-200 text-xl font-semibold cursor-pointer"
            >
              More..
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
