import React, { useContext, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { Search } from "lucide-react";
import MovieListContext from "../../Context/MovieListContext";
import logo from "../../Assets/Logo/mhd.png";
import { motion, AnimatePresence } from "framer-motion";

function NavBar() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { visible } = useContext(MovieListContext);
  const navigate = useNavigate();

  const handleChange = (e) => setQuery(e.target.value);

  const handlePress = (e) => {
    if (query.length !== 0 && e.keyCode === 13) {
      navigate(`/Results/${query}`);
      setIsSearchOpen(false);
    }
  };

  const HandleSearch = () => {
    if (query.length !== 0) {
      navigate(`/Results/${query}`);
      setIsSearchOpen(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    // Use setTimeout to ensure the input is rendered before focusing
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleSearchBlur = () => {
    if (!query) {
      setIsSearchOpen(false);
    }
  };

  const handleClick = () => setView(!view);

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${visible}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }}>
            <img src={logo} alt="Mhd movies logo" className="w-auto h-9" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-1 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-red-500 text-white"
                    : "text-gray-300 hover:bg-red-500/10 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="TvSeries/"
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-red-500 text-white"
                    : "text-gray-300 hover:bg-red-500/10 hover:text-white"
                }`
              }
            >
              TV Series
            </NavLink>
            <NavLink
              to="Genres"
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-red-500 text-white"
                    : "text-gray-300 hover:bg-red-500/10 hover:text-white"
                }`
              }
            >
              Genres
            </NavLink>
          </div>

          {/* Desktop Search */}
          <div className="items-center hidden md:flex">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: "300px",
                    opacity: 1,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  exit={{
                    width: 0,
                    opacity: 0,
                    transition: { duration: 0.2, ease: "easeIn" },
                  }}
                  className="relative"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handlePress}
                    onBlur={handleSearchBlur}
                    className="w-full px-4 py-1.5 pl-10 text-white placeholder-gray-400 rounded-full bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Search movies..."
                  />
                  <Search
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    onClick={HandleSearch}
                  />
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearchClick}
                  className="p-2 rounded-full hover:bg-red-500/10"
                >
                  <Search className="w-5 h-5 text-gray-300" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full md:hidden hover:bg-red-500/10"
            onClick={handleClick}
          >
            {view ? (
              <HiX className="text-3xl text-red-500" />
            ) : (
              <HiMenu className="text-3xl text-red-500" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {view && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block px-4 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-red-500 text-white"
                        : "text-gray-300 hover:bg-red-500/10 hover:text-white"
                    }`
                  }
                  onClick={handleClick}
                >
                  Home
                </NavLink>
                <NavLink
                  to="TvSeries/"
                  className={({ isActive }) =>
                    `block px-4 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-red-500 text-white"
                        : "text-gray-300 hover:bg-red-500/10 hover:text-white"
                    }`
                  }
                  onClick={handleClick}
                >
                  TV Series
                </NavLink>
                <NavLink
                  to="Genres"
                  className={({ isActive }) =>
                    `block px-4 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-red-500 text-white"
                        : "text-gray-300 hover:bg-red-500/10 hover:text-white"
                    }`
                  }
                  onClick={handleClick}
                >
                  Genres
                </NavLink>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handlePress}
                    className="w-full px-4 py-1.5 pl-10 text-white placeholder-gray-400 rounded-full bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Search movies..."
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default NavBar;
