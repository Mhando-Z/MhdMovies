import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "../Components/Rating";
import { IoPersonCircleOutline } from "react-icons/io5";

function MovieDetails() {
  const [Details, setDetails] = useState([]);
  const [Reviews, setReview] = useState([]);
  const [Images, setImage] = useState([]);
  const [Similar, setSimilar] = useState([]);
  const [Page, setPage] = useState(1);
  const { id } = useParams();

  //Page Logic
  const HandlePage = () => {
    setPage(Page + 1);
  };

  //Logics
  async function getDetails() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setDetails(data);
    } catch (error) {}
  }
  async function getReview() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setReview(data.results);
    } catch (error) {}
  }
  async function getSimilar() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${Page}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setSimilar(data.results);
    } catch (error) {}
  }
  async function getImages() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/images`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );

      setImage(data.backdrops);
    } catch (error) {}
  }

  useEffect(() => {
    getImages();
    getReview();
    getDetails();
    getSimilar();
  }, [Page, id]);

  console.log(Details);
  console.log(Images);

  return (
    <div className="flex flex-col min-h-screen mt-20 font-roboto">
      <div className="container flex flex-col mx-auto">
        {/* backdrop poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500/${Details?.backdrop_path}`}
          alt={Details?.title}
          className="object-cover w-screen h-[450px]"
        />
        <div className="flex flex-row gap-3">
          {/* frontal image */}
          <div className="bg-white h-[260px] rounded-lg mt-[-100px] ml-5">
            <img
              src={`https://image.tmdb.org/t/p/w500/${Details?.poster_path}`}
              alt={Details?.title}
              className="object-cover h-full rounded "
            />
          </div>
          {/* title and prompt actions */}
          <div>
            {/* movie title */}
            <h1 className="mb-2 text-5xl font-bold text-gray-100">
              {Details?.title}
            </h1>
            {/* movie genres */}
            <div className="flex flex-wrap items-center mb-2 md:flex-row gap-x-5">
              <h1 className="text-base font-medium text-gray-100 xl:text-lg">
                Genres:
              </h1>
              {Details?.genres?.map((data, index) => {
                return (
                  <div key={index + data.id} className="">
                    <h1 className="text-base font-semibold text-yellow-500 xl:text-lg">
                      {data.name}
                    </h1>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row items-center gap-x-3">
              <div>
                <h3 className="text-base text-gray-100 xl:text-lg">
                  {Details?.vote_average}
                </h3>
              </div>
              <Rating value={Details?.vote_average} />
            </div>
            <div className="flex flex-row items-center mt-2 font-mono text-base text-gray-100 xl:text-lg">
              <h1>{Math.trunc(Details?.runtime / 60)}h:</h1>
              <h1>{Details?.runtime % 60}min</h1>
            </div>
            {/* status and releasedate ingo */}
            <div className="flex flex-row items-center gap-x-5">
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-base lg:text-lg text-slate-200">Status:</h2>
                <h2 className="text-base text-yellow-500 xl:text-lg">
                  {Details?.status}
                </h2>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-base lg:text-lg text-slate-200">Date:</h2>
                <h2 className="text-base text-yellow-500 xl:text-lg">
                  {Details?.release_date}
                </h2>
              </div>
            </div>
            {/* budget details */}
            <div className="flex flex-row justify-between bg-slate-800 bg-opacity-10 md:justify-normal gap-x-5">
              <h1 className="flex flex-row items-center text-base xl:text-lg text-slate-200">
                Budget: {Details?.budget?.toLocaleString()}
              </h1>
              <h1 className="flex flex-row items-center text-base xl:text-lg text-slate-200">
                Revenue: {Details?.revenue?.toLocaleString()}
              </h1>
            </div>
            {/* movie description */}
            <p className="max-w-lg mt-2 text-gray-100">{Details?.overview}</p>
          </div>
          {/* Action Buttons */}
          <div></div>
        </div>
        {/* Other movie images */}
        <div className="grid grid-cols-3 gap-1 mt-5">
          {Images?.slice(1, 4).map((dt, index) => {
            return (
              <div key={dt.file_path + index}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${dt?.file_path}`}
                  alt={dt?.title}
                  className="object-cover w-screen h-[300px]"
                />
              </div>
            );
          })}
        </div>

        {/* Reviews */}
        <div>
          {Reviews?.length === 0 ? (
            ""
          ) : (
            <div className="mt-5 h-[400px] overflow-auto bg-slate-900 bg-opacity-50">
              <div className="sticky top-0 flex border-b-2 bg-gray-950 border-slate-700">
                <h1 className="px-10 mt-5 mb-5 text-2xl font-semibold text-yellow-500 md:text-3xl ">
                  Reviews
                </h1>
              </div>
              {Reviews?.map((data, index) => {
                return (
                  <div
                    key={index + data.author}
                    className="flex flex-col px-10"
                  >
                    <h1 className="flex flex-row items-center w-full text-xl font-semibold gap-x-3 md:text-2xl text-slate-200">
                      <IoPersonCircleOutline className="text-3xl" />
                      {data.author}
                    </h1>
                    <p className="mb-6 text-base tracking-tighter text-justify xl:text-lg text-slate-200">
                      {data.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
