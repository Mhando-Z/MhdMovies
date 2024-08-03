import React from "react";
import { NavLink } from "react-router-dom";
import { MdLocationSearching } from "react-icons/md";
import logo from "../../Assets/Logo/mhd.png";
import { HiMenu } from "react-icons/hi";

function NavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <div className="flex flex-col px-2 mt-3 ">
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
          <div className="flex-row items-center justify-between flex-grow hidden px-2 py-1 bg-gray-200 md:flex ring-1 ring-gray-400 bg-opacity-20 rounded-3xl">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "bg-red-500 py-1 text-gray-100 rounded-3xl px-5  "
                  : "px-5 text-gray-100 font-medium"
              }
            >
              Home
            </NavLink>
            <NavLink
              to={"Movies/"}
              className={({ isActive }) =>
                isActive
                  ? "bg-red-500  py-1 text-gray-100 rounded-3xl px-5  "
                  : "px-5 text-gray-100 font-medium"
              }
            >
              Movies
            </NavLink>
            <NavLink
              to={"TvSeries"}
              className={({ isActive }) =>
                isActive
                  ? "bg-red-500  py-1 text-gray-100 rounded-3xl px-5  "
                  : "px-5 text-gray-100 font-medium"
              }
            >
              TvSeries
            </NavLink>
            <NavLink
              to={"Genres"}
              className={({ isActive }) =>
                isActive
                  ? "bg-red-500  py-1 text-gray-100 rounded-3xl px-5  "
                  : "px-5 text-gray-100 font-medium"
              }
            >
              Genres
            </NavLink>
          </div>
          {/* search input */}
          <div className="relative items-end justify-end hidden md:flex grow ">
            <input
              type="text"
              className="px-10 ring-1 ring-gray-300  w-[200px] py-2 outline-none bg-gray-200 bg-opacity-25 rounded-3xl focus:ring-2 focus:ring-red-600 focus:bg-black focus:bg-opacity-25 focus:text-gray-100"
              placeholder="Search movies"
            />
            <div className="absolute right-0 flex items-center justify-center bg-red-700 rounded-full size-10">
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
