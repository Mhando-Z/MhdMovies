import React, { useState, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";

function NavBar() {
  const [opens, setOpens] = useState(false);
  const [open, setOpen] = React.useState(false);
  const ref = useRef(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  //target value
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleReset = () => {
    ref.current.value = "";
  };

  const handleClick = () => {
    setOpens(!opens);
  };
  //Kyepress function
  const handlePress = (e) => {
    if (query.length !== 0) {
      if (e.keyCode === 13) {
        navigate(`/Results/${query}`);
        handleClick();
      }
    }
  };

  //handle search function
  const HandleSearch = () => {
    if (query.length !== 0) {
      navigate(`/Results/${query}`);
      handleReset();
    }
  };
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <div className="">
      <div className="container relative flex flex-col w-full mx-auto ">
        <div className="container flex flex-row items-center justify-between py-3 mx-auto">
          <div className="flex grow">
            <Link
              to={"/"}
              className="px-1 text-lg font-extrabold bg-yellow-400 font-roboto xl:text-2xl"
            >
              MHD
            </Link>
          </div>
          <div className="flex flex-row items-center justify-between flex-grow bg-white gap-x-10">
            <div className="flex-row items-center justify-between hidden gap-x-5 md:flex">
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  isActive
                    ? "underline underline-offset-8 decoration-gray-200"
                    : ""
                }
              >
                <h1 className="text-xl xl:text-2xl hover:underline-offset-8 hover:underline text-slate-200 hover:decoration-gray-200 ">
                  Home
                </h1>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "underline underline-offset-8 decoration-gray-200"
                    : ""
                }
                to={"/TvSeries"}
              >
                <h1 className="text-xl xl:text-2xl hover:underline-offset-8 hover:underline text-slate-200 hover:decoration-gray-200 ">
                  TvSeries
                </h1>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "underline underline-offset-8 decoration-gray-200"
                    : ""
                }
                to={"/Genres"}
              >
                <h1 className="text-xl xl:text-2xl hover:underline-offset-8 hover:underline text-slate-200 hover:decoration-gray-200">
                  Genre
                </h1>
              </NavLink>
              {/* <NavLink>
                <h1 className="text-xl xl:text-2xl hover:underline-offset-8 hover:underline text-slate-200 hover:text-blue-400 hover:decoration-gray-200 hover:font-semibold ">
                  Actors
                </h1>
              </NavLink> */}
            </div>
          </div>
          <div className="relative hidden grow md:flex">
            <input
              type="search"
              onChange={(e) => handleChange(e)}
              onKeyDown={(e) => handlePress(e)}
              ref={ref}
              placeholder="Type Here"
              className="p-1 text-xl text-center rounded-full outline-none ring-1 ring-slate-500 text-slate-200 bg-slate-800"
            />
            <button
              onClick={HandleSearch}
              className="absolute right-0 p-2 -translate-y-1/2 rounded-full top-1/2 lg:p-3 bg-slate-600"
            >
              <SearchIcon className="text-slate-200" />
            </button>
          </div>
          <div onClick={handleClick} className="flex md:hidden">
            <SearchIcon
              sx={{ fontSize: "2.1rem" }}
              className="text-slate-300"
            />
          </div>
          <div onClick={toggleDrawer(true)} className="flex md:hidden">
            <MenuIcon sx={{ fontSize: "2.4rem" }} className="text-slate-300" />
          </div>
        </div>
      </div>
      {/* Serach Dropdown on Mobile with search Icon */}
      <Collapse in={opens} timeout="auto" unmountOnExit>
        <div className="flex flex-row items-center justify-center w-full h-12 bg-black md:hidden">
          <input
            ref={ref}
            type="search"
            onKeyDown={(e) => handlePress(e)}
            onChange={(e) => handleChange(e)}
            placeholder="Type Here"
            className="w-full p-2 text-xl text-center outline-none ring-1 ring-slate-500 text-slate-200 bg-slate-800"
          />
          <Link className="hidden px-5 py-2 text-lg ring-2 ring-slate-700 bg-slate-700 text-slate-200">
            Search
          </Link>
        </div>
      </Collapse>
      {/* Drawer nav setcion section */}
      <div>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          <div
            onClick={toggleDrawer(false)}
            className="bg-slate-800 sm:w-[300px] w-[230px] h-screen flex flex-col gap-y-10 p-10"
          >
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "underline underline-offset-8 decoration-gray-200"
                  : ""
              }
            >
              <h1 className="text-xl xl:text-2xl hover:underline-offset-8 hover:underline text-slate-200 hover:text-blue-400 hover:decoration-gray-200 hover:font-semibold ">
                Home
              </h1>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "underline underline-offset-8 decoration-gray-200"
                  : ""
              }
              to={"/TvSeries"}
            >
              <h1 className="text-xl xl:text-2xl hover:underline-offset-8 hover:underline text-slate-200 hover:text-blue-400 hover:decoration-gray-200 hover:font-semibold ">
                TvSeries
              </h1>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "underline underline-offset-8 decoration-gray-200"
                  : ""
              }
              to={"/Genres"}
            >
              <h1 className="text-xl xl:text-2xl hover:underline-offset-8 hover:underline text-slate-200 hover:text-blue-400 hover:decoration-gray-200 hover:font-semibold ">
                Genre
              </h1>
            </NavLink>
            {/* <NavLink>
              <h1 className="text-xl xl:text-2xl hover:underline-offset-8 hover:underline text-slate-200 hover:text-blue-400 hover:decoration-gray-200 hover:font-semibold ">
                Actors
              </h1>
            </NavLink> */}
          </div>
        </Drawer>
      </div>
      <div>
        <Outlet onClick={handleClick} />
      </div>
    </div>
  );
}

export default NavBar;
