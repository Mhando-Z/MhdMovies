import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MovieProvider } from "./Context/MovieListContext";
import { TvSeriesProvider } from "./Context/TvSeriesContext";
import { NavBar, Footer } from "./UpGrade/Components/Collection";
import logo from "./Assets/Logo/mhd.png";
import MainPage from "./UpGrade/Pages/MainPage";
import TvSeriesPage from "./UpGrade/Pages/TvSeriesPage";
import { useEffect, useState } from "react";
import SearchResults from "./UpGrade/Pages/SearchResults";
import ScrollToTopButton from "./UpGrade/Components/FloatingButton";
import MovieDetails from "./UpGrade/Pages/MovieDetails";
import TvSeriesDetails from "./UpGrade/Pages/TvSeriesDetails";
import Genres from "./UpGrade/Pages/Genres";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000); // Show intro for 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);
  //
  if (showIntro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src={logo}
          alt="MhdLogo"
          className="object-cover md:w-[300px] w-[200px] animate-pulse duration-1000 transition-all"
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-between min-h-screen overflow-x-hidden overflow-y-scroll">
      <TvSeriesProvider>
        <MovieProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="TvSeries/" element={<TvSeriesPage />} />
              <Route path="/Results/:id" element={<SearchResults />} />
              <Route path="Genres/" element={<Genres />} />
              <Route path="/MovieDetails/:id" element={<MovieDetails />} />
              <Route
                path="/TvSeriesDetails/:id"
                element={<TvSeriesDetails />}
              />
            </Routes>
            <Footer />
            <ScrollToTopButton />
          </BrowserRouter>
        </MovieProvider>
      </TvSeriesProvider>
    </div>
  );
}

export default App;
