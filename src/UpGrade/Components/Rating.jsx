import React from "react";
// Rounded stars
// import { FaStar } from "react-icons/fa";
// import { FaStarHalfAlt } from "react-icons/fa";
// import { FaRegStar } from "react-icons/fa";
// pointy version 2
import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";

function Rating({ value }) {
  return (
    <div className="flex flex-row items-center">
      {/* Rounded stars */}
      {/* <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 1 ? (
          <FaStar />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 2 ? (
          <FaStar />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 3 ? (
          <FaStar />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 4 ? (
          <FaStar />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 5 ? (
          <FaStar />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 6 ? (
          <FaStar />
        ) : value >= 5.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 7 ? (
          <FaStar />
        ) : value >= 6.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 8 ? (
          <FaStar />
        ) : value >= 7.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 9 ? (
          <FaStar />
        ) : value >= 8.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 10 ? (
          <FaStar />
        ) : value >= 9.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </div> */}
      {/* Pointy Stars */}
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 1 ? (
          <IoIosStar />
        ) : value >= 0.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 2 ? (
          <IoIosStar />
        ) : value >= 1.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 3 ? (
          <IoIosStar />
        ) : value >= 2.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 4 ? (
          <IoIosStar />
        ) : value >= 3.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 5 ? (
          <IoIosStar />
        ) : value >= 4.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 6 ? (
          <IoIosStar />
        ) : value >= 5.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 7 ? (
          <IoIosStar />
        ) : value >= 6.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 8 ? (
          <IoIosStar />
        ) : value >= 7.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
        {value >= 9 ? (
          <IoIosStar />
        ) : value >= 8.5 ? (
          <IoIosStarHalf />
        ) : (
          <IoIosStarOutline />
        )}
      </div>
      <div className="text-yellow-400 md:text-xl lg:text-2xl">
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
