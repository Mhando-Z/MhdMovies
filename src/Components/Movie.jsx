import React from "react";
import { useNavigate } from "react-router-dom";

//import mage from "../Components/mhando.JPG";

function Movie({ title, image, id, type }) {
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
    <div className="flex flex-col justify-center">
      <div
        onClick={handleNavigation}
        style={{
          backgroundImage: `url("${`https://image.tmdb.org/t/p/w500/${image}`}")`,
        }}
        className="relative xl:w-52 lg:w-48 md:w-32 w-28 md:h-60 sm:h-52 h-48  bg-center bg-cover bg-no-repeat lg:h-72 rounded-t-lg flex flex-col shadow-2xl ring-1 ring-slate-800 items-center gap-2"
      >
        <div className="absolute top-0 left-0 right-0 via-transparent  bottom-0 bg-gradient-to-b from-transparent to-slate-800"></div>
        <h1 className="absolute bottom-0 xl:text-lg  line-clamp-2 text-slate-300 font-semibold text-center p-1">
          {title || ""}
        </h1>
      </div>
    </div>
  );
}
export default Movie;
