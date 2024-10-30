// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { IoPersonCircleOutline } from "react-icons/io5";
// import { Link, NavLink, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FaRegCirclePlay } from "react-icons/fa6";
// import ReactPlayer from "react-player";
// import Rating from "../Components/Rating";
// import { Dots } from "react-activity";

// function TvSeriesDetails() {
//   const [Details, setDetails] = useState([]);
//   const [Reviews, setReview] = useState([]);
//   const [Similar, setSimilar] = useState([]);
//   const [Page, setPage] = useState(1);
//   const [ID, setIds] = useState([]);
//   const { id } = useParams();
//   const [Cast, setCast] = useState();
//   const [Images, setImage] = useState([]);
//   const [Videos, setVideo] = useState([]);
//   const [Selected, setSelect] = useState();
//   const [count, setCount] = useState(14);
//   const [Trailer, setTrailer] = useState(false);

//   //Logics
//   async function getDetails() {
//     try {
//       const { data } = await axios.get(
//         `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
//         {
//           headers: {
//             accept: "application/json",
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
//           },
//         }
//       );
//       setDetails(data);
//     } catch (error) {}
//   }
//   async function getIds() {
//     try {
//       const { data } = await axios.get(
//         `https://api.themoviedb.org/3/tv/${id}/external_ids`,
//         {
//           headers: {
//             accept: "application/json",
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
//           },
//         }
//       );
//       setIds(data);
//     } catch (error) {}
//   }
//   async function getReview() {
//     try {
//       const { data } = await axios.get(
//         `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US`,
//         {
//           headers: {
//             accept: "application/json",
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
//           },
//         }
//       );
//       setReview(data.results);
//     } catch (error) {}
//   }
//   async function getSimilar() {
//     try {
//       const { data } = await axios.get(
//         `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=${Page}`,
//         {
//           headers: {
//             accept: "application/json",
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
//           },
//         }
//       );
//       setSimilar(data.results);
//     } catch (error) {}
//   }
//   async function getVideo() {
//     try {
//       const { data } = await axios.get(
//         `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
//         {
//           headers: {
//             accept: "application/json",
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
//           },
//         }
//       );
//       setVideo(data.results);
//       setSelect(data.results[0].key);
//     } catch (error) {}
//   }
//   async function getImages() {
//     try {
//       const { data } = await axios.get(
//         `https://api.themoviedb.org/3/tv/${id}/images`,
//         {
//           headers: {
//             accept: "application/json",
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
//           },
//         }
//       );

//       setImage(data.backdrops);
//     } catch (error) {}
//   }
//   async function getCasts() {
//     try {
//       const { data } = await axios.get(
//         `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`,
//         {
//           headers: {
//             accept: "application/json",
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
//           },
//         }
//       );
//       setCast(data.cast);
//     } catch (error) {}
//   }
//   useEffect(() => {
//     getCasts();
//     getVideo();
//     getImages();
//     getIds();
//     getReview();
//     getDetails();
//     getSimilar();
//   }, [Page, id]);

//   // buttons logics
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };
//   const handleTrailer = () => {
//     scrollToTop();
//     setTrailer(!Trailer);
//   };
//   const handleSelect = (key) => {
//     setSelect(key);
//   };

//   const handleIncrese = () => {
//     if (count !== 20) {
//       setCount(count + 6);
//     }
//   };
//   //handle Decrease
//   const handleDecrease = () => {
//     if (count === 20 && count >= 14) {
//       setCount(count - 6);
//     }
//   };
//   //Handle Pages Logic
//   const handlePages = () => {
//     if (Page >= 1) {
//       setPage(Page + 1);
//     }
//   };
//   const handlePage = () => {
//     if (Page >= 1) {
//       setPage(Page - 1);
//     }
//   };

//   if (!Details || Details?.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div>
//           <Dots color="gray" size={25} speed={1} animating={true} />
//         </div>
//       </div>
//     );
//   }

//   // trim the unwanted
//   const Similars = Similar?.filter((dt) => dt.poster_path !== null);
//   const Seasons = Details?.seasons?.filter((dt) => dt.poster_path !== null);
//   const Casts = Cast?.filter((dt) => dt.profile_path !== null);

