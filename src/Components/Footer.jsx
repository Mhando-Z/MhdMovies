import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="dark:text-gray-200 bg-slate-950 bg-opacity-35 p-10">
      <div className="container mx-auto flex md:flex-row gap-y-5 flex-col justify-between">
        <div className="text-center md:text-left">
          <Link
            to={"/"}
            className="xl:text-2xl text-lg text-black bg-yellow-400 px-1 font-extrabold"
          >
            MHD
          </Link>
        </div>
        <div className="flex flex-row items-center justify-evenly">
          <FacebookIcon />
          <Link
            to={
              "https://www.instagram.com/tech_device360?igsh=N2ZveW53bXlkZG01&utm_source=qr"
            }
          >
            <InstagramIcon />
          </Link>
          <Link to={"https://wa.me/message/RQ4LDCEJOO2EK1"}>
            <WhatsAppIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
