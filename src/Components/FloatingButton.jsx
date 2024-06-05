import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as Scroll } from "react-router-dom";
import { Container, Button, Link } from "react-floating-action-button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdArrowUpward } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(1),
    opacity: 0,
    transition: "opacity 0.3s",
    zIndex: 1000,
  },
  fabVisible: {
    opacity: 1,
  },
}));

function FloatingButton() {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsVisible(scrollTop > 300); // Change the threshold as per your requirement
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // scrool top logic
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // search function

  return (
    <div>
      <Container
        className={`${classes.fab} ${isVisible ? classes.fabVisible : ""}`}
      >
        {/* Rounded small buttons */}

        <Link
          styles={{
            backgroundColor: "#e0e0e0",
            color: "white",
          }}
          tooltip="Search Movie"
        >
          <Scroll>
            <IoSearchOutline className="text-4xl text-purple-900" />
          </Scroll>
        </Link>
        <Link
          styles={{
            backgroundColor: "#e0e0e0",
            color: "white",
          }}
          tooltip="GO UP"
        >
          <Scroll onClick={scrollToTop}>
            <MdArrowUpward className="text-4xl text-purple-900 font-bold " />
          </Scroll>
        </Link>
        {/* Rounded Bog Buttond */}
        <Button
          tooltip="Navigation!"
          icon={<IoMdAddCircleOutline />}
          rotate={true}
          styles={{
            backgroundColor: "#e0e0e0",
            color: "white",
          }}
        >
          <IoMdAddCircleOutline className="text-6xl scale-125 text-slate-800 text-center" />
        </Button>
      </Container>
    </div>
  );
}

export default FloatingButton;
