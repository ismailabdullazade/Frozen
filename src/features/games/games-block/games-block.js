import css from "./games-block.module.css";
import GamesItem from "./game-item";
import React, { useEffect, useRef, useState } from "react";
import { useSSR, useTranslation } from "react-i18next";
import classNames from "classnames";
import { useAuth } from "../../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import detectDevice from "../../../utils/detect-device";
import { useMediaQuery } from "beautiful-react-hooks";
import actionHandler from "./action-handler";
import thems from "./../../../images/games/index/thems.svg";
import thems_hover from "./../../../images/games/index/thems_hover.svg";
import live_games from "./../../../images/games/index/live_games.svg";
import live_games_hover from "./../../../images/games/index/live_games_hover.svg";
import bonus_buy from "./../../../images/games/index/bonus_buy.svg";
import bonus_buy_hover from "./../../../images/games/index/bonus_buy_hover.svg";
import all_games from "./../../../images/games/index/all_games.svg";
import all_games_hover from "./../../../images/games/index/all_games_hover.svg";
import popular from "./../../../images/games/index/popular.svg";
import popular_hover from "./../../../images/games/index/popular_hover.svg";
import new_games from "./../../../images/games/index/new_games.svg";
import new_games_hover from "./../../../images/games/index/new_games_hover.svg";
import favorite from "./../../../images/games/favorite_games.svg";
import favorite_hover from "./../../../images/games/favorite_games_hover.svg";
import last_played from "./../../../images/games/last_played.svg";
import last_played_hover from "../../../images/games/index/last_played_hover.svg";
import Button from "../../../components/button/button";
import logo from "../../../images/logo.png";
import close from "./../../../images/close_modal.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import arrow from "./../../../images/games/themes/arrow_main_left.svg";

const sectionIcons = {
  live_games: {
    default: live_games,
    hover: live_games_hover,
  },
  bonus_buy: {
    default: bonus_buy,
    hover: bonus_buy_hover,
  },
  all_games: {
    default: all_games,
    hover: all_games_hover,
  },
  popular: {
    default: popular,
    hover: popular_hover,
  },
  new_games: {
    default: new_games,
    hover: new_games_hover,
  },
  favorite_games: {
    default: favorite,
    hover: favorite_hover,
  },
  last: {
    default: last_played,
    hover: last_played_hover,
  },
  thems: {
    default: thems,
    hover: thems_hover,
  },
};

