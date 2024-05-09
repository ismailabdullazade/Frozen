import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import css from "./banners.module.css";
import React, { useEffect, useRef, useState } from "react";
import banner1 from "./../../../images/banners/banner_welcome_pack.png";
import banner1En from "./../../../images/banners/banner_welcome_pack_eng.png";
import banner2 from "./../../../images/banners/banner_vip_club.png";
import banner2En from "./../../../images/banners/banner_vip_club_eng.png";
import banner3 from "./../../../images/banners/banner_deposit.png";
import banner3En from "./../../../images/banners/banner_deposit_eng.png";
import banner4 from "./../../../images/banners/banner_free_money.png";
import banner4En from "./../../../images/banners/banner_free_money_eng.png";

import banner1_mobile from "./../../../images/banners/banner_welcome_pack_mobile.png";
import banner1En_mobile from "./../../../images/banners/banner_welcome_pack_mobile_eng.png";
import banner2_mobile from "./../../../images/banners/banner_vip_club_mobile.png";
import banner2En_mobile from "./../../../images/banners/banner_vip_club_mobile_eng.png";
import banner3_mobile from "./../../../images/banners/banner_deposit_mobile.png";
import banner3En_mobile from "./../../../images/banners/banner_deposit_mobile_eng.png";
import banner4_mobile from "./../../../images/banners/banner_free_money_mobile.png";
import banner4En_mobile from "./../../../images/banners/banner_free_money_mobile_eng.png";
import arrow from "./../../../images/banners/arrow_banners.svg";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../../services/auth";
import { useMediaQuery } from "beautiful-react-hooks";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WinLines } from "./../../../components/win-lines/win-lines";
import classNames from "classnames";
// import SlideControlButton from "../../../features/my-bonus/available-bonuses/slide-control/control";

const slidesData = [
  {
    image: {
      mobileRu: banner1_mobile,
      mobileEn: banner1En_mobile,
    },
    link: "/wallet",
  },
  {
    image: {
      mobileRu: banner2_mobile,
      mobileEn: banner2En_mobile,
    },
    link: "/vip",
  },
  {
    image: {
      mobileRu: banner3_mobile,
      mobileEn: banner3En_mobile,
    },
    link: "/wallet",
  },
  {
    image: {
      mobileRu: banner4_mobile,
      mobilepEn: banner4En_mobile,
    },
    link: "/free-money",
  },
];

export default function Banners() {
  const { i18n } = useTranslation();
  const history = useHistory();
  const rus = i18n.resolvedLanguage === "ru";
  const auth = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(max-width: 1280px)");
  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);
  const hideSidebarLeft = useSelector((state) => state.app.hideSidebarLeft);
  // eslint-disable-next-line
  const [swiper, setSwiper] = useState(null);
  // eslint-disable-next-line
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // eslint-disable-next-line
  const [totalSlides, setTotalSlides] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef?.current) {
      setSwiper(swiperRef?.current.swiper);
    }
  }, [swiperRef]);

  useEffect(() => {
    if (swiperRef?.current) {
      const swiperInstance = swiperRef?.current?.swiper;
      if (swiperInstance) {
        setSwiper(swiperInstance);

        swiperInstance.on("slideChange", () => {
          setCurrentSlideIndex(swiperInstance.activeIndex);
          setIsEnd(swiperInstance.isEnd);
        });

        swiperInstance.on("reachEnd", () => {
          setIsEnd(true);
        });

        swiperInstance.on("reachBeginning", () => {
          setIsEnd(false);
        });

        setTotalSlides(swiperInstance.slides.length);
      }
    }
    // eslint-disable-next-line
  }, [swiperRef?.current]);

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    } else {
      console.error("Swiper is not initialized yet");
    }
  };

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    } else {
      console.error("Swiper is not initialized yet");
    }
  };

  const generateSlide = (image, link, language, key) => (
    <SwiperSlide key={key} onClick={() => history.push(link)}>
      {isMobile && (
        <img
          className={css.slideImg}
          src={language === "ru" ? image.mobileRu : image.mobileEn}
          alt=""
        />
      )}
    </SwiperSlide>
  );

  if (
    (location.pathname !== "/" &&
      !location.pathname.includes("/games") &&
      !(window.location.pathname === "/registration")) ||
    (window.location.pathname === "/registration" && Boolean(auth?.user))
  ) {
    return null;
  }

  return (
    <div className={css.top_index_page}>
      <WinLines />
      <div className={css.index_decoration}>
        {!isMobile ? (
          <div
            className={classNames(css.desctop_banners, {
              [css.close]: hideSidebarLeft && !isTablet,
            })}
          >
            <div className={css.banner_small}>
              <div
                className={css.banner}
                onClick={() => history.push("/wallet")}
              >
                <img src={rus ? banner1 : banner1En} alt="" />
              </div>
              <div className={css.banner} onClick={() => history.push("/vip")}>
                <img src={rus ? banner2 : banner2En} alt="" />
              </div>
            </div>
            <div className={css.banner} onClick={() => history.push("/wallet")}>
              <img src={rus ? banner3 : banner3En} alt="" />
            </div>
            <div
              className={css.banner}
              onClick={() => history.push("/free-money")}
            >
              <img src={rus ? banner4 : banner4En} alt="" />
            </div>
          </div>
        ) : (
          <div>
            <Swiper
            style={{
              "--swiper-pagination-color": "#fa00ff",
              "--swiper-pagination-bullet-inactive-color": "#470750",
              "--swiper-pagination-bullet-inactive-opacity": "1",
              "--swiper-pagination-bullet-size": "8px",
              "--swiper-pagination-bullet-border-radius": "0",
              "--swiper-pagination-bullet-horizontal-gap": "6px"
            }}
              ref={swiperRef}
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={1}
              loop={true}
              coverflowEffect={{
                rotate: 0,
                stretch: "-20%",
                depth: 39.4,
                modifier: -4.5,
                slideShadows: true,
              }}
              speed={500}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              modules={[EffectCoverflow, Autoplay, Pagination]}
              className={css.swiper}
              // loopedSlides={slidesData.length}
              onSlideChange={(swiper) => {
                setActiveSwiperIndex(swiper.realIndex);
              }}
            >
              {slidesData.map((data, index) =>
                generateSlide(
                  data.image,
                  data.link,
                  i18n.resolvedLanguage,
                  index
                )
              )}
              <div className={css.pagination}>
                <div className={css.arrow_left} onClick={goPrev}>
                  <img src={arrow} alt="" />
                </div>
               
                <div className={css.arrow_right} onClick={goNext}>
                  <img src={arrow} alt="" />
                </div>
              </div>
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}
