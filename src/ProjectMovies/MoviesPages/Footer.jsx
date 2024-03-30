import React from "react";

function Footer() {
  const date = new Date();

  return (
    <div className="container md:flex-row md:items-start items-center flex-col mx-auto mt-10 p-10  bg-slate-900 opacity-45 rounded-t-3xl flex  justify-between">
      <div className="flex flex-col text-center md:text-left ">
        <h1 className="text-slate-400 font-bold text-lg">MhdMovies</h1>
        <h1 className="text-slate-400 hidden md:flex max-w-[200px] truncate text-left italic font-bold text-md">
          {date.toString()}
        </h1>
        <h1 className="text-slate-400 text-center sm:text-left italic font-bold text-md">
          @Mhando Zuberi
        </h1>
      </div>
      <div className="flex flex-col text-center md:text-left">
        <h1 className="text-slate-400 font-bold test-lg">Contacts</h1>
        <h2 className="text-slate-400 test-lg ">Phone: 0786722646</h2>
        <h2 className="text-slate-400 test-md">Email: Mhandosz17@gmail.com</h2>
        <h2 className="text-slate-400 text-lg ">Country: Tanzania</h2>
      </div>
    </div>
  );
}

export default Footer;
