import React from "react";

const CastPoster = ({ actor }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg transition-all duration-500 ease-in-out shadow-xl ${"w-64"}`}
    >
      <div className="relative h-96">
        {/* Default poster */}
        <div className={`absolute inset-0 transition-opacity duration-500`}>
          <img
            src={`https://image.tmdb.org/t/p/w500${actor?.file_path}`}
            alt={`Actor Poster`}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CastPoster;
