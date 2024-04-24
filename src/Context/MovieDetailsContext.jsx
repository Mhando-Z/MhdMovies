import { createContext } from "react";

const MovieDetailsContext = createContext();
export function MovieDetailsProvider({ children }) {
  return (
    <MovieDetailsContext.Provider value={{ mhando: "mhando" }}>
      {children}
    </MovieDetailsContext.Provider>
  );
}

export default MovieDetailsContext;
