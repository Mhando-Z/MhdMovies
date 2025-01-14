import axios from "axios";
import { createContext, useEffect, useState } from "react";

// const APIKEYS = "zqgwxwT3Kcs1bjmeW1HRTJ_ppiGxOirO";

const TvMazeAPI = createContext();

export function MazeAPIProvider({ children }) {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState("");

  console.log(schedule);

  async function getSchedule() {
    try {
      const { data } = await axios.get(
        // ` https://api.tvmaze.com/lookup/shows?imdb=tt34730468`
        `https://api.tvmaze.com/lookup/shows?thetvdb=438596`
        // `https://api.tvmaze.com/schedule?country=${country}&date=${date}`
      );
      setSchedule(data);
    } catch (error) {}
  }

  useEffect(() => {
    getSchedule();
  }, [date]);

  return (
    <TvMazeAPI.Provider value={{ schedule, date, setDate }}>
      {children}
    </TvMazeAPI.Provider>
  );
}

export default TvMazeAPI;
