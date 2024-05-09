import css from "./win-lines.module.css";
import { useEffect, useRef, useState } from "react";
import { useLastWinsMutation } from "../../app/api/games.api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { setGame } from "../../features/games/game.slice";
import { useDispatch, useSelector } from "react-redux";
import { toCurrencyString } from "../../utils/validation";
import { useMediaQuery } from "beautiful-react-hooks";
import { useAuth } from "../../services/auth";
import { setLoginModalState } from "../../app/app.slice";
import classNames from "classnames";

export const WinLines = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1280px)");
  const [winList, setWinList] = useState([]);
  const [gradientWidth, setGradientWidth] = useState(0);
  // eslint-disable-next-line
  const [winSize, setWinSize] = useState(40);
  const hideSidebarLeft = useSelector((state) => state.app.hideSidebarLeft);
  const swiperRef = useRef(null);

  // eslint-disable-next-line
  const [getLastWins, { data, isLoading, error }] = useLastWinsMutation();

  useEffect(() => {
    const updateGradientWidth = () => {
      const winnerContainer = document.querySelector(
        `.${css.winner_container}`
      );
      if (winnerContainer) {
        const distance = winnerContainer.getBoundingClientRect().left;
        setGradientWidth(`${distance}px`);
      }
    };

    updateGradientWidth();
    window.addEventListener("resize", updateGradientWidth);

    return () => {
      window.removeEventListener("resize", updateGradientWidth);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.swiper.autoplay.start();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [swiperRef]);

  useEffect(() => {
    const fetchData = async (size) => {
      try {
        await getLastWins({ size });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(winSize);

    const intervalId = setInterval(() => {
      fetchData(winSize + 1);
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line
  }, [getLastWins]);

  useEffect(() => {
    if (data) {
      setWinList(data);
    }
  }, [data]);

  useEffect(() => {
    if (error?.status === 500) {
      setWinList([]);
    }
  }, [error]);

  return (
    <div
      className={classNames(css.winner_slider, {
        [css.close]: hideSidebarLeft && !isTablet,
      })}
      style={{ "--gradient-width": gradientWidth }}
    >
      <div className={css.winner_container}>
        <Swiper
          key={winList.length}
          ref={swiperRef}
          // spaceBetween={10}
          slidesPerView={7}
          initialSlide={3}
          style={{
            overflow: "unset",
            width: isMobile ? "100%" : "120%",
          }}
          modules={[Autoplay]}
          autoplay={{
            delay: 3000,
            reverseDirection: true,
          }}
          loop
          noSwiping
          allowTouchMove={false}
          onSlideChangeTransitionEnd={(swiper) => {
            const isSafari = /^((?!chrome|android).)*safari/i.test(
              navigator.userAgent
            );
            if (!isSafari) {
              swiper.slides.forEach((slide) => {
                slide.classList.add(css.slide_animate);
                slide.addEventListener(
                  "animationend",
                  () => {
                    slide.classList.remove(css.slide_animate);
                  },
                  { once: true }
                );
              });
            }
          }}
          speed={1000}
          breakpoints={{
            1280: {
              slidesPerView: 5.2,
              spaceBetween: 22
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 16
            },
            622: {
              slidesPerView: 2.2,
              spaceBetween: 16
            },
            550: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            461: {
              slidesPerView: 1.8,
              spaceBetween: 16,
            },
            390: {
              slidesPerView: 1.5,
              spaceBetween: 16,
            },
            350: {
              slidesPerView: 1.2,
              spaceBetween: 16,
            },
            0: {
              slidesPerView: "auto",
            },
          }}
        >
          {winList?.map((win, index) => (
            <SwiperSlide key={index}>
              <div
                className={css.winner_item}
                key={index}
                onClick={() => {
                  !auth?.user
                    ? dispatch(setLoginModalState(true))
                    : dispatch(
                        setGame({
                          mode: "play",
                          id: win?.casino_identifier,
                        })
                      );
                }}
              >
                <img src={win?.images["190x190"]} alt="" />
                <div className={css.winner_item__info}>
                  <p>
                    {win?.title.length > 15
                      ? `${win?.title.slice(0, 15)}...`
                      : win?.title}
                  </p>
                  <span>
                    {win?.nickname.length > 15
                      ? `${win?.nickname.slice(0, 15)}...`
                      : win?.nickname}
                  </span>
                  <span>
                    {toCurrencyString(
                      win?.amount.toStringWithSubUnits(win?.currency.subunits)
                    )}{" "}
                    {win?.currency?.sign}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
