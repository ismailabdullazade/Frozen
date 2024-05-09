import React, { Fragment, useEffect, useRef, useState } from "react";
import css from "./game-layout.module.css";
import classNames from "classnames";
// eslint-disable-next-line
import { NavLink, useLocation, useHistory } from "react-router-dom";
// eslint-disable-next-line
// import device from "../../../utils/detect-device";
import { useFetchSectionsQuery, useGetGamesQuery } from "../../../app/api/games.api";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../services/auth";
import {
  setFiltersOpened,
  setPlaseHolderInputProduserFilter,
  setClickLogo,
} from "../game.slice";
import { useMediaQuery } from "beautiful-react-hooks";
import { useDispatch, useSelector } from "react-redux";
import GameItem from "../games-block/game-item";
import device from "../../../utils/detect-device";
import detectDevice from "../../../utils/detect-device";
import actionHandler from "../games-block/action-handler";
import Select from "../../../components/form3/select";
import Input from "../../../components/form3/input";
import ProducerSelector from "../games-menu/producers-filter";
import thems from "./../../../images/header/left-menu/themes.svg";
import live_games from "./../../../images/games/live_games.svg";
import bonus_buy from "./../../../images/games/bonus_buy.svg";
import all_games from "./../../../images/games/all_games.svg";
import popular from "./../../../images/games/popular.svg";
import new_games from "./../../../images/games/new_games.svg";
import favorite from "./../../../images/games/favorite_games.svg";
import last_played from "./../../../images/games/last_played.svg";
import Loader from "../../../components/loader/Loader";

const icons = {
  live_games: live_games,
  bonus_buy: bonus_buy,
  all_games: all_games,
  popular: popular,
  new_games: new_games,
  thems: thems,
};

