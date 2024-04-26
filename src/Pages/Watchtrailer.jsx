import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";

function Watchtrailer() {
  const { id } = useParams();
  const [Videos, setVideo] = useState([]);
  const [Selected, setSelect] = useState();
  const [isActive1, setActive] = useState(false);

  const handleSelect = (key) => {
    setActive(!isActive1);
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
      <div className="flex flex-col lg:flex-row justify-between gap-y-5 ">
        {/* Player section */}
        <div className="sticky top-0 flex-1 w-auto h-auto  lg:h-[500px]">
          <div className="hidden lg:flex  bg-slate-700 p-1 rounded-xl shadow-lg">
            <ReactPlayer
              width={"100%"}
              height={"580px"}
              controls={true}
              url={`https://www.youtube.com/watch?v=${Selected}`}
            />
          </div>
          <div className=" lg:hidden flex  bg-slate-700 p-1 rounded-xl shadow-lg">
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
          {Videos?.map((data) => {
            return (
              <NavLink key={data.key} onClick={() => handleSelect(data.key)}>
                <div className="flex flex-col mb-5 bg-slate-950 shadow-xl p-3 rounded-lg">
                  <div className="flex items-center flex-row gap-x-5">
                    <h1 className="text-xl text-slate-200">Video-Type</h1>
                    <h1 className="text-lg text-yellow-500">{data.type}</h1>
                  </div>
                  <div className="flex items-center flex-row gap-x-5">
                    <h1 className="text-xl text-slate-200">Site</h1>
                    <h2 className="text-lg text-yellow-500">{data.site}</h2>
                  </div>
                  <div className="flex items-center flex-row gap-x-5">
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
