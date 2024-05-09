import React, { useRef, useState } from "react";
import { useFetchThemesQuery } from "../../../app/api/games.api";
import { useEffect } from "react";
import css from "./game-themes.module.css";
import { NavLink, useLocation } from "react-router-dom";
import ancientCivilizations from "./../../../images/games/themes/ancient_civilizations.png";
import bookOff from "./../../../images/games/themes/book_off.png";
import fantasy from "./../../../images/games/themes/fantasy.png";
import foodSweets from "./../../../images/games/themes/food_sweets.png";
import fruits from "./../../../images/games/themes/fruits.png";
import girls from "./../../../images/games/themes/girls.png";
import holidays from "./../../../images/games/themes/holidays.png";
import horrors from "./../../../images/games/themes/horrors.png";
import joker from "./../../../images/games/themes/joker.png";
import luxuryLife from "./../../../images/games/themes/luxury_life.png";
import military from "./../../../images/games/themes/military.png";
import party from "./../../../images/games/themes/party.png";
import pirates from "./../../../images/games/themes/pirates.png";
import retro from "./../../../images/games/themes/retro.png";
import space from "./../../../images/games/themes/space.png";
import sport from "./../../../images/games/themes/sport.png";
import underwaterWorld from "./../../../images/games/themes/underwater_world.png";
import worldRegions from "./../../../images/games/themes/world_regions.png";
import logo from "./../../../images/profile/avatar-monkey.png";
import { useTranslation } from "react-i18next";
import games_themes from "./../../../images/games/index/thems.svg";
import games_themes_hover from "./../../../images/games/index/thems_hover.svg";
import classNames from "classnames";
import arrow from "./../../../images/games/themes/arrow_main_left.svg";
import { Swiper, SwiperSlide } from "swiper/react";
// eslint-disable-next-line
import SwiperCore, { Navigation } from "swiper";
import { Autoplay } from "swiper/modules";
import { useMediaQuery } from "beautiful-react-hooks";

export default function ThemesGames({ variant }) {
  const themesImage = {
    ancient_civilizations: ancientCivilizations,
    books: bookOff,
    fantasy: fantasy,
    food_sweets: foodSweets,
    fruits: fruits,
    girls: girls,
    holidays: holidays,
    horrors: horrors,
    joker: joker,
    luxury_life: luxuryLife,
    military: military,
    party: party,
    pirates: pirates,
    retro: retro,
    space: space,
    sport: sport,
    underwater_world: underwaterWorld,
    world_regions: worldRegions,
  };

  const mobile = useMediaQuery("(max-width: 767px)");
  const { data: themes, error: themesError } = useFetchThemesQuery();
  const { t } = useTranslation();
  const [main, setMain] = useState();
  const [swiper, setSwiper] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // eslint-disable-next-line
  const [totalSlides, setTotalSlides] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const slide = mobile ? 2 : 6;
  const swiperRef = useRef(null);

  useEffect(() => {
    if (variant === "main") {
      setMain(true);
    } else {
      setMain(false);
    }
  }, [variant]);

  useEffect(() => {
    if (themes || themesError) {
      window.closeSplash();
    }
  }, [themes, themesError]);

  useEffect(() => {
    if (swiperRef.current) {
      setSwiper(swiperRef.current.swiper);
    }
  }, [swiperRef]);

  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
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
  }, [swiperRef.current, main]);

  function chunkArray(array, size) {
    const chunkedArray = [];
    for (let i = 0; i < array?.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  const goPrev = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const goNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
    <div className={classNames(css.wraper, { [css.main]: main })}>
      <div className={css.block_title}>
        <div className={css.title_block__wraper}>
          <NavLink to="/games/themes">
            <div className={css.iconWrapper}>
              <img src={games_themes} className={css.game_svg} alt="" />
              <img src={games_themes_hover} className={css.hoverImage} alt="" />
            </div>
            <span>{t("themes")}</span>
            {!main && (
              <span className={css.block_title_total}>{themes?.length}</span>
            )}
          </NavLink>
        </div>
        {main && (
          <div className={css.block_batton}>
            <div
              className={classNames(css.batton_left, {
                [css.disabled]: currentSlideIndex === 0,
              })}
              onClick={goPrev}
            >
              <img src={arrow} alt="" />
            </div>
            <div
              className={classNames(css.batton_right, {
                [css.disabled]: isEnd,
              })}
              onClick={goNext}
            >
              <img src={arrow} alt="" />
            </div>
          </div>
        )}
      </div>
      {main ? (
        <Swiper ref={swiperRef}>
          {chunkArray(themes, slide).map((group, groupIndex) => (
            <SwiperSlide key={`group-${groupIndex}`}>
              <div className={css.block}>
                {group.map((theme) => {
                  const name = theme?.title
                    ?.replace(/&/g, "")
                    ?.replace(/ {2}/g, "_")
                    ?.replace(/ /g, "_")
                    ?.toLowerCase();
                  return (
                    <NavLink
                      key={`theme-${theme.id}`}
                      className={css.block_wraper}
                      to={
                        themesImage.hasOwnProperty(name)
                          ? `/games/themes/${name}`
                          : "/games/all_games"
                      }
                      onClick={() => {
                        window.openSplash();
                      }}
                    >
                      <img
                        src={
                          themesImage.hasOwnProperty(name)
                            ? themesImage[name]
                            : logo
                        }
                        alt=""
                      />
                      <div className={css.item_info__block}>
                        <div className={css.theme_title}>{theme?.title}</div>
                        <div className={css.theme_title}>{t("theme")}</div>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={css.block}>
          {themes?.map((theme) => {
            const name = theme.title
              .replace(/&/g, "")
              .replace(/ {2}/g, "_")
              .replace(/ /g, "_")
              .toLowerCase();
            return (
              <React.Fragment key={`theme-${theme.id}`}>
                <NavLink
                  className={css.block_wraper}
                  to={
                    themesImage.hasOwnProperty(name)
                      ? `/games/themes/${name}`
                      : "/games/all_games"
                  }
                  onClick={() => {
                    window.openSplash();
                  }}
                >
                  <img
                    src={
                      themesImage.hasOwnProperty(name)
                        ? themesImage[name]
                        : logo
                    }
                    alt=""
                  />
                  <div className={css.item_info__block}>
                    <div className={css.theme_title}>{theme?.title}</div>
                    <div className={css.theme_title}>{t("theme")}</div>
                  </div>
                </NavLink>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
