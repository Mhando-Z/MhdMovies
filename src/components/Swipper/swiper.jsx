"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

export default function Slider({ data, value, setValue }) {
  return (
    <>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => setValue(swiper.activeIndex)}
        onSlideChange={(swiper) => setValue(swiper.activeIndex)}
        slidesPerView={3}
        initialSlide={value}
        centeredSlides={true}
        spaceBetween={20}
        pagination={{
          type: "fraction",
        }}
      >
        {data?.map((dt) => (
          <SwiperSlide key={dt.id}>
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w500${dt?.poster_path}`}
                alt={dt?.title || dt?.name}
                className="h-full bg-cover max-w-screen"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
