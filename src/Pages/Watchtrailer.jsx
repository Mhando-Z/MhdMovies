import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";

function Watchtrailer() {
  const { id } = useParams();
  const [Selected, setSelect] = useState();
  const [Videos, setVideo] = useState([]);

  const handleSelect = (key) => {
    setSelect(key);
  };

  //video request by id
  async function getVideo() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setVideo(data.results);
      setSelect(data.results[0].key);
    } catch (error) {}
  }
  useEffect(() => {
    getVideo();
  }, [id]);
  return (
    <div className="block">
      <div className="flex flex-col justify-between lg:flex-row gap-y-5 ">
        {/* Player section */}
        <div className="sticky top-0 flex-1 w-auto h-auto  lg:h-[500px]">
          <div className="hidden p-1 shadow-lg lg:flex bg-slate-700 rounded-xl">
            <ReactPlayer
              width={"100%"}
              height={"580px"}
              controls={true}
              url={`https://www.youtube.com/watch?v=${Selected}`}
            />
          </div>
          <div className="flex p-1 shadow-lg lg:hidden bg-slate-700 rounded-xl">
            <ReactPlayer
              width={"100%"}
              height={"400px"}
              controls={true}
              url={`https://www.youtube.com/watch?v=${Selected}`}
            />
          </div>
        </div>
        {/* List of video selection */}
        <div>
          {Videos?.map((data, index) => {
            return (
              <NavLink
                key={data.key + index}
                onClick={() => handleSelect(data.key)}
              >
                <div className="flex flex-col p-3 mb-5 rounded-lg shadow-xl bg-slate-950">
                  <div className="flex flex-row items-center gap-x-5">
                    <h1 className="text-xl text-slate-200">Video-Type</h1>
                    <h1 className="text-lg text-yellow-500">{data.type}</h1>
                  </div>
                  <div className="flex flex-row items-center gap-x-5">
                    <h1 className="text-xl text-slate-200">Site</h1>
                    <h2 className="text-lg text-yellow-500">{data.site}</h2>
                  </div>
                  <div className="flex flex-row items-center gap-x-5">
                    <h1 className="text-sm text-slate-200">Date</h1>
                    <h1 className="text-sm text-blue-400">
                      {data.published_at}
                    </h1>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Watchtrailer;
