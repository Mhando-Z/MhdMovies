import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLocationSearching } from "react-icons/md";
import logo from "../../Assets/Logo/mhd.png";
import { HiMenu } from "react-icons/hi";
import MovieListContext from "../../Context/MovieListContext";

function NavBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { visible } = useContext(MovieListContext);

  //handle inputs
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  //handles when user press Enter while searching
  const handlePress = (e) => {
    if (query.length !== 0) {
      if (e.keyCode === 13) {
        navigate(`/Results/${query}`);
      }
    }
  };

  //handle search function
  const HandleSearch = () => {
    if (query.length !== 0) {
      navigate(`/Results/${query}`);
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex flex-col ${visible}`}>
      <div className={`flex flex-col px-2 mt-3`}>
        <div className="flex flex-row items-center justify-between gap-x-5 ">
          {/* logo */}
          <div className="flex grow">
            <img
              src={logo}
              alt="Mhd movies logo"
              className="h-auto w-[100px]"
            />
          </div>
          {/* navlinks */}
          <div className="flex-row items-center justify-between flex-grow hidden px-2 py-1 bg-black bg-opacity-25 md:flex ring-1 ring-gray-400 rounded-3xl">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "bg-red-500 py-1 text-gray-100 rounded-3xl px-5  "
                  : "px-5 text-gray-100 font-medium hover:bg-red-500 hover:text-gray-100 rounded-3xl"
              }
            >
              Home
            </NavLink>
            <NavLink
              to={"TvSeries/"}
              className={({ isActive }) =>
                isActive
                  ? "bg-red-500  py-1 text-gray-100 rounded-3xl px-5  "
                  : "px-5 text-gray-100 font-medium hover:bg-red-500 hover:text-gray-100 rounded-3xl"
              }
            >
              TvSeries
            </NavLink>
            <NavLink
              to={"Genres"}
              className={({ isActive }) =>
                isActive
                  ? "bg-red-500  py-1 text-gray-100 rounded-3xl px-5  "
                  : "px-5 text-gray-100 font-medium hover:bg-red-500 hover:text-gray-100 rounded-3xl"
              }
            >
              Genres
            </NavLink>
          </div>
          {/* search input */}
          <div className="relative items-end justify-end hidden md:flex grow ">
            <input
              type="text"
              onKeyDown={(e) => handlePress(e)}
              onChange={(e) => handleChange(e)}
              className="px-10 ring-1 ring-gray-300  w-[200px] py-2 outline-none text-gray-100  rounded-3xl focus:ring-2  bg-black bg-opacity-25 focus:text-gray-100"
              placeholder="Search movies"
            />
            <div
              onClick={HandleSearch}
              className="absolute right-0 flex items-center justify-center bg-red-700 rounded-full size-10"
            >
              <MdLocationSearching className="text-2xl text-center text-white" />
            </div>
          </div>
          {/* humberger icon for small devices */}
          <div className="flex text-5xl text-red-600 md:hidden">
            <HiMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
