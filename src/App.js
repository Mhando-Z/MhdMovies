import { BrowserRouter, Route, Routes } from "react-router-dom";
import HugeCard from "./ProjectMovies/MoviesPages/HugeCard";
import HomePage from "./ProjectMovies/MoviesPages/HomePage";
import Footer from "./ProjectMovies/MoviesPages/Footer";
import "./App.css";
import Huge from "./ProjectMovies/MoviesPages/Huge";

function App() {
  return (
    <div className="shadow-xl container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<HugeCard />} />
          <Route path="/Movie/:id" element={<Huge />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
