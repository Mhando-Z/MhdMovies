import React from "react";

const PosterExpands = ({ movie, isHovered, onHover, onLeave }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg transition-all duration-500 ease-in-out shadow-xl ${
        isHovered ? "w-96" : "w-64"
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="relative h-96">
        {/* Default poster */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
            alt={`${movie.title || movie.name} Poster`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Expanded content */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent to-black transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
            alt={`${movie.title || movie.name} Scene`}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
            <h2 className="mb-2 text-2xl font-bold">
              {movie.title || movie.name}
            </h2>
            <p className="text-sm text-gray-300">{movie.overview}</p>
          </div>
          <div className="absolute top-0 right-0 left-0 bottom-0 bg-gradient-to-t from-black via-transparent via-50% to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default PosterExpands;
