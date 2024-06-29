import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Movie({ title, title2, image, id, type, image2 }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };
  const navigate = useNavigate();

  // scrool top logic
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // handle navigation logic
  const handleNavigation = () => {
    if (type === "tv") {
      navigate(`/TvDetails/${id}`);
      scrollToTop();
    } else {
      navigate(`/Details/${id}`);
      scrollToTop();
    }
  };
  return (
    <div
      onClick={handleNavigation}
      className={`flex flex-col justify-center cursor-pointer ${
        image === null ? "hidden" : ""
      }`}
    >
      {imageError ? (
        <img
          src={`https://image.tmdb.org/t/p/w500/${image2}`}
          alt={title || title2}
          title={title || title2}
          loading="lazy"
          className="w-[250px] lg:h-[325px] xl:h-[350px] md:h-[300px]"
        />
      ) : (
        <img
          src={`https://image.tmdb.org/t/p/w500/${image}`}
          alt={title2 || title2}
          title={title2 || title2}
          loading="lazy"
          onError={handleImageError}
          className="w-[250px] lg:h-[325px] xl:h-[350px] md:h-[300px]"
        />
      )}
      <div className="h-16  border-b-2 border-slate-600 bg-slate-900 bg-opacity-65">
        <h1 className=" xl:text-lg line-clamp-2 text-slate-300 font-semibold text-center p-1">
          {title || title2}
        </h1>
      </div>
    </div>
  );
}
export default Movie;
