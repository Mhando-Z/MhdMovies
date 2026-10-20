"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

export default function AnimeSlider({ data = [], value, setValue }) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      onSwiper={(swiper) => {
        if (!swiper.destroyed) setValue(swiper.realIndex);
      }}
      onSlideChange={(swiper) => setValue(swiper.realIndex)}
      slidesPerView={3}
      initialSlide={value}
      centeredSlides
      spaceBetween={12}
      loop={data.length > 3}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      className="anime-slider"
    >
      {data.map((anime) => (
        <SwiperSlide key={anime.id}>
          <div className="anime-cover-card">
            <img
              src={anime.cover}
              alt={anime.title || anime.nativeTitle || "Anime cover"}
              className="anime-cover-image"
              loading="lazy"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
