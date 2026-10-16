"use client";

import React from "react";

function Navbar() {
  return (
    <div className=" fixed top-0 w-full z-40 text-white p-4">
      <div className="xl:container xl:mx-auto px-5">
        {/* logo section */}
        <img
          src="https://inpdtdlijpglmifrebbg.supabase.co/storage/v1/object/public/images/logos/mhd.png"
          alt="logo"
          className="h-10 w-auto"
        />
      </div>
    </div>
  );
}

export default Navbar;
