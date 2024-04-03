import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import { KeyboardArrowUp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    opacity: 0,
    transition: "opacity 0.3s",
    zIndex: 1000,
  },
  fabVisible: {
    opacity: 1,
  },
}));

const ScrollToTopButton = () => {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fab
      className={`${classes.fab} ${isVisible ? classes.fabVisible : ""}`}
      onClick={scrollToTop}
    >
      <KeyboardArrowUp />
    </Fab>
  );
};

export default ScrollToTopButton;
