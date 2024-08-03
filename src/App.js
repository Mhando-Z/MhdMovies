import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MovieProvider } from "./Context/MovieListContext";
import { TvSeriesProvider } from "./Context/TvSeriesContext";
import { NavBar, Footer } from "./UpGrade/Components/Collection";

import MainPage from "./UpGrade/Pages/MainPage";
import TvSeriesPage from "./UpGrade/Pages/TvSeriesPage";

function App() {
  return (
    <div className="flex flex-col justify-between min-h-screen overflow-x-hidden overflow-y-scroll">
      <TvSeriesProvider>
        <MovieProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="TvSeries/" element={<TvSeriesPage />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </MovieProvider>
      </TvSeriesProvider>
    </div>
  );
}

export default App;
