import { React } from 'react';
import { useSwiper } from 'swiper/react';
import css from "./slide.control.module.css";

export default function SlideControlButton({i, isActive}) {
  const swiper = useSwiper();

  return (
    <div
      className={isActive || swiper.activeIndex === i ? css.active : css.page}
      onClick={() => swiper.slideTo(i)}
    />
  );
}
