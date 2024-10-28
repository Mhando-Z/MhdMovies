import React, { useContext, useState } from "react";
import MovieListContext from "../../Context/MovieListContext";
import TvSeriesContex from "../../Context/TvSeriesContext";
import MovieGenre from "../../Data/MovieGenre";
import TvGenre from "../../Data/TvSeriesGenre";
import MoviePoster from "../Components/MoviePoster";
import TvSeriesPoster from "../Components/TvSeriesPoster";
import { ChevronRight, Menu, X, Film, Tv } from "lucide-react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Genres() {
  const { Collected, Page1, HandlePages } = useContext(MovieListContext);
  const { TvCollected, TvHandlePages } = useContext(TvSeriesContex);
  const [ShowContent1, setContent] = useState(true);
  const [ShowContent2, setContent2] = useState(false);
  const [Selected, setSelect] = useState(28);
  const [TvSelected, setSelectTv] = useState(18);
  const [Gname, setName] = useState("Action");
  const [Gnames, setNames] = useState("");
  const [count, setCount] = useState(14);
  const [counts, setCounts] = useState(14);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { genres } = MovieGenre;
  const { genre } = TvGenre;

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

  const HandleSelect = (value, Name) => {
    setSelect(value);
    setName(Name);
    if (ShowContent2) {
      setContent(true);
      setContent2(false);
      setCounts(14);
    }
  };

  const HandleTvSelect = (value, Name) => {
    setSelectTv(value);
    setNames(Name);
    if (ShowContent1) {
      setContent(false);
      setContent2(true);
      setCount(14);
    }
  };

  const dataFilterd = Collected.filter((dt) => dt.genre_ids.includes(Selected));
  const TvdataFilter = TvCollected.filter((dt) =>
    dt.genre_ids.includes(TvSelected)
  );

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-72 bg-gray-800 h-full transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white">Genre Explorer</h1>
            <FaHome
              onClick={handleNavigate}
              className="text-xl text-white cursor-pointer hover:text-yellow-400"
            />
            <button
              className="p-2 text-gray-400 rounded-lg md:hidden hover:bg-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="mb-6">
                <div className="flex items-center mb-4 space-x-2">
                  <Film className="text-yellow-500" size={20} />
                  <h2 className="text-lg font-semibold text-white">Movies</h2>
                </div>
                <div className="space-y-1">
                  {genres?.map((data) => (
                    <button
                      key={data.id}
                      onClick={() => HandleSelect(data.id, data.name)}
                      className={`w-full px-4 py-2 text-sm text-left transition-colors rounded-lg ${
                        data.name === Gname
                          ? "bg-yellow-500 text-gray-900 font-medium"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {data.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4 space-x-2">
                  <Tv className="text-yellow-500" size={20} />
                  <h2 className="text-lg font-semibold text-white">
                    TV Series
                  </h2>
                </div>
                <div className="space-y-1">
                  {genre?.map((data) => (
                    <button
                      key={data.id}
                      onClick={() => HandleTvSelect(data.id, data.name)}
                      className={`w-full px-4 py-2 text-sm text-left transition-colors rounded-lg ${
                        data.name === Gnames
                          ? "bg-yellow-500 text-gray-900 font-medium"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {data.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-800 shadow-lg">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              className="p-2 text-gray-400 rounded-lg md:hidden hover:bg-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">
              {ShowContent1 ? Gname : Gnames}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="p-4">
          {ShowContent1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                {dataFilterd?.slice(0, count).map((data) => (
                  <div
                    key={data.id}
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    <div className="overflow-hidden rounded-lg shadow-lg">
                      <MoviePoster
                        title={data.title}
                        image={data.poster_path}
                        image2={data?.backdrop_path}
                        id={data.id}
                        rating={data?.vote_average}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-4 mt-6 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Page {Page1}</span>
                <button
                  onClick={handleIncrese}
                  className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600"
                >
                  <span>Load More</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {ShowContent2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {TvdataFilter?.slice(0, counts).map((data) => (
                  <div
                    key={data.id}
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    <div className="overflow-hidden rounded-lg shadow-lg">
                      <TvSeriesPoster
                        name={data.name}
                        image2={data?.backdrop_path}
                        image={data.poster_path}
                        id={data.id}
                        rating={data?.vote_average}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-4 mt-6 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Page {Page1}</span>
                <button
                  onClick={handleIncreses}
                  className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600"
                >
                  <span>Load More</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Genres;
