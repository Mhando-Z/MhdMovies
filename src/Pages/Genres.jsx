import React, { useContext, useState } from "react";
import MovieListContext from "../Context/MovieListContext";
import MovieGenre from "../Data/MovieGenre";
import TvGenre from "../Data/TvSeriesGenre";
import Movie from "../Components/Movie";
import TvSeriesContex from "../Context/TvSeriesContext";
import TvSeries from "./../Components/TvSeries";

function Genres() {
  const { Collected } = useContext(MovieListContext);
  const { Page1 } = useContext(MovieListContext);
  const { HandlePages } = useContext(MovieListContext);
  const { TvCollected } = useContext(TvSeriesContex);
  const { TvHandlePages } = useContext(TvSeriesContex);
  const [ShowContent1, setContent] = useState(true);
  const [ShowContent2, setContent2] = useState(false);
  const [Selected, setSelect] = useState(28);
  const [TvSelected, setSelectTv] = useState(18);
  const [Gname, setName] = useState("");
  const [Gnames, setNames] = useState("");
  const [Unselect, setUnselect] = useState("bg-black");
  const [Unselect1, setUnselect1] = useState("bg-black");
  const { genres } = MovieGenre;
  const { genre } = TvGenre;
  const [count, setCount] = useState(14);
  const [counts, setCounts] = useState(14);

  //handle page incement
  const handleIncrese = () => {
    if (count <= dataFilterd.length) {
      setCount(count + 6);
    } else {
      HandlePages();
    }
  };
  const handleIncreses = () => {
    if (counts <= TvdataFilter.length) {
      setCounts(counts + 6);
    } else {
      TvHandlePages();
    }
  };

  //selecting genres Logic
  const HandleSelect = (value, Name) => {
    setSelect(value);
    setName(Name);
    setUnselect("bg-slate-800 p-1");
    setUnselect1("bg-nome");
    if (ShowContent2 === true) {
      setContent(true);
      setContent2(false);
      setCounts(14);
    }
  };
  const HandleTvSelect = (value, Name) => {
    setSelectTv(value);
    setNames(Name);
    setUnselect("bg-none");
    setUnselect1("bg-slate-800 p-1");
    if (ShowContent1 === true) {
      setContent(false);
      setContent2(true);
      setCount(14);
    }
  };
  //filtering movies and series logic
  const dataFilterd = Collected.filter((dt) => {
    return dt.genre_ids.includes(Selected);
  });
  const TvdataFilter = TvCollected.filter((dt) => {
    return dt.genre_ids.includes(TvSelected);
  });

  return (
    <div className="flex mt-10 flex-col gap-y-5 justify-between min-h-screen lg:px-10 px-2">
      <div className="flex flex-col md:flex-row justify-between gap-x-10">
        <div className="flex md:flex-col justify-between flex-row md:w-[200px] md:h-[600px] h-[200px] md:rounded-2xl bg-slate-600">
          <div className="flex flex-col">
            <div className="bg-slate-600 h-[60px]">
              <div className="px-5 py-5">
                <h1 className="text-xl font-bold text-slate-200">
                  Movie Genres
                </h1>
              </div>
            </div>
            <div className="h-[240px] overflow-auto p-5">
              {genres?.map((data, index) => {
                return (
                  <div
                    key={index + data.name}
                    className={`${data.name === Gname ? Unselect : ""}`}
                  >
                    <h1
                      onClick={() => HandleSelect(data.id, data.name)}
                      className="text-xl text-slate-200 font-semibold cursor-pointer"
                    >
                      {data.name}
                    </h1>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-slate-600 h-[60px]">
              <div className="px-5 py-5">
                <h1 className="text-xl font-bold text-slate-200">
                  Tv-Series Genres
                </h1>
              </div>
            </div>
            <div className="h-[240px] overflow-auto p-5">
              {genre?.map((data, index) => {
                return (
                  <div
                    key={index + data.name}
                    className={`${data.name === Gnames ? Unselect1 : " "}`}
                  >
                    <h1
                      onClick={() => HandleTvSelect(data.id, data.name)}
                      className="text-xl text-slate-200 font-semibold cursor-pointer"
                    >
                      {data.name}
                    </h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex-1 h-[900px] flex-col justify-center overflow-auto rounded-xl ring-4 ring-slate-700 ">
          {ShowContent1 && (
            <div>
              <div className="py-4 lg:px-10 px-2 bg-slate-800 w-full">
                <h1 className="text-3xl  border-l-4 border-yellow-400 px-4 font-bold text-slate-200 ">
                  {Gname}
                </h1>
              </div>
              <div className="flex flex-col sm:items-center">
                <div className="md:px-10 p-2 items-center grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-3 gap-y-5">
                  {dataFilterd?.slice(0, count).map((data, index) => {
                    return (
                      <Movie
                        key={index + data.title}
                        title={data.title}
                        image={data.poster_path}
                        id={data.id}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-x-5 items-end justify-end px-10 py-4">
                  <h1 className="text-slate-200 text-xl font-semibold ">
                    Page {1}
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
          )}
          {ShowContent2 && (
            <div>
              <div className="py-4 lg:px-10 px-2 bg-slate-800 w-full">
                <h1 className="text-3xl  border-l-4 border-yellow-400 px-4 font-bold text-slate-200 ">
                  {Gnames}
                </h1>
              </div>
              <div className="flex flex-col sm:items-center">
                <div className="md:px-10 p-2 items-center grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-3 gap-y-5">
                  {TvdataFilter?.slice(0, counts).map((data, index) => {
                    return (
                      <TvSeries
                        key={index + data.name}
                        title={data.name}
                        image={data.poster_path}
                        id={data.id}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-x-5 items-end justify-end px-2 py-4">
                  <h1 className="text-slate-200 text-xl font-semibold ">
                    Page {Page1}
                  </h1>
                  <h1
                    onClick={handleIncreses}
                    className="text-slate-200 text-xl font-semibold cursor-pointer"
                  >
                    More..
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Genres;