//   return (
//     <div className="flex flex-col min-h-screen font-roboto">
//       <div className="flex flex-col">
//         {/* backdrop poster */}
//         <div className="relative flex flex-col">
//           <Link to={"/"}>
//             <img
//               src={`https://image.tmdb.org/t/p/w1280/${Details?.backdrop_path}`}
//               alt={Details?.title}
//               className="object-cover object-top w-screen xl:h-[550px] h-[500px]"
//             />
//           </Link>
//           <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col bg-gradient-to-t from-black via-transparent to-transparent"></div>
//           {/* Trallers section be here*/}
//           {Trailer ? (
//             <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col min-h-screen">
//               <div className="flex-1 w-auto h-auto">
//                 <div className="hidden shadow-lg lg:flex">
//                   <ReactPlayer
//                     width={"100%"}
//                     height={"580px"}
//                     controls={true}
//                     url={`https://www.youtube.com/watch?v=${Selected}`}
//                   />
//                 </div>
//                 <div className="flex flex-col shadow-lg lg:hidden">
//                   <ReactPlayer
//                     width={"100%"}
//                     height={"400px"}
//                     controls={true}
//                     url={`https://www.youtube.com/watch?v=${Selected}`}
//                   />
//                   <div className="flex flex-col mt-10 ">
//                     {/* Play movie button */}
//                     {Trailer ? (
//                       <div className="flex flex-col px-3 md:hidden">
//                         <Link
//                           to={`https://vidsrc.xyz/embed/tv?imdb=${ID.imdb_id}`}
//                           className="flex flex-row items-center px-2 py-2 bg-red-600"
//                         >
//                           <FaRegCirclePlay className="text-3xl text-gray-100 transition-all duration-700 animate-pulse" />{" "}
//                           <p className="ml-2 text-lg text-gray-100">
//                             WatchSeries
//                           </p>
//                         </Link>
//                       </div>
//                     ) : (
//                       ""
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             ""
//           )}
//           <div className="absolute bottom-[-100px] md:flex hidden left-0 right-0  flex-col top-80 bg-gradient-to-t from-black via-transparent to-transparent"></div>
//         </div>
//         <div className="flex flex-col-reverse gap-3 md:flex-row xl:container xl:mx-auto">
//           {/* frontal image */}
//           <div className="md:h-[260px] h-[200px] hidden  z-40 justify-center md:flex rounded-lg mt-[-100px] ml-5">
//             <img
//               src={`https://image.tmdb.org/t/p/w500/${Details?.poster_path}`}
//               alt={Details?.name}
//               className="object-cover h-full rounded "
//             />
//           </div>
//           {/* title and prompt actions */}
//           <div className="relative z-40 flex flex-col flex-grow px-2">
//             {/* movie title */}
//             <h1 className="max-w-lg mb-2 text-3xl font-bold text-gray-100 md:max-w-2xl md:text-5xl">
//               {Details?.name}{" "}
//             </h1>
//             {/* Tagline */}
//             <h2 className="mb-2 text-base font-medium text-gray-100 xl:text-lg ">
//               TagLine:
//               <span className="max-w-2xl ml-1 font-romance text-cyan-400">
//                 {Details?.tagline}
//               </span>
//             </h2>
//             {/* movie genres */}
//             <div className="flex flex-wrap items-center mb-2 md:flex-row gap-x-5">
//               <h1 className="text-base font-medium text-gray-100 xl:text-lg">
//                 Genres:
//               </h1>
//               {Details?.genres?.map((data, index) => {
//                 return (
//                   <div key={index + data.id} className="">
//                     <h1 className="text-base font-semibold text-yellow-500 xl:text-lg">
//                       {data.name}
//                     </h1>
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="flex flex-row items-center gap-x-3">
//               <div>
//                 <h3 className="text-base text-gray-100 xl:text-lg">
//                   {Details?.vote_average}
//                 </h3>
//               </div>
//               <Rating value={Details?.vote_average} />
//             </div>
//             <div className="flex flex-row items-center mt-2 font-mono text-base text-gray-100 xl:text-lg">
//               <h1>{Math.trunc(Details?.runtime / 60)}h:</h1>
//               <h1>{Details?.runtime % 60}min</h1>
//             </div>
//             {/* status and releasedate ingo */}
//             <div className="flex flex-row items-center gap-x-5">
//               <div className="flex flex-row items-center space-x-2">
//                 <h2 className="text-base lg:text-lg text-slate-200">Status:</h2>
//                 <h2 className="text-base text-yellow-500 xl:text-lg">
//                   {Details?.status}
//                 </h2>
//               </div>
//               <div className="flex flex-row items-center space-x-2">
//                 <h2 className="text-base lg:text-lg text-slate-200">Date:</h2>
//                 <h2 className="text-base text-yellow-500 xl:text-lg">
//                   {Details?.first_air_date}
//                 </h2>
//               </div>
//             </div>
//             {/* budget details */}
//             <div className="flex flex-row justify-between bg-slate-800 bg-opacity-10 md:justify-normal gap-x-5">
//               <h1 className="flex flex-row items-center text-base xl:text-lg text-slate-200">
//                 Budget: {Details?.budget?.toLocaleString()}
//               </h1>
//               <h1 className="flex flex-row items-center text-base xl:text-lg text-slate-200">
//                 Revenue: {Details?.revenue?.toLocaleString()}
//               </h1>
//             </div>
//             {/* movie description */}
//             <p className="mt-2 mb-1 text-base font-medium text-cyan-400 xl:text-lg">
//               Overview
//             </p>
//             <p className="max-w-lg text-gray-100 xl:max-w-xl">
//               {Details?.overview}
//             </p>
//             {/* Details on number of episodes and seasons */}
//             <div className="mt-5">
//               <div className="flex flex-row space-x-2">
//                 <h2 className="text-base xl:text-lg text-slate-200">
//                   Number of Episodes:
//                 </h2>
//                 <h2 className="text-base xl:text-lg text-slate-200">
//                   {Details?.number_of_episodes}
//                 </h2>
//               </div>
//               <div className="flex flex-row space-x-2 ">
//                 <h2 className="text-base xl:text-lg text-slate-200">
//                   Number Of Seasons:
//                 </h2>
//                 <h2 className="text-base xl:text-lg text-slate-200">
//                   {Details?.number_of_seasons}
//                 </h2>
//               </div>
//               {Details.next_episode_to_air !== null ? (
//                 <div className="flex flex-row space-x-2 ">
//                   <h2 className="text-sm md:text-base xl:text-lg text-slate-200">
//                     Next Episode Release:
//                   </h2>
//                   <h2 className="text-sm md:text-base xl:text-lg text-slate-200">
//                     {Details?.next_episode_to_air.air_date}
//                   </h2>
//                 </div>
//               ) : (
//                 ""
//               )}
//             </div>
//             {/* Play movie button */}
//             {Trailer ? (
//               <div className="absolute right-0 flex-col hidden size-20 md:flex ">
//                 <Link to={`https://vidsrc.xyz/embed/tvf?imdb=${ID.imdb_id}`}>
//                   <FaRegCirclePlay className="text-5xl text-gray-100 transition-all duration-700 animate-pulse" />
//                 </Link>
//               </div>
//             ) : (
//               ""
//             )}
//           </div>
//           {/* Action Buttons and video link selection */}
//           {Trailer ? (
//             <div className="h-[400px] overflow-y-auto z-40 bg-black">
//               {Videos?.map((data, index) => {
//                 return (
//                   <NavLink
//                     key={data.key + index}
//                     onClick={() => handleSelect(data.key)}
//                   >
//                     <div
//                       className={`flex flex-col p-3 mb-5 focus:ring-2 focus:bg-white overflow-y-auto rounded-lg bg-slate-950 shadow-xl`}
//                     >
//                       <div className="flex flex-row items-center gap-x-5">
//                         <h1 className="text-lg text-slate-200">Video-Type</h1>
//                         <h1 className="text-lg text-yellow-500">{data.type}</h1>
//                       </div>
//                       <div className="flex flex-row items-center gap-x-5">
//                         <h1 className="text-lg text-slate-200">Site</h1>
//                         <h2 className="text-lg text-yellow-500">{data.site}</h2>
//                       </div>
//                       <div className="flex flex-row items-center gap-x-5">
//                         <h1 className="text-sm text-slate-200">Date</h1>
//                         <h1 className="text-sm text-blue-400">
//                           {data.published_at}
//                         </h1>
//                       </div>
//                     </div>
//                   </NavLink>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="z-40 flex flex-col items-end px-4 mt-2 gap-y-4">
//               {/* selections */}
//               <Link
//                 to={`https://vidsrc.xyz/embed/tv?imdb=${ID.imdb_id}`}
//                 className="flex flex-row items-center px-4 py-2 text-gray-100 bg-red-600 bg-opacity-65 gap-x-2"
//               >
//                 <FaRegCirclePlay />
//                 Watch
//               </Link>
//               <button
//                 onClick={handleTrailer}
//                 className="flex flex-row items-center px-4 py-2 text-gray-100 bg-green-600 bg-opacity-65 gap-x-1"
//               >
//                 <FaRegCirclePlay />
//                 Trailler
//               </button>
//             </div>
//           )}
//         </div>
//         <div className="container flex flex-col mx-auto mt-4 border-b-2 border-b-gray-700"></div>
//         {/* Seasons list */}
//         {/* Number of seasons print */}
//         <div
//           className={`grid xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2  ${
//             Details?.seasons?.length <= 1 ? "justify-start" : "justify-center"
//           } md:justify-start gap-5 lg:px-10  mt-4 h-[320px] overflow-auto `}
//         >
//           {Seasons?.map((data, index) => {
//             return (
//               <div key={data.id + index} className="">
//                 <img
//                   src={`https://image.tmdb.org/t/p/w780/${data?.poster_path}`}
//                   alt={Details?.title}
//                   className="object- object-top w-screen h-[300px]"
//                 />
//                 {/* Season and number of episodes */}
//                 <div className="flex flex-row items-center justify-between w-full mt-1 ">
//                   <h1 className="text-xs md:text-sm text-slate-200 ">
//                     {data.name}
//                   </h1>
//                   <h1 className="text-xs md:text-sm text-slate-200 ">
//                     Ep: {data.episode_count}
//                   </h1>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         {/* Related TvSeries images */}
//         <div className="grid grid-flow-col mt-2 overflow-x-auto overflow-y-hidden">
//           {Images?.map((dt, index) => {
//             return (
//               <div key={dt.file_path + index} className="w-[500px]">
//                 <img
//                   src={`https://image.tmdb.org/t/p/w780/${dt?.file_path}`}
//                   alt={dt?.title}
//                   className="object-cover w-screen h-[400px]"
//                 />
//               </div>
//             );
//           })}
//         </div>
//         <div className="container flex flex-col mx-auto mt-3 border-b-2 border-b-gray-700"></div>
//         {/* Casts of movie */}
//         <h1 className="px-2 mt-2 mb-4 text-xl font-semibold text-gray-100 border-l-4 border-l-red-700 font-fantasy">
//           Cast
//         </h1>
//         <div className="grid grid-flow-col overflow-x-auto overflow-y-hidden">
//           {Casts?.map((dt, index) => {
//             return (
//               <div key={dt.file_path + index} className="w-[220px]">
//                 <img
//                   src={`https://image.tmdb.org/t/p/w780/${dt?.profile_path}`}
//                   alt={dt?.name}
//                   className=" w-screen h-[300px]"
//                 />
//                 <h2 className="px-1 text-xs text-gray-100 md:text-sm">
//                   {dt?.name}
//                 </h2>
//                 <h2 className="px-1 text-xs text-gray-100 md:text-sm">
//                   {dt?.character}
//                 </h2>
//               </div>
//             );
//           })}
//         </div>
//         {/* Other movies which are similar */}
//         <div className="container flex flex-col mx-auto mt-5 md:mt-20">
//           {Similars.length !== 0 ? (
//             <h1 className="mb-2 text-xl font-medium text-gray-100 md:mb-10 md:text-2xl font-roboto">
//               Series you might like
//             </h1>
//           ) : (
//             ""
//           )}
//           <div className="grid grid-cols-3 gap-2 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
//             {Similars?.slice(0, count).map((data, index) => {
//               return (
//                 <div key={data.id}>
//                   <TvSeriesPoster
//                     name={data?.name}
//                     image={data?.poster_path}
//                     id={data.id}
//                     rating={data?.vote_average}
//                   />
//                 </div>
//               );
//             })}
//           </div>
//           {Similar?.length !== 0 ? (
//             <div className="flex flex-col items-end justify-end w-full mt-10">
//               <div className="flex flex-row items-center space-x-5">
//                 <motion.button
//                   whileInView={{ opacity: 1, y: 0 }}
//                   whileTap={{ scale: 0.8 }}
//                   transition={{ type: "spring", ease: "easeOut" }}
//                   onClick={handleDecrease}
//                   className={`text-slate-200 text-base xl:text-lg font-semibold cursor-pointer ${
//                     count === 20 ? "flex" : "hidden"
//                   }`}
//                 >
//                   Less..
//                 </motion.button>
//                 <motion.button
//                   whileInView={{ opacity: 1, y: 0 }}
//                   whileTap={{ scale: 0.8 }}
//                   transition={{ type: "spring", ease: "easeOut" }}
//                   onClick={handleIncrese}
//                   className={`text-slate-200 bg-red-600 px-3 text-base xl:text-lg font-semibold cursor-pointer ${
//                     count === 20 ? "hidden" : "flex"
//                   }`}
//                 >
//                   More..
//                 </motion.button>
//                 <motion.button
//                   whileInView={{ opacity: 1, y: 0 }}
//                   whileTap={{ scale: 0.8 }}
//                   transition={{ type: "spring", ease: "easeOut" }}
//                   onClick={handlePage}
//                   className="px-3 text-base font-semibold bg-red-600 cursor-pointer xl:text-lg text-slate-200"
//                 >
//                   Prev
//                 </motion.button>
//                 <motion.button
//                   whileInView={{ opacity: 1, y: 0 }}
//                   whileTap={{ scale: 0.8 }}
//                   transition={{ type: "spring", ease: "easeOut" }}
//                   onClick={handlePages}
//                   className="px-3 text-base font-semibold bg-red-600 cursor-pointer xl:text-lg text-slate-200"
//                 >
//                   Next
//                 </motion.button>
//               </div>
//             </div>
//           ) : (
//             ""
//           )}
//         </div>