export default function GamesLayout({ children, variant }) {
  // const deviceInfo = new device();
  const { data: sections } = useFetchSectionsQuery();
  const { t } = useTranslation();
  const auth = useAuth();
  const isTablet = useMediaQuery("(max-width: 1290px)");
  const isiMac13 = useMediaQuery(
    variant === "inGame" ? "(max-width: 1435px)" : "(max-width: 1600px)"
  );
  const location = useLocation();
  const filterIsOpened = useSelector((state) => state.game.filterIsOpened);
  const clickLogo = useSelector((state) => state.game.clickLogo);
  const [search, setSearch] = useState(
    filterIsOpened?.searchTitle ? filterIsOpened.searchTitle : ""
  );
  const [openSearch, setOpenSearch] = useState(false);
  const [isThemesCategory, setIsThemesCategory] = useState(false);
  const [isLastPlayedCategory, setIsLastPlayedCategory] = useState(false);
  const [isFavoritesCategory, setIsFavoritesCategory] = useState(false);
  const [activeSectionTitle, setActiveSectionTitle] = useState("all_games");
  const [isAnyCategorySelected, setIsAnyCategorySelected] = useState(false);
  const [selectedProviderOrSection, setSelectedProviderOrSection] =
    useState(false);

  const dispatch = useDispatch();
  const closeFilters = () => dispatch(setFiltersOpened(null));
  // eslint-disable-next-line
  const [searchTitle, setSearchTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const deviceInfo = new device();
  const [selectedProducer, setSelectedProducer] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  // eslint-disable-next-line
  const { isFetching, isUninitialized, error, data } = useGetGamesQuery(
    {
      device: deviceInfo.type,
      page: currentPage,
      per_page: 28,
      producer: selectedProducer.join(","),
      title:
        searchTitle.length > 2 || searchTitle.length === 0 ? searchTitle : null,
      category: selectedSection.join(","),
    },
    {
      skip: !filterIsOpened,
    }
  );

  const [searchFocused, setFocused] = useState(false);
  const [items, setItems] = useState();
  const isSafari =
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome");
  const { isMobile } = deviceInfo;

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

  useEffect(() => {
    if (filterIsOpened === null) {
      setSelectedProducer([]);
      setSelectedSection([]);
      setSearchTitle("");
      setSearch("");
      setOpenSearch(false);
      setFocused(false);
    } else {
      setSelectedProducer(filterIsOpened.selectedProducer || []);
      setSelectedSection(filterIsOpened.selectedSection || []);
      setSearchTitle(filterIsOpened.searchTitle || "");
    }
  }, [filterIsOpened]);

  useEffect(() => {
    if (clickLogo && filterIsOpened === null) {
      setOpenSearch(false);
      dispatch(setClickLogo(false));
    }
  }, [clickLogo, filterIsOpened]);

  useEffect(() => {
    if (currentPage > 1) {
      setItems([...items, ...data?.data]);
    } else {
      setItems(data?.data);
    }
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (searchTitle || selectedSection.length || selectedProducer.length) {
      dispatch(
        setFiltersOpened({ searchTitle, selectedSection, selectedProducer })
      );
    }
    if (!searchTitle && !selectedSection.length && !selectedProducer.length) {
      closeFilters();
    }
    // eslint-disable-next-line
  }, [searchTitle, selectedSection, selectedProducer]);

  useEffect(() => {
    let delayApply;

    if (!isFetching) {
      delayApply = setTimeout(() => {
        setSearchTitle(search);
      }, 1000);
    }

    return () => clearTimeout(delayApply);
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    if (selectedProducer.length === 0 || selectedSection.length === 0) {
      setSelectedProviderOrSection(false);
    } else {
      setSelectedProviderOrSection(true);
    }
  }, [selectedProducer, selectedSection]);

  useEffect(() => {
    setIsThemesCategory(location.pathname.includes("themes"));
    setIsLastPlayedCategory(location.pathname.includes("last-played"));
    setIsFavoritesCategory(location.pathname.includes("favorites"));

    if (sortedSections) {
      const activeSection = sortedSections.find((section) =>
        location.pathname.includes(section.title)
      );
      setActiveSectionTitle(activeSection?.title);
      setIsAnyCategorySelected(
        location.pathname !== "/games" && location.pathname !== "/games/"
      );
    }
  }, [location.pathname, sortedSections]);

  useEffect(() => {
    if (filterIsOpened) {
      window.closeSplash();
    }
  }, [filterIsOpened]);

  useEffect(() => {
    if (openSearch) {
      dispatch(setPlaseHolderInputProduserFilter(true));
    } else {
      dispatch(setPlaseHolderInputProduserFilter(false));
    }
  }, [openSearch]);

  useEffect(() => {
    if ((!isTablet || isMobile) && searchFocused) {
      setOpenSearch(true);
    }
  }, [searchFocused]);

  return (
    <div className={classNames(css.wraper, css[variant])}>
      <div
        className={classNames(css.container, {
          [css.container_open]: isMobile && openSearch,
        })}
      >
        <div className={css.games_block}>
          {
            <>
              {!isTablet &&
                sortedSections?.map((section, index) => {
                  const isCurrentSectionSelected = location.pathname.includes(
                    section.title
                  );

                  return (
                    <React.Fragment key={`section-${section.id}`}>
                      <NavLink
                        exact={true}
                        to={`/games/${section.title}`}
                        className={classNames(css.game_category, {
                          [css.game_category__hidden]:
                            openSearch && isAnyCategorySelected,
                        })}
                        activeClassName={css.active_filter}
                        onClick={(e) => {
                          if (isCurrentSectionSelected) {
                            e.preventDefault();
                          } else {
                            window.openSplash();
                          }
                        }}
                      >
                        <img
                          src={icons[section.title]}
                          className={css.game_svg}
                          alt=""
                        />
                        <span className={css.title}>{t(section.title)}</span>
                      </NavLink>
                      {index === 4 && (
                        <NavLink
                          to="/games/themes"
                          key={`themes-${index}`}
                          onClick={() => {
                            window.openSplash();
                          }}
                          className={classNames(css.game_category, {
                            [css.game_category__hidden]:
                              openSearch &&
                              isAnyCategorySelected &&
                              !isThemesCategory,
                          })}
                          activeClassName={css.active_filter}
                        >
                          <img src={thems} className={css.game_svg} alt="" />
                          <span className={css.title}>{t("themes")}</span>
                        </NavLink>
                      )}
                    </React.Fragment>
                  );
                })}
              {(!isTablet || !isMobile) && (
                <NavLink
                  exact={true}
                  to={`/games/all_games`}
                  className={classNames(css.game_category, {
                    [css.game_category__hidden]:
                      (!openSearch && isAnyCategorySelected) ||
                      (openSearch &&
                        (activeSectionTitle ||
                          isThemesCategory ||
                          isFavoritesCategory ||
                          isLastPlayedCategory)),
                  })}
                  activeClassName={css.active_filter}
                  onClick={() => {
                    window.openSplash();
                  }}
                >
                  <img
                    src={icons["all_games"]}
                    className={css.game_svg}
                    alt=""
                  />
                  <span className={css.title}>{t("all_games")}</span>
                </NavLink>
              )}
            </>
          }
          {auth?.user && !isTablet && !isiMac13 && (
            <>
              <NavLink
                onClick={() => {
                  window.openSplash();
                }}
                to="/games/user/favorites"
                className={classNames(css.game_category, {
                  [css.game_category__hidden]:
                    openSearch && !isFavoritesCategory,
                })}
                activeClassName={css.active_filter}
              >
                <img src={favorite} className={css.game_svg} alt="" />
                <span className={css.title}>{t("favorite_games")}</span>
              </NavLink>
              <NavLink
                onClick={() => {
                  window.openSplash();
                }}
                to="/games/user/last-played"
                className={classNames(css.game_category, {
                  [css.game_category__hidden]:
                    openSearch && !isLastPlayedCategory,
                })}
                activeClassName={css.active_filter}
              >
                <img src={last_played} className={css.game_svg} alt="" />
                <span className={css.title}>{t("last")}</span>
              </NavLink>
            </>
          )}
        </div>
        <div className={css.search_block}>
          <Input
            isSearch={true}
            loading={isFetching && searchTitle.length > 2}
            value={search}
            onChange={setSearch}
            type={"text"}
            onFocus={() => setFocused(true)}
            onBlur={() => !search.length && setFocused(false)}
            className={classNames(css.filters__search, {
              [css.filters__focused]: searchFocused,
              [css.safari]: isSafari,
            })}
            placeholder={t("Search")}
          />
          <div
            className={css.filter_seach__open}
            onClick={() => {
              setOpenSearch(!isTablet || isMobile ? !openSearch : false);
            }}
          />
          {
            <div
              className={classNames(css.filter_categories, {
                [css.filter_categories_hiden]: !openSearch,
              })}
            >
              <Select
                options={
                  sections
                    ? sections.map((section) => ({
                        value: section?.title || "",
                        label: t(section?.title || ""),
                      }))
                    : []
                }
                placeholder={t("categories")}
                value={selectedSection[0] || ""}
                onChange={(selectedOption) => {
                  const selectedValue = selectedOption.value;
                  if (selectedSection.includes(selectedValue)) {
                    const updatedSelectedSection = selectedSection.filter(
                      (value) => value !== selectedValue
                    );
                    setSelectedSection(updatedSelectedSection);
                  } else {
                    setSelectedSection([selectedValue]);
                  }
                }}
                noOptionsMessage={() => t("categories")}
                variant="search"
              />
              <ProducerSelector
                setSelectedProducer={setSelectedProducer}
                selectedProducer={selectedProducer}
              />
            </div>
          }
        </div>
      </div>
      <div
        className={classNames(
          "container-full",
          { container: isMobile },
          css.container__games
        )}
      >
        {(!!filterIsOpened && !!search) ||
        (!!filterIsOpened && openSearch) ||
        (!!filterIsOpened && isTablet && selectedProviderOrSection) ||
        (!!filterIsOpened && isMobile && selectedProviderOrSection) ? (
          <Games
            showMore={
              currentPage === data?.last_page || !data
                ? null
                : () => {
                    setCurrentPage(currentPage + 1);
                  }
            }
            isLoading={isFetching}
            games={items}
            currentPage={currentPage}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function Games({ games, showMore, isLoading, ...props }) {
  let { currentPage } = props;
  const auth = useAuth();
  const history = useHistory();
  const deviceInfo = new detectDevice();
  const isMobile = useMediaQuery("(max-width: 768px)") || deviceInfo.isMobile;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let sliced = games;

  if (isLoading && currentPage > 1) {
    currentPage = currentPage - 1;
  }

  if (showMore) {
    sliced = games?.slice(
      0,
      currentPage === 1 ? 27 : (currentPage - 1) * 28 + 27
    );
  }

  const content = (
    <div className={css.games__wrapper}>
      {sliced?.map((game) => (
        <GameItem
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
          key={`game-${game.id}`}
          item={game}
        />
      ))}
    </div>
  );

  useEffect(() => {
    if (sliced?.length) {
      window.closeSplash();
    }
  }, [sliced]);

  return (
    <div className={css.games}>
      {isLoading ? (
        <Loader />
      ) : games?.length === 0 ? (
        t("Nothing found")
      ) : (
        content
      )}
    </div>
  );
}
