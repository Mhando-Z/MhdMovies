import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./Movie/Collection.jsx";
import Footer from "./Components/Footer";
import { MovieProvider } from "./Context/MovieListContext";
import NavBar from "./Components/NavBar.jsx";
import { TvSeriesProvider } from "./Context/TvSeriesContext";
import DetailsPreview from "./Pages/DetailsPreview.jsx";
import Watchtrailer from "./Pages/Watchtrailer.jsx";
import TvSeriesDetails from "./Pages/TvSeriesDetails.jsx";
import Watchtrailers from "./Pages/WatchSeriesTrailer.jsx";
import ResultsPage from "./Pages/ResultsPage.jsx";
import TvSeriesPage from "./TvSeries/TvSeriesPage.jsx";
import Genres from "./Pages/Genres.jsx";
import FloatingButton from "./Components/FloatingButton.jsx";

function App() {
  return (
    <div className="flex flex-col justify-between min-h-screen overflow-scroll">
      <TvSeriesProvider>
        <MovieProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="Details/:id" element={<DetailsPreview />}>
                <Route index element={<Watchtrailer />} />
              </Route>
              <Route path="/TvDetails/:id" element={<TvSeriesDetails />}>
                <Route path="/TvDetails/:id" element={<Watchtrailers />} />
              </Route>
              <Route path="Results/:id" element={<ResultsPage />} />
              <Route path="/TvSeries" element={<TvSeriesPage />} />
              <Route path="/Genres" element={<Genres />} />
            </Routes>
            <FloatingButton />
            <Footer />
          </BrowserRouter>
        </MovieProvider>
      </TvSeriesProvider>
    </div>
  );
}

export default App;
