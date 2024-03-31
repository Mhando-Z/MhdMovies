import React from "react";
import Search from "./Search";

function Navbar() {
  return (
    <div className="sticky top-0 p-10 bg-slate-800 shadow-xl ">
      <div className="">
        <Search />
      </div>
    </div>
  );
}

export default Navbar;
