import React from "react";
import logo from "../../Assets/Logo/mhd.png";
import { motion } from "framer-motion";
// social medial icons
import { FaFacebook } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <motion.footer
      className="py-8 mt-10 text-gray-100 bg-black border-t bg-opacity-30 border-t-gray-600"
      initial={{ opacity: 1, y: 100 }}
      viewport={{ once: true }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container px-4 mx-auto">
        <div className="flex flex-col justify-between w-full md:flex-row gap-x-20">
          <div className="flex flex-col items-center justify-center flex-grow mb-6 md:justify-start md:items-start">
            <Link to={"/"}>
              <img src={logo} alt="Logo" className="mb-4 h-auto w-[200px]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 gap-x-20">
            <div className="w-full mb-6 ">
              <h4 className="mb-4 font-semibold">Navigations</h4>
              <div className="flex flex-col gap-y-1">
                <Link onClick={scrollToTop} to={"/"} className="mb-2">
                  Home
                </Link>
                <Link onClick={scrollToTop} to={"TvSeries/"} className="mb-2">
                  TvSeries
                </Link>
                <Link onClick={scrollToTop} className="mb-2">
                  Genres
                </Link>
              </div>
            </div>
            <div className="w-full mb-6 ">
              <h4 className="mb-4 font-semibold">MhdMovies</h4>
              <ul>
                <li className="mb-2">About</li>
                <li className="mb-2">Blog</li>
                <li className="mb-2">Partners</li>
              </ul>
            </div>
            <div className="w-full mb-6 ">
              <h4 className="mb-4 font-semibold">Contacts</h4>
              <ul>
                <li className="mb-2">Email</li>
                <li className="mb-2">phone-number</li>
                <li className="mb-2">Dar es Salaam Tanzania</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-700">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-gray-600">
              &copy; {currentYear} MHD movies, Inc. All rights reserved.
            </p>
            <div className="flex mt-4 text-xl sm:mt-0">
              <button className="mx-2 text-gray-600 hover:text-gray-900">
                <FaFacebook />
              </button>
              <button className="mx-2 text-gray-600 hover:text-gray-900">
                <RiInstagramFill />
              </button>
              <button className="mx-2 text-gray-600 hover:text-gray-900">
                <FaYoutube />
              </button>
              <button className="mx-2 text-gray-600 hover:text-gray-900">
                <FaSquareXTwitter />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
