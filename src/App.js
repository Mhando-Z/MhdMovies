import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HugeCard from "./ProjectMovies/MoviesPages/HugeCard";
import HomePage from "./ProjectMovies/MoviesPages/HomePage";
import Footer from "./Components/Footer";
import Pagenotfound from "./ProjectMovies/MoviesPages/Pagenotfound";
import SearchResults from "./ProjectMovies/MoviesPages/SearchResults";

function App() {
  return (
    <div className="shadow-xl container">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/movie/:id" element={<HugeCard />} />
          <Route path="/searchResult" element={<SearchResults />} />
          <Route path="/Pagenotfound" element={<Pagenotfound />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