//         {/* Reviews */}
//         <div className="flex flex-col px-2 md:container md:mx-auto">
//           {Reviews?.length === 0 ? (
//             ""
//           ) : (
//             <div className="mt-5 h-[400px] overflow-auto bg-slate-900 bg-opacity-50">
//               <div className="sticky top-0 flex border-b-2 bg-gray-950 border-slate-700">
//                 <h1 className="mt-5 mb-5 text-xl font-semibold text-yellow-500 md:text-2xl ">
//                   Reviews
//                 </h1>
//               </div>
//               {Reviews?.map((data, index) => {
//                 return (
//                   <div key={index + data.author} className="flex flex-col mt-5">
//                     <h1 className="flex flex-row items-center w-full text-xl font-semibold gap-x-3 md:text-2xl text-slate-200">
//                       <IoPersonCircleOutline className="text-3xl" />
//                       {data.author}
//                     </h1>
//                     <p className="mb-6 text-xs tracking-tighter text-justify md:text-sm text-slate-200">
//                       {data.content}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TvSeriesDetails;

import axios from "axios";
import Rating from "../Components/Rating";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaRegCirclePlay } from "react-icons/fa6";
import TvSeriesPoster from "./../Components/TvSeriesPoster";
import ReactPlayer from "react-player";
import { Dots } from "react-activity";
// import { Slider } from "../Components/slider";
import CastProfile from "../Components/Cast";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MinusCircle,
  PlusCircle,
  Sparkles,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";

