import React from "react";

function Footer() {
  const date = new Date();

  console.log(date.time);
  return (
    <div>
      <div className="mt-10 p-10  bg-slate-900 opacity-45 rounded-t-3xl flex items-start justify-between">
        <div className="flex flex-col text-left ">
          <h1 className="text-slate-400 font-bold lg:text-2xl text-lg">
            MhdMovies
          </h1>
          <h1 className="text-slate-400 hidden md:flex max-w-sm text-left italic font-bold text-xl">
            {date.toString()}
          </h1>
          <h1 className="text-slate-400 text-left italic font-bold text-lg">
            @Mhando Zuberi Mhando
          </h1>
        </div>
        <div className="flex flex-col text-left">
          <h1 className="text-slate-400  font-bold lg:text-2xl test-xl">
            Contacts
          </h1>
          <h2 className="text-slate-400 lg:text-xl test-lg ">
            Phone: 0786722646
          </h2>
          <h2 className="text-slate-400 lg:text-xl test-lg">
            Email: Mhandosz17@gmail.com
          </h2>
          <h2 className="text-slate-400 text-xl ">Country: Tanzania</h2>
        </div>
      </div>
    </div>
  );
}

export default Footer;
