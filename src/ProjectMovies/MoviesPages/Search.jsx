import React, { useState } from "react";
//import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

// Remember to import words or whatever you're using to store all the words the user can search for

const Search = ({ dataz }) => {
  const [activeSearch, setActiveSearch] = useState([]);

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setActiveSearch([]);
      return false;
    }
    setActiveSearch(function search() {
      const search_params = Object.keys(Object.assign({}, ...dataz));
      return dataz.filter((data) => {
        return search_params.some((param) => {
          const paramValue = data[param];
          if (paramValue !== undefined && paramValue !== null) {
            const stringValue = paramValue.toString().toLowerCase();
            return stringValue.includes(e.target.value.toLowerCase());
          }
          return false;
        });
      });
    });
  };
  return (
    <form className="lg:w-[500px] w-full top-2 fixed lg:top-9 lg:left-9 xl:top-10 xl:left-10">
      <div className="relative">
        <input
          type="search"
          placeholder="Type Here"
          className="w-full p-2 lg:p-3 rounded-full text-xl text-slate-200 text-center bg-slate-800"
          onChange={(e) => handleSearch(e)}
        />
        {/* <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-slate-600 rounded-full">
          <SearchIcon />
        </button> */}
      </div>
      {activeSearch.length === 0 ? (
        ""
      ) : (
        <div className="absolute top-20 p-4 bg-slate-800 text-white w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
          {activeSearch.map((s) => (
            <Link to={`/movie/${s.id}`}>
              <span>{s.title}</span>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
};

export default Search;