export default function GamesBlock({
  isLoading,
  games = [],
  categoryName,
  filter,
  provider,
  showMoreAction,
  currentPage,
  total,
  indexPage,
  variant,
  ...props
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const deviceInfo = new detectDevice();
  const isMobile = useMediaQuery("(max-width: 768px)");
  // || deviceInfo.isMobile;
  const auth = useAuth();
  const history = useHistory();
  const [privatPage, setPrivatPage] = useState(true);
  const [themePage, setThemePage] = useState(false);
  const [loadedGames, setLoadedGames] = useState(false);
  const [searchBlock, setSearchBlock] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // eslint-disable-next-line
  const [totalSlides, setTotalSlides] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const slide = isMobile ? 2 : 7;
  const swiperRef = useRef(null);
  const filters = useSelector((state) => state.game.filters);
  const battonLoad = indexPage
    ? null
    : currentPage !== undefined && showMoreAction;
  const Section = ({ list }) =>
    list.map((item) => (
      <GamesItem
        key={`game-${item.id}`}
        item={item}
        action={(type, identifier, provider) =>
          actionHandler(
            type,
            identifier,
            provider,
            currentPage,
            dispatch,
            isMobile,
            auth,
            history,
            deviceInfo
          )
        }
      />
    ));

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
  }, [swiperRef?.current, indexPage]);

  function chunkArray(array, size) {
    const chunkedArray = [];
    for (let i = 0; i < array?.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

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

  useEffect(() => {
    games.forEach((game) => {
      const img = new Image();
      img.onload = () => {
        setLoadedGames((prevLoadedGames) => {
          return {
            ...prevLoadedGames,
            [game.id]: true,
          };
        });
      };
      img.src = game?.images?.["380x380"];
    });
  }, [games]);

  const location = useLocation();
  const { pathname } = useLocation();
  const urlTitle = pathname.split("/")[3];
  const themesList = [
    "Ancient civilizations",
    "Books",
    "Fantasy",
    "Food & Sweets",
    "Fruits",
    "Girls",
    "Holidays",
    "Horrors",
    "Joker",
    "Luxury life",
    "Military",
    "Party",
    "Pirates",
    "Retro",
    "Space",
    "Sport",
    "Underwater world",
    "World regions",
  ];
  const themeTitle = themesList[urlTitle];
  let firstThemeTitle = "";
  if (themeTitle) {
    const words = themeTitle.split(" ");
    firstThemeTitle = words[0];
  }

  const navInfo = () => {
    const res = {
      name: categoryName,
      href: `/games/${categoryName}`,
    };

    switch (location.pathname) {
      case "/":
        res.name = categoryName;
        break;
      case "/games/user/favorites":
        res.name = `favorite_games`;
        res.href = "/games/user/favorites";
        break;
      case "/games/user/last-played":
        res.name = "last";
        res.href = "/games/user/last-played";
    }

    res.icon = sectionIcons[res.name];

    return res;
  };
  const pageItem = navInfo();
  const shouldRenderImage = sectionIcons.hasOwnProperty(pageItem.name);

  useEffect(() => {
    if (themesList.includes(pageItem?.name)) {
      setThemePage(true);
    } else {
      setThemePage(false);
    }
  }, [pageItem?.name]);

  useEffect(() => {
    if (
      pathname === "/games/user/favorites" ||
      pathname === "/games/user/last-played"
    ) {
      setPrivatPage(true);
    } else {
      setPrivatPage(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (variant === "search") {
      setSearchBlock(true);
    } else {
      setSearchBlock(false);
    }
  }, [variant]);

  const logos = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className={css.image_logo}>
      <img src={logo} alt="" />
    </div>
  ));

  return (
    <>
      {!loadedGames && !privatPage ? (
        <div className={css.content_loader__block}>
          <div className={css.content_loader__title}>
            <span className={css.content_img__category}>
              <img src={close} alt="" />
            </span>
            <span className={css.content_title}>{t("section")}</span>
          </div>
          <div className={css.content_loader__cards}>{logos}</div>
        </div>
      ) : (
        <div
          className={classNames(css.games_block, {
            [css.search]: searchBlock,
          })}
        >
          <div className={css.block_title}>
            <NavLink
              className={css.category_title}
              to={!indexPage || themePage ? "" : pageItem.href}
              onClick={window.openSplash}
            >
              {shouldRenderImage && !searchBlock ? (
                <div className={css.iconWrapper}>
                  <img
                    src={sectionIcons[pageItem.name]?.default}
                    className={css.game_svg}
                    alt=""
                  />
                  <img
                    src={sectionIcons[pageItem.name]?.hover}
                    className={css.hoverImage}
                    alt=""
                  />
                </div>
              ) : (
                ""
              )}
              {!searchBlock && (
                <span className={css.title}>{t(pageItem.name)}</span>
              )}
              {<span className={css.total}>{total}</span>}
            </NavLink>
            <div className={css.title_block__wraper}>
              {indexPage && (
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
          </div>
          <div className={css.container}>
            {games?.length ? (
              <div
                className={classNames(
                  css.section_1,
                  {
                    [css.in_filter]: filter,
                  },
                  { [css.main]: indexPage }
                )}
              >
                {games ? (
                  indexPage ? (
                    <Swiper ref={swiperRef}>
                      {chunkArray(games, slide).map((group, groupIndex) => (
                        <SwiperSlide key={`group-${groupIndex}`}>
                          <div className={css.block_games}>
                            {group.map((item) => (
                              <GamesItem
                                key={`game-${item.id}`}
                                item={item}
                                action={(type, identifier, provider) =>
                                  actionHandler(
                                    type,
                                    identifier,
                                    provider,
                                    currentPage,
                                    dispatch,
                                    isMobile,
                                    auth,
                                    history,
                                    deviceInfo
                                  )
                                }
                              />
                            ))}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <Section list={games} />
                  )
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            ) : (
              !isLoading &&
              !total && (
                <div className={css.no_games}>
                  {t("games not found")}
                  <br />
                  {t("try another filters")}
                </div>
              )
            )}
            {battonLoad && (
              <div className={css.showMoreContainer}>
                <Button
                  onClick={isLoading ? null : showMoreAction}
                  childrenClassName={css.showMoreBtn}
                >
                  {isLoading ? (
                    <span className="text-muted">{t("Loading")}</span>
                  ) : (
                    t("More games")
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
