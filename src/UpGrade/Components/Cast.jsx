import React from "react";
import { motion } from "framer-motion";

const CastProfile = ({ image, name, role }) => {
  return (
    <div className="flex flex-row-reverse">
      {/* Vertical text spine */}
      <motion.div
        className="flex items-center justify-center w-8 text-white h-80 bg-slate-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div
          className="text-sm tracking-wider"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {name}
        </div>
      </motion.div>

      {/* Main cover */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-lg w-72 h-80">
        {/* Background image */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w780/${image}`}
            alt={name}
            className="object-cover w-full h-full"
          />
        </motion.div>

        {/* Role label */}
        <motion.div
          className="absolute top-0 bottom-0 via-20% left-0 right-0 flex items-center justify-center py-1 text-sm font-bold text-center text-white rounded-md via-transparent bg-gradient-to-t from-black to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p className="absolute bottom-0 text-center font-Raleway">{role}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default CastProfile;
