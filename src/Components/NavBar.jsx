import React, { useState, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";

function NavBar() {
  const [opens, setOpens] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const navigate = useNavigate();

  //handle reset input function
  const handleReset = () => {
    ref.current.value = "";
  };

  const handleClick = () => {
    setOpens(!opens);
  };
  //Kyepress function
  const handlePress = (e) => {
    console.log(e);
    if (e.keyCode === 13) {
      navigate(`Results/${query}`);
      ref.current.value = "";
      handleClick();
      console.log("clicked Enter");
    }
  };

  //handle search function
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <div className="block justify-center ">
      <div className="relative">
        <div className="flex flex-row container lg:px-10 px-2 items-center  bg-opacity-0 justify-between py-4">
          <div className="flex flex-row items-center justify-between gap-x-10">
            <Link
              to={"/"}
              className="xl:text-2xl text-lg bg-yellow-400 px-1 font-extrabold"
            >
              MHD
            </Link>
            <div className="flex-row items-center justify-between gap-x-5 md:flex hidden">
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
          </div>
          <div className="relative hidden md:flex">
            <input
              type="search"
              ref={ref}
              onChange={(e) => handleChange(e)}
              onKeyDown={(e) => handlePress(e)}
              placeholder="Type Here"
              className="w-full ring-1 outline-none ring-slate-500 p-1 rounded-full text-xl text-slate-200 text-center bg-slate-800"
            />
            <Link
              onClick={handleReset}
              to={`Results/${query}`}
              className="absolute right-0 top-1/2 -translate-y-1/2 lg:p-3 p-2 bg-slate-600 rounded-full"
            >
              <SearchIcon className="text-slate-200" />
            </Link>
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
        <div className="bg-black h-12 w-full md:hidden flex flex-row items-center justify-center">
          <input
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => handlePress(e)}
            ref={ref}
            type="search"
            placeholder="Type Here"
            className="w-full ring-1 ring-slate-500 p-2 outline-none text-xl text-slate-200 text-center bg-slate-800"
          />
          <Link className="py-2 hidden ring-2 ring-slate-700 px-5 bg-slate-700 text-lg text-slate-200">
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
