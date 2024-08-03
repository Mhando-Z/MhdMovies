import React, { useEffect, useState } from "react";
import { Virtual, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

export default function Slider({ data, value, setValue }) {
  const [swiperRef, setSwiperRef] = useState(0);

  // Create array with 500 slides

  useEffect(() => {
    if (swiperRef) {
      setValue(swiperRef.activeIndex);
      swiperRef.on("slideChange", () => {
        setValue(swiperRef.activeIndex);
      });
    }
  }, [swiperRef, setValue]);

  return (
    <>
      <Swiper
        modules={[Virtual, Autoplay, Navigation, Pagination]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        // onSwiper={() => setValue(setSwiperRef.activeIndex)}
        onSwiper={setSwiperRef}
        slidesPerView={3}
        initialSlide={value}
        centeredSlides={true}
        spaceBetween={20}
        pagination={{
          type: "fraction",
        }}
        virtual
      >
        {data?.map((dt, index) => (
          <SwiperSlide key={dt.id + index}>
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w500/${dt?.poster_path}`}
                alt={dt?.title}
                className="h-full bg-cover max-w-screen"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
