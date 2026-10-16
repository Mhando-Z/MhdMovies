import React from "react";

import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";

function Rating({ value }) {
  return (
    <div className="flex flex-row items-center">
      {/* Pointy Stars */}
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 1 ? (
          <IoIosStar />
        ) : value >= 0.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 2 ? (
          <IoIosStar />
        ) : value >= 1.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 3 ? (
          <IoIosStar />
        ) : value >= 2.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 4 ? (
          <IoIosStar />
        ) : value >= 3.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 5 ? (
          <IoIosStar />
        ) : value >= 4.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 6 ? (
          <IoIosStar />
        ) : value >= 5.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 7 ? (
          <IoIosStar />
        ) : value >= 6.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 8 ? (
          <IoIosStar />
        ) : value >= 7.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 9 ? (
          <IoIosStar />
        ) : value >= 8.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-sm text-yellow-400 md:text-xl">
        {value >= 10 ? (
          <IoIosStar />
        ) : value >= 9.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
    </div>
  );
}

export default Rating;
