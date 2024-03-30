import React from "react";

function Search() {
  return (
    <div className="sticky top-0 flex items-center justify-start bg-slate-800 shadow-xl. p-10">
      <div className="flex md:flex-row gap-y-3 flex-col items-center justify-center gap-x-5">
        <input
          type="text"
          className="outline-none md:w-auto w-full px-10 py-2 lg:text-2xl text-lg text-black font-semibold rounded-md bg-slate-300"
        />
        <button className="py-3 px-10 w-full bg-slate-700 text-slate-200 font-semibold text-xl">
          Search
        </button>
      </div>
    </div>
  );
}

export default Search;
