import ProducerSelector from "./producers-filter";
import React, { useEffect, useRef, useState } from "react";
import ArrowBack from "../../../images/arrow-back.svg";
import classNames from "classnames";
import css from "./games-menu.module.css";
import Input from "../../../components/form3/input";
import { useFetchSectionsQuery } from "../../../app/api/games.api";
import { useTranslation } from "react-i18next";
import device from "../../../utils/detect-device";
import { useMediaQuery } from "beautiful-react-hooks";
import { NavLink, useHistory } from "react-router-dom";
import favorite from "../../../images/games/games_menu/favorite.svg";
import favorite_hover from "../../../images/games/games_menu/favorite_hover.svg";
import favorite_active from "../../../images/games/games_menu/favorite_active.svg";
import last_played from "../../../images/games/games_menu/last_played.svg";
import last_played_hover from "../../../images/games/games_menu/last_played_hover.svg";
import last_played_active from "../../../images/games/games_menu/last_played_active.svg";
import thems from "../../../images/games/games_menu/thems.svg";
import thems_hover from "../../../images/games/games_menu/thems_hover.svg";
import thems_active from "../../../images/games/games_menu/thems_active.svg";
import live_games from "../../../images/games/games_menu/live_games.svg";
import live_games_hover from "../../../images/games/games_menu/live_games_hover.svg";
import live_games_active from "../../../images/games/games_menu/live_games_active.svg";
import bonus_buy from "../../../images/games/games_menu/bonus_buy.svg";
import bonus_buy_hover from "../../../images/games/games_menu/bonus_buy_hover.svg";
import bonus_buy_active from "../../../images/games/games_menu/bonus_buy_active.svg";
import all_games from "../../../images/games/games_menu/all_games.svg";
import all_games_hover from "../../../images/games/games_menu/all_games_hover.svg";
import all_games_active from "../../../images/games/games_menu/all_games_active.svg";
import popular from "../../../images/games/games_menu/popular.svg";
import popular_hover from "../../../images/games/games_menu/popular_hover.svg";
import popular_active from "../../../images/games/games_menu/popular_active.svg";
import new_games from "../../../images/games/games_menu/new_games.svg";
import new_games_hover from "../../../images/games/games_menu/new_games_hover.svg";
import new_games_active from "../../../images/games/games_menu/new_games_active.svg";
import { useAuth } from "../../../services/auth";
import CategorySelector from "./category-selector";
import { useDispatch, useSelector } from "react-redux";
import { setClickLogo, setFilters, setStopGamesFilters } from "../game.slice";
import { useGetActiveBonusQuery } from "../../../app/api/bonus.api";
import ProducerBlock from "../../../components/producer-block/producer-block";
import { isEmptyFilters } from "../../../utils/validation";

const sectionIcons = {
  live_games: {
    default: live_games,
    hover: live_games_hover,
    active: live_games_active,
  },
  bonus_buy: {
    default: bonus_buy,
    hover: bonus_buy_hover,
    active: bonus_buy_active,
  },
  all_games: {
    default: all_games,
    hover: all_games_hover,
    active: all_games_active,
  },
  popular: {
    default: popular,
    hover: popular_hover,
    active: popular_active,
  },
  new_games: {
    default: new_games,
    hover: new_games_hover,
    active: new_games_active,
  },
};

/**
 *   @Component
 *   Компонент отрисовывающий навигацию по категориям игр + фильтры
 *   Тут происхоит вывод ui компонентов фильтров и вся необходимая обработка для них.
 *   Новый запрос с измененными фильтрами выполняется из родительского компонента путем изменения filters
 *
 * */
