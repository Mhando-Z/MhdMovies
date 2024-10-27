import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ClearHistoryScroll = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ClearHistoryScroll;