function MovieDetails() {
  const [Details, setDetails] = useState([]);
  const [Reviews, setReview] = useState([]);
  const [Similar, setSimilar] = useState([]);
  const [Page, setPage] = useState(1);
  const [ID, setIds] = useState([]);
  const { id } = useParams();
  const [Cast, setCast] = useState();
  const [Images, setImage] = useState([]);
  const [Videos, setVideo] = useState([]);
  const [Selected, setSelect] = useState();
  const [count, setCount] = useState(14);
  const [Trailer, setTrailer] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [num, setNum] = useState(4);

  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  //Logics
  async function getDetails() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setDetails(data);
    } catch (error) {}
  }
  async function getIds() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/external_ids`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setIds(data);
    } catch (error) {}
  }
  async function getReview() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setReview(data.results);
    } catch (error) {}
  }
  async function getSimilar() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=${Page}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setSimilar(data.results);
    } catch (error) {}
  }
  async function getVideo() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
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
  async function getImages() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/images`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );

      setImage(data.backdrops);
    } catch (error) {}
  }
  async function getCasts() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setCast(data.cast);
    } catch (error) {}
  }
  useEffect(() => {
    getCasts();
    getVideo();
    getImages();
    getIds();
    getReview();
    getDetails();
    getSimilar();
  }, [Page, id]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleTrailer = () => {
    scrollToTop();
    setTrailer(!Trailer);
  };

  const handleSelect = (key) => {
    setSelect(key);
  };

  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    }
  };

  const handleDecrease = () => {
    if (count === 20 && count >= 14) {
      setCount(count - 6);
    }
  };

  const handlePages = () => {
    if (Page >= 1) {
      setPage(Page + 1);
    }
  };

  const handlePage = () => {
    if (Page >= 1) {
      setPage(Page - 1);
    }
  };

  if (!Details || Details?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Dots color="white" size={32} speed={1} animating={true} />
      </div>
    );
  }

  const Similars = Similar?.filter((dt) => dt.poster_path !== null);
  const Casts = Cast?.filter((dt) => dt.profile_path !== null);
  const Seasons = Details?.seasons?.filter((dt) => dt.poster_path !== null);

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="relative h-[80vh] w-full">
          <img
            src={`https://image.tmdb.org/t/p/original/${Details?.backdrop_path}`}
            alt={Details?.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-20% to-transparent" />
        </div>

        {/* TvSeries Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container hidden gap-8 mx-auto md:flex">
            <div className="hidden w-64 translate-y-16 md:block">
              <img
                src={`https://image.tmdb.org/t/p/w500/${Details?.poster_path}`}
                alt={Details?.name}
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white md:text-6xl">
                  {Details?.name}
                </h1>
                <p className="text-xl font-light font-Raleway text-cyan-400">
                  {Details?.tagline}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Details?.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 text-sm text-gray-200 rounded-full bg-gray-800/80"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Rating value={Details?.vote_average} />
                    <span className="text-gray-300">
                      {Details?.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                </div>
                <p className="max-w-3xl text-lg text-gray-300">
                  {Details?.overview}
                </p>
                <div className="flex gap-4 pt-4">
                  <Link
                    to={`https://vidsrc.xyz/embed/movie?imdb=${Details.imdb_id}`}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <FaRegCirclePlay className="text-xl" />
                    Watch Now
                  </Link>
                  <button
                    onClick={handleTrailer}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <FaRegCirclePlay className="text-xl" />
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* movie mobile overlay view */}
      <div className="container flex gap-8 px-5 mx-auto md:hidden">
        <div className="flex-1">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              {Details?.name}
            </h1>
            <p className="text-xl font-light font-Raleway text-cyan-400">
              {Details?.tagline}
            </p>
            <div className="flex flex-wrap gap-2">
              {Details?.genres?.map((genre) => (
                <>
                  <span
                    key={genre.id}
                    className="px-3 py-1 text-sm text-gray-200 rounded-full bg-gray-800/80"
                  >
                    {genre.name}
                  </span>
                </>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Rating value={Details?.vote_average} />
                <span className="text-gray-300">
                  {Details?.vote_average?.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400">••••••</span>
            </div>
            <p className="max-w-3xl text-lg text-gray-300">
              {Details?.overview}
            </p>
            <div className="flex flex-row items-center justify-between pt-4">
              <Link
                to={`https://vidsrc.xyz/embed/movie?imdb=${Details.imdb_id}`}
                className="flex items-center gap-2 px-4 py-1.5 font-medium text-white transition-colors bg-red-600 rounded-lg"
              >
                <FaRegCirclePlay className="text-xl" />
                Watch Now
              </Link>
              <Link
                onClick={handleTrailer}
                className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-gray-800 rounded-lg"
              >
                <FaRegCirclePlay className="text-xl" />
                Watch Trailer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* list of seasosons  */}

      <div className="container flex flex-col px-5 mx-auto mt-16 md:px-0">
        <table className="w-full bg-gray-800 rounded-lg md:w-1/2">
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-base lg:text-lg text-slate-200">
                Status:
              </td>
              <td className="px-4 py-2 text-base text-yellow-500 lg:text-lg">
                {Details?.status}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-base lg:text-lg text-slate-200">
                Release Date:
              </td>
              <td className="px-4 py-2 text-base text-yellow-500 lg:text-lg">
                {Details?.first_air_date}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-base lg:text-lg text-slate-200">
                Number of Episodes:
              </td>
              <td className="px-4 py-2 text-base lg:text-lg text-slate-200">
                {Details?.number_of_episodes}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-base lg:text-lg text-slate-200">
                Number of Seasons:
              </td>
              <td className="px-4 py-2 text-base lg:text-lg text-slate-200">
                {Details?.number_of_seasons}
              </td>
            </tr>
            {Details.next_episode_to_air !== null && (
              <tr className="border-b border-gray-700">
                <td className="px-4 py-2 text-base lg:text-lg text-slate-200">
                  Next Episode Release:
                </td>
                <td className="px-4 py-2 text-base lg:text-lg text-slate-200">
                  {Details?.next_episode_to_air.air_date}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="relative flex-grow space-y-6">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

        {Seasons?.slice(0, num)?.map((item, index) => (
          <motion.div
            key={index + item?.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex items-center ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className={`w-1/2 ${
                index % 2 === 0 ? "text-right pr-4" : "text-left pl-4"
              }`}
            >
              (
              <>
                <div
                  className={`flex items-center ${
                    index % 2 === 0 ? "justify-end" : "justify-start"
                  } space-x-2`}
                >
                  {index % 2 !== 0 && (
                    <div className="text-5xl text-gray-500 " />
                  )}
                  <div className={` ${index % 2 === 0 ? "pr-1" : " pl-5"}`}>
                    <div>
                      <h2
                        className="text-xl font-semibold text-white transition-colors cursor-pointer hover:text-blue-400 md:text-2xl"
                        onClick={() => toggleExpand(index)}
                      >
                        {item.name}
                      </h2>
                      <p className="text-gray-100 text-md">
                        Season {item.season_number}
                      </p>
                      <p className="text-sm text-gray-100">
                        Episodes {item.episode_count}
                      </p>
                      {item.air_date && (
                        <p className="text-sm text-gray-100">
                          Released {item.air_date}
                        </p>
                      )}
                    </div>
                  </div>
                  {index % 2 === 0 && (
                    <div className="text-5xl text-gray-500 " />
                  )}
                </div>
                <AnimatePresence>
                  {expandedItem === index && (
                    <>
                      <div className="w-full mt-2">
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={` ${
                            index % 2 === 0
                              ? "text-gray-200 pr-3 md:pl-10 md:text-justify"
                              : "max-w-3xl pl-7 mt-2 text-gray-200"
                          }`}
                        >
                          {item?.overview}
                        </motion.p>
                      </div>
                      <div
                        className={` ${
                          index % 2 === 0
                            ? "flex items-end justify-end w-full"
                            : "flex  items-start w-full justify-start"
                        }`}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500/${item?.poster_path}`}
                          alt={item?.name}
                          className={`mt-3 rounded-lg  ${
                            index % 2 === 0 ? "pr-3" : "pl-7"
                          }`}
                        />
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </>
              )}
            </div>
            <div className="relative">
              <div
                className={`mt-3 rounded-lg  ${
                  index % 2 === 0
                    ? "absolute z-10 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full top-1/2 "
                    : "absolute z-10 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full top-1/2 left-1/2"
                }`}
              ></div>
              <div
                className={`mt-3 rounded-lg  ${
                  index % 2 === 0
                    ? "w-8 h-0.5 bg-gray-200 absolute top-1/2 right-1/2 transform -translate-y-1/2"
                    : "w-8 h-0.5 bg-gray-200 absolute top-1/2 left-1/2 transform -translate-y-1/2"
                }`}
              ></div>
            </div>
            <div className="w-1/2"></div>
          </motion.div>
        ))}
      </div>
      <div
        className={`${
          Seasons?.length <= 4
            ? "hidden"
            : "container flex items-end justify-end w-full mx-auto mt-16"
        }`}
      >
        {num >= Seasons?.length ? (
          <button
            onClick={() => setNum(num - 4)}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
          >
            <MinusCircle className="w-4 h-4" />
            <span>Show Less</span>
          </button>
        ) : (
          <div className="flex flex-row gap-x-5">
            <button
              onClick={() => setNum(num - 4)}
              className={`${
                num >= 5
                  ? "inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
                  : "hidden"
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>Show Less</span>
            </button>
            <button
              onClick={() => setNum(num + 4)}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Show More</span>
            </button>
          </div>
        )}
      </div>

      {/* Trailer Section */}
      {Trailer && (
        <div className="container px-4 py-16 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <ReactPlayer
                width="100%"
                height="500px"
                controls={true}
                url={`https://www.youtube.com/watch?v=${Selected}`}
                className="overflow-hidden rounded-lg"
              />
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {Videos?.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(video.key)}
                  className="w-full p-4 text-left transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500">{video.type}</span>
                      <span className="text-gray-400">{video.site}</span>
                    </div>
                    <p className="text-sm text-blue-400">
                      {video.published_at}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cast Section */}
      <div className="container px-4 py-16 mx-auto">
        <h2 className="relative py-2 mb-8 overflow-hidden text-2xl font-bold text-white font-scifi group">
          <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-cyan-400 after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
            Cast
          </span>
          <div className="absolute inset-0 transform -skew-x-12 bg-gradient-to-r from-cyan-900/10 to-transparent"></div>
          <div className="absolute w-1 -translate-y-1/2 opacity-75 -left-2 top-1/2 h-1/2 bg-cyan-400"></div>
        </h2>
        <div className="flex gap-6 pb-6 overflow-x-auto">
          {Casts?.map((person, index) => (
            <div key={person.file_path + index} className="flex-shrink-0 w-48">
              <CastProfile
                image={person?.profile_path}
                name={person?.name}
                role={person?.character}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tvseries Stills */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-white">Movie Stills</h2>
        <div className="grid grid-flow-col gap-4 pb-4 overflow-x-auto">
          {Images?.map((image, index) => (
            <div key={index} className="w-[400px]">
              <img
                src={`https://image.tmdb.org/t/p/w780/${image?.file_path}`}
                alt={`Movie still ${index + 1}`}
                className="rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Similar TVseries */}
      {Similar.length > 0 && (
        <section className="container px-4 py-12 mx-auto">
          <div className="relative py-4 mb-6">
            {/* Animated background effect */}
            <div className="absolute inset-0 transition-transform duration-300 transform rounded-lg bg-gradient-to-r from-red-950/30 via-red-900/20 to-transparent hover:scale-105" />

            <div className="relative">
              {/* Main content container */}
              <div className="flex items-center gap-5 ">
                {/* Icon with animation wrapper */}
                <div className="relative hidden sm:block">
                  <ThumbsUp className="w-6 h-6 text-red-500" />
                  <Sparkles className="absolute w-4 h-4 text-yellow-400 -top-2 -right-2 animate-pulse" />
                </div>

                {/* Heading text */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold">
                    <span className="relative">
                      {/* Gradient text effect */}
                      <span className="text-transparent bg-gradient-to-r from-white via-gray-100 to-red-100 bg-clip-text">
                        You Might Also Like
                      </span>

                      {/* Animated underline */}
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-red-400 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </h2>

                  {/* Optional subtitle */}
                  <p className="mt-1 text-sm text-gray-400">
                    Personalized picks for you
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="items-center flex-grow hidden gap-3 md:flex">
                  <div className="flex-grow h-[1px] bg-gradient-to-r from-red-500/40 to-transparent" />

                  {/* Animated recommendation indicators */}
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center w-6 h-6"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-red-500/60 animate-ping"
                          style={{
                            animationDuration: "1.5s",
                            animationDelay: `${i * 200}ms`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute hidden transform -translate-y-1/2 top-1/2 right-4 lg:block">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${i * -10}px`,
                    right: `${i * 10}px`,
                    transform: `rotate(${i * 15}deg)`,
                  }}
                >
                  <Sparkles
                    className="w-3 h-3 text-red-400/40 animate-pulse"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Similars?.slice(0, count).map((movie, index) => (
              <TvSeriesPoster
                key={movie.id + index}
                name={movie?.name}
                image={movie?.poster_path}
                image2={movie?.backdrop_path}
                id={movie.id}
                rating={movie?.vote_average}
              />
            ))}
          </div>
          <div className="w-full mt-10">
            <div className="flex items-center justify-end gap-3">
              {/* Less/More Button */}
              {count === 20 ? (
                <button
                  onClick={handleDecrease}
                  className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>Show Less</span>
                </button>
              ) : (
                <button
                  onClick={handleIncrese}
                  className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Show More</span>
                </button>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePages}
                  className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handlePage}
                  className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews section */}
      {Reviews?.length > 0 && (
        <section className="container py-12 mx-auto">
          <div className="relative py-5 mb-6 group">
            {/* Animated background glow */}
            <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-75 bg-gradient-to-r from-red-950/30 via-red-900/20 to-transparent group-hover:opacity-100" />

            <div className="relative">
              {/* Main content container */}
              <div className="flex items-center gap-5 ">
                {/* Icon cluster */}
                <div className="relative hidden sm:block">
                  <MessageSquare className="text-red-500 w-7 h-7" />
                  <Users className="absolute w-4 h-4 text-red-400 -top-2 -right-2" />
                  <div className="absolute -bottom-1 -right-1">
                    {/* Animated star rating */}
                    <div className="flex gap-px">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-2 h-2 text-yellow-400 fill-yellow-400 animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Heading content */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold tracking-tight">
                    <span className="relative inline-block">
                      {/* Gradient text */}
                      <span className="text-transparent bg-gradient-to-r from-white via-gray-100 to-red-100 bg-clip-text">
                        Reviews
                      </span>

                      {/* Animated underline */}
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </h2>

                  {/* Subtitle with stats */}
                  <p className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                    <span>User Feedback & Ratings</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400">4.8</span>
                    </span>
                  </p>
                </div>

                {/* Decorative right section */}
                <div className="items-center flex-grow hidden gap-3 md:flex">
                  {/* Gradient line */}
                  <div className="flex-grow h-[1px] bg-gradient-to-r from-red-500/40 to-transparent" />

                  {/* Review count indicators */}
                  <div className="flex items-end h-6 gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-red-500/60 animate-pulse"
                        style={{
                          height: `${(i + 1) * 6}px`,
                          animationDelay: `${i * 200}ms`,
                          animationDuration: "1.5s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
              </div>
            </div>

            {/* Floating review bubbles */}
            <div className="absolute top-0 right-0 hidden lg:block">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-red-400/30 animate-ping"
                  style={{
                    top: `${i * 10}px`,
                    right: `${i * 15}px`,
                    animationDelay: `${i * 300}ms`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
            {Reviews?.map((review, index) => (
              <div key={index} className="p-6 rounded-lg bg-gray-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <IoPersonCircleOutline className="text-3xl text-gray-400" />
                  <h3 className="text-xl font-semibold text-white">
                    {review.author}
                  </h3>
                </div>
                <p className="leading-relaxed text-gray-300 font-Raleway">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MovieDetails;