export default function GamesMenu({ isFetching, currentSection, variant }) {
  const gamesFilters = useSelector((state) => state.game.filters);
  const stopGamesFilters = useSelector((state) => state.game.stopGamesFilters);
  const hideSidebarLeft = useSelector((state) => state.app.hideSidebarLeft);
  const [activeWager, setActiveWager] = useState();
  const { data: sections } = useFetchSectionsQuery();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const deviceInfo = new device();
  const { isSafariIOS } = deviceInfo;
  const game = useSelector((state) => state.game.game);
  const [filtersExpanded, setFilterExpanded] = useState(false);
  const isTablet = useMediaQuery("(max-width: 1280px)");
  const auth = useAuth();
  const [stuckPosition, setStuckPosition] = useState(false);
  // eslint-disable-next-line
  const [shadowStyle, setShadowStyle] = useState(false);
  const openSearchGame = useSelector((state) => state.game.openSearchGame);
  const dispatch = useDispatch();
  const clickLogo = useSelector((state) => state.game.clickLogo);

  const { data: activeBonus } = useGetActiveBonusQuery();
  useEffect(() => {
    if (activeBonus?.active_wager?.active) {
      setActiveWager(true);
    } else {
      setActiveWager(false);
    }
  }, [activeBonus?.active_wager?.active]);

  useEffect(() => {
    if (gamesFilters !== null) {
      const filterTitle = gamesFilters?.title || "";
      setSearch(filterTitle);
    } else if (stopGamesFilters) {
      setSearch("");
      dispatch(setStopGamesFilters(false));
    }
    // eslint-disable-next-line
  }, [gamesFilters, stopGamesFilters]);

  useEffect(() => {
    if (stopGamesFilters && clickLogo) {
      setFilterExpanded(false);
      dispatch(setClickLogo(false));
      localStorage.removeItem("filters");
    }
    // eslint-disable-next-line
  }, [stopGamesFilters, clickLogo]);

  const sortedSections = sections ? [...sections] : [];
  sortedSections.sort((a, b) => {
    if (a.title === "all_games") {
      return -1;
    }
    if (b.title === "all_games") {
      return 1;
    }
    return 0;
  });
  const history = useHistory();
  const sentinel = useRef(null);
  const shadow_sentinel = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let delayApply;

    if (!isFetching) {
      delayApply = setTimeout(() => {
        const currentFilters = {
          ...(gamesFilters ?? { section: "", title: "", producer: "" }),
        };
        dispatch(setFilters({ ...currentFilters, title: search }));
      }, 1000);
    }

    return () => clearTimeout(delayApply);
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    if (isSafariIOS && sentinel?.current) {
      let options = {};
      const callback = (e) => {
        //Если страж скрылся за верхней границей вьюпорта
        setStuckPosition(!e[0].isIntersecting);
      };
      let observer = new IntersectionObserver(callback, options);

      observer.observe(sentinel.current);
    }
  }, [isSafariIOS, sentinel]);

  const scrollToComponentTop = () => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (openSearchGame && variant === "game" && filtersExpanded) {
      setFilterExpanded(false);
    }
  }, [openSearchGame, filtersExpanded, variant]);

  const load = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className={css.loading_section}>
      <img src={sectionIcons[index]} alt="" />
      <span>{t("section")}</span>
    </div>
  ));

  return (
    <ScrollView>
      {isSafariIOS && (
        <div
          ref={sentinel}
          className={classNames(css.scrollSentinel, { [css.zero]: !!game })}
        />
      )}
      {isSafariIOS && (
        <div
          className={classNames(css.safariPadding, {
            [css.expanded]: filtersExpanded && !stuckPosition,
          })}
        />
      )}
      <div
        ref={(node) => {
          wrapperRef.current = node;
        }}
        onClick={() => {
          if (variant === "game") {
            scrollToComponentTop();
          }
        }}
        className={classNames(css.wrapper, {
          [css.stuckPosition]: stuckPosition,
          [css.safari]: isSafariIOS,
          [css.zero]: !!game,
        })}
      >
        <div
          className={classNames(
            css.container,
            { [css.close]: hideSidebarLeft && !isTablet },
            "container-2"
          )}
        >
          <div
            className={classNames(css.menu, {
              [css.menu_user]: auth?.user,
              [css.menu__guest]: !auth?.user,
              [css.menu__hidden]: filtersExpanded,
            })}
          >
            {currentSection && filtersExpanded && (
              <img
                src={ArrowBack}
                alt=""
                className={css.arrowBack}
                onClick={() => history.push("/")}
              />
            )}
            {sections ? (
              <>
                {sortedSections?.map((section) => {
                  if (section?.title === "live_games" && activeWager) {
                    return null;
                  }
                  return (
                    <React.Fragment key={`section-${section.id}`}>
                      <NavLink
                        exact={true}
                        to={`/games/${section.title}`}
                        className={(isActive) =>
                          classNames(css.game_category, {
                            [css.game_category__hidden]:
                              filtersExpanded && !isActive,
                            [css.game_category__active]:
                              currentSection === section.title,
                          })
                        }
                        activeClassName={css.active_filter}
                        onClick={(e) => {
                          if (currentSection === section.title) {
                            e.preventDefault();
                          } else {
                            window.openSplash();
                          }
                        }}
                      >
                        <div className={css.iconWrapper}>
                          <img
                            src={sectionIcons[section.title]?.default}
                            className={css.game_svg}
                            alt=""
                          />
                          <img
                            src={sectionIcons[section.title]?.hover}
                            className={css.hoverImage}
                            alt=""
                          />
                          <img
                            src={sectionIcons[section.title]?.active}
                            className={css.activeImage}
                            alt=""
                          />
                        </div>
                        <span className={css.title}>{t(section.title)}</span>
                      </NavLink>
                    </React.Fragment>
                  );
                })}
                <NavLink
                  to="/games/themes"
                  onClick={() => {
                    window.openSplash();
                  }}
                  className={(isActive) =>
                    classNames(css.game_category, css.thems, {
                      [css.game_category__hidden]: filtersExpanded && !isActive,
                    })
                  }
                  activeClassName={css.active_filter}
                >
                  <div className={css.iconWrapper}>
                    <img src={thems} className={css.game_svg} alt="" />
                    <img src={thems_hover} className={css.hoverImage} alt="" />
                    <img
                      src={thems_active}
                      className={css.activeImage}
                      alt=""
                    />
                  </div>
                  <span className={css.title}>{t("themes")}</span>
                </NavLink>
              </>
            ) : (
              <div className={css.loading_block}>{load}</div>
            )}
            {auth?.user && (
              <>
                <NavLink
                  onClick={() => {
                    window.openSplash();
                  }}
                  to="/games/user/favorites"
                  className={(isActive) =>
                    classNames(css.game_category, css.user_library, {
                      [css.game_category__hidden]: filtersExpanded && !isActive,
                    })
                  }
                  activeClassName={css.active_filter}
                >
                  <div className={css.iconWrapper}>
                    <img src={favorite} className={css.game_svg} alt="" />
                    <img
                      src={favorite_hover}
                      className={css.hoverImage}
                      alt=""
                    />
                    <img
                      src={favorite_active}
                      className={css.activeImage}
                      alt=""
                    />
                  </div>
                  <span className={css.title}>{t("favorite_games")}</span>
                </NavLink>
                <NavLink
                  onClick={() => {
                    window.openSplash();
                  }}
                  to="/games/user/last-played"
                  className={(isActive) =>
                    classNames(css.game_category, css.user_library, {
                      [css.game_category__hidden]: filtersExpanded && !isActive,
                    })
                  }
                  activeClassName={css.active_filter}
                >
                  <div className={css.iconWrapper}>
                    <img src={last_played} className={css.game_svg} alt="" />
                    <img
                      src={last_played_hover}
                      className={css.hoverImage}
                      alt=""
                    />
                    <img
                      src={last_played_active}
                      className={css.activeImage}
                      alt=""
                    />
                  </div>
                  <span className={css.title}>{t("last")}</span>
                </NavLink>
              </>
            )}
          </div>
          {/* <div
            className={classNames(css.filters, {
              [css.expanded]: filtersExpanded || isTablet,
            })}
          >
            <div
              className={classNames(css.selectbox, {
                [css.expanded]: filtersExpanded || isTablet,
                [css.hidden]: !filtersExpanded && !isTablet,
              })}
            >
              <ProducerSelector filtersExpanded={filtersExpanded} />
              <CategorySelector
                options={
                  sections
                    ? sections
                        .filter(
                          (section) =>
                            section?.title !== "all_games" &&
                            !(section?.title === "live_games" && activeWager)
                        )
                        .map((section) => ({
                          value: section?.title || "",
                          label: t(section?.title || ""),
                        }))
                    : []
                }
                placeholder={t("categories")}
                value={gamesFilters?.section || ""}
                onChange={(selectedOption) => {
                  const currentFilters = {
                    ...(gamesFilters ?? {
                      section: "",
                      title: "",
                      producer: "",
                    }),
                  };

                  if (selectedOption && isEmptyFilters(gamesFilters?.section)) {
                    //если выбрана категория
                    dispatch(
                      setFilters({
                        ...currentFilters,
                        section: selectedOption.value,
                      })
                    );
                  } else {
                    //если НЕ выбрана категория
                    dispatch(setFilters({ ...currentFilters, section: "" }));
                  }
                }}
                noOptionsMessage={() => t("categories")}
              />
            </div>
            <Input
              isSearch={true}
              value={search}
              onChange={setSearch}
              type={"text"}
              onFocus={() => setFilterExpanded(true)}
              className={classNames(css.filters__search, {})}
              placeholder={t("Search")}
              wrapperClassName={css.searchWrapper}
            />
            <div
              className={classNames(css.filter_seach__open, {
                [css.loading]: isFetching && gamesFilters?.title?.length > 2,
              })}
              onClick={() => {
                if (!isTablet) {
                  setFilterExpanded(!filtersExpanded);
                }
              }}
            />
          </div> */}
        </div>
      </div>
      {/* <ProducerBlock filtersExpanded={filtersExpanded} /> */}
      <div
        ref={shadow_sentinel}
        className={classNames(css.shadow, { [css.shadow_top]: shadowStyle })}
      />
    </ScrollView>
  );
}

function ScrollView({ children }) {
  const deviceInfo = new device();
  const { isSafariIOS } = deviceInfo;

  if (isSafariIOS) {
    return <div className={css.scrollView}>{children}</div>;
  }

  return <>{children}</>;
}
