import React from "react";

function Footer() {
  return (
    <div>
      <div className="mt-10 bg-slate-900 opacity-45 rounded-tl-3xl flex items-center justify-center">
        <div className="p-10 flex flex-row lg:gap-80 gap-32 justify-between">
          <div className="flex flex-col text-left ">
            <h1 className="text-slate-400 font-bold lg:text-4xl test-2xl">
              MhdMovies
            </h1>
          </div>
          <div className="flex flex-col justify-end ">
            <h1 className="text-slate-400 text-center italic font-bold text-xl">
              @Mhando Zuberi Mhando
            </h1>
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-slate-400  font-bold lg:text-4xl test-2xl">
              Contacts
            </h1>
            <h2 className="text-slate-400 lg:text-2xl test-xl ">
              Phone: 0786722646
            </h2>
            <h2 className="text-slate-400 lg:text-2xl test-xl">
              Email: Mhandosz17@gmail.com
            </h2>
            <h2 className="text-slate-400 text-2xl ">Country: Tanzania</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
