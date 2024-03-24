import { BrowserRouter, Route, Routes } from "react-router-dom";
import HugeCard from "./ProjectMovies/MoviesPages/HugeCard";
import HomePage from "./ProjectMovies/MoviesPages/HomePage";
import Footer from "./ProjectMovies/MoviesPages/Footer";
import Details from "./ProjectMovies/MoviesPages/Details";

function App() {
  return (
    <div className="shadow-xl">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<HugeCard />} />
          <Route path="/movies/:id" element={<Details />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
