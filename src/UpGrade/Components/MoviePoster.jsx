import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoIosStar } from "react-icons/io";
import { BiSolidMoviePlay } from "react-icons/bi";

export default function MoviePoster({ title, rating, image, id }) {
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
    navigate(`/MovieDetails/${id}`);
    scrollToTop();
  };
  return (
    <div
      className={`flex flex-col justify-center cursor-pointer ${
        image === null ? "hidden" : ""
      }`}
    >
      <Link className="group">
        <div className="w-full relative group md:h-[330px] h-[200px]  overflow-hidden bg-gray-200 rounded-lg aspect-h-1 aspect-w-1 xl:aspect-h-8 xl:aspect-w-7">
          <img
            alt={title}
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w780/${image}`}
            className="object-cover object-center w-full h-full group-hover:opacity-75"
          />
          <div className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center hidden transition-all duration-700 bg-black rounded-lg bg-opacity-80 group-hover:flex">
            <motion.img
              initial={{ opacity: 0, scale: 0, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", ease: "easeOut" }}
              src={`https://image.tmdb.org/t/p/w500/${image}`}
              alt="staffname"
              className="object-cover mt-5 rounded-full ring-2 ring-white size-20 md:size-32"
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-1 mt-4 text-sm font-bold text-center text-white md:text-xl line-clamp-2"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-row items-center justify-center w-full text-sm font-medium text-center text-white md:text-lg gap-x-2"
            >
              {rating}
              <IoIosStar className="text-sm text-yellow-400 md:text-lg" />
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              onClick={handleNavigation}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", ease: "easeOut" }}
              className="flex px-3 py-1 mt-3 font-medium text-center text-black bg-gray-100 md:px-5 md:py-2 hover:ring-green-700 rounded-3xl hover:bg-slate-50 hover:ring-1 "
            >
              <Link
                className="flex flex-row items-center w-full "
                to={`/MovieDetails/${id}`}
              >
                <BiSolidMoviePlay />
                Watch
              </Link>
            </motion.button>
          </div>
        </div>
      </Link>
    </div>
  );
}
