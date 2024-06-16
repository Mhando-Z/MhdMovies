// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

import "./Style.css";

// import required modules
import { EffectCards } from "swiper/modules";

export default function Swiper1({ data, setValue, value }) {
  return (
    <>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
        onSlideChange={(swiper) => setValue(swiper.activeIndex)}
        initialSlide={value}
      >
        {data.map((dt, index) => {
          return (
            <div key={dt.id + index}>
              <SwiperSlide>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${dt.poster_path}`}
                  alt="postermage"
                  title="movie image poster"
                />
              </SwiperSlide>
            </div>
          );
        })}
      </Swiper>
    </>
  );
}
