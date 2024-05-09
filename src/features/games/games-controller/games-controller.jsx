import { useParams, useLocation } from "react-router-dom";
import Layout from "../../../containers/layout/layout";
import React, { useEffect, useMemo, useState } from "react";
import GamesWrapper from "../games-wrapper/games-wrapper";
import GamesBlock from "../games-block/games-block";
import GamesMenu from "../games-menu/games-menu";
import {
  useFetchSectionsQuery,
  useGetGamesMainSectionsQuery,
  useGetGamesQuery,
} from "../../../app/api/games.api";
import device from "../../../utils/detect-device";
import Favorites from "../games-pages/games-favorites";
import LastPlayed from "../games-pages/games-last-played";
import ThemesGames from "../games-pages/games-themes";
import PageTheme from "../games-pages/game-page-theme";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../game.slice";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useGetActiveBonusQuery } from "../../../app/api/bonus.api";
import ProvidersMain from "../../../components/providers-main/providers-main";
import { isEmptyFilters } from "../../../utils/validation";

/**
 *  @Component
 *  Компонент работает со страницой игр
 *  Этот компонент сам определяюет какой запрос сдеолать /list (для запроса игр секиции) или /list-limit-section-main для главной страницы.
 *  Также в запрос /list могут добавлены фильтры, если они были выбраны в <GamesMenu/>
 *  Выодит только <GamesMenu/>  и список игр полученный из одного из запросов
 *
 * */
export default function GamesController({
  hasLayout = true,
  variant: variantGameController,
}) {
  const params = useParams();
  const location = useLocation();
  const filters = useSelector((state) => state.game.filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeWager, setActiveWager] = useState();
  const [mainTheme, setMainTheme] = useState();
  const deviceInfo = new device();
  const { data: sections } = useFetchSectionsQuery();
  const querySections = useMemo(() => {
    if (sections) {
      return sections
        .filter((section) => section.title !== "bonus_buy")
        .map((section) => section.title)
        .join(",");
    }
  }, [sections]); //список всех категорий игр
  const { section: currentSection, target } = params;
  const indexPage = !querySections || !currentSection; //главная страница, если не передана категория
  const sectionPage = sections
    ?.map((section) => section.title)
    .includes(currentSection); //если страница категории игры
  const favoriteGamesPage = currentSection === "user" && target === "favorites";
  const lastPlayedGamesPage =
    currentSection === "user" && target === "last-played";
  const themesGamesPage = currentSection === "themes" && !target; //Если отрыта страница с выбором тем
  const themeGamesPage = currentSection === "themes" && target; //Если выбрана тема
  const dispatch = useDispatch();
  const history = useHistory();
  const { data: activeBonus } = useGetActiveBonusQuery();
  useEffect(() => {
    if (activeBonus?.active_wager?.active) {
      setActiveWager(true);
    } else {
      setActiveWager(false);
    }
  }, [activeBonus?.active_wager?.active]);

  const { isFetching: listIsLoading, data: gamesData } = useGetGamesQuery(
    {
      device: deviceInfo.type,
      page: currentPage,
      category:
        (filters?.producer || filters?.title) &&
        (currentSection === "themes" || currentSection === "user")
          ? null
          : filters?.section ||
            (currentSection === "all_games" ? null : currentSection),
      producer: filters?.producer,
      title: filters?.title?.length > 2 ? filters.title : null,
      per_page: 24,
      section: querySections === "theme" ? null : querySections,
    },
    { skip: !sectionPage && !filters }
  ); //Если категория игры не передана - значит это главная страница и этот запрос пропускается
  const [list, setlist] = useState([]); //тут будут храниться игры, полученные через запрос /list
  const {
    isFetching: mainIsLoading,
    isUninitialized,
    error,
    data: indexGames,
  } = useGetGamesMainSectionsQuery(
    {
      device: deviceInfo.type,
      per_page: 24,
      sections: querySections,
    },
    { skip: !querySections || !indexPage }
  ); //Пропустим этот запрос, если передана категория игры
  // eslint-disable-next-line
  const isFetching = useMemo(() => listIsLoading || mainIsLoading);

  useEffect(() => {

    dispatch({
      type: "GamesApi/invalidateTags",
      payload: ["GAMES_LIST"],
    });
    // eslint-disable-next-line
  }, [params]);

  useEffect(() => {
    setlist([]);
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    setlist([]);
    setCurrentPage(1);
    if (isEmptyFilters(filters)) {
      dispatch(setFilters(null));
    }
  }, [currentSection]);

  useEffect(() => {
    if (gamesData?.data) {
      setlist(list.concat(gamesData.data));
    }
    // eslint-disable-next-line
  }, [gamesData, gamesData?.total]);

  useEffect(() => {
    if (location.pathname === "/") {
      setMainTheme("main");
    } else {
      setMainTheme("");
    }
  }, [location.pathname]);

  return (
    <LayoutWrapper hasLayout={hasLayout}>
      <GamesMenu
        currentSection={currentSection}
        isFetching={isFetching}
        variant={variantGameController}
      />
      {(function () {
        if (!isEmptyFilters(filters)) {
          //Если были установлены фильтры, то не зависимо от  страницы будут показаны реузльтаты фильтров
          return (
            <GamesWrapper isFetching={isFetching} isUninitialized={false}>
              <GamesBlock
                games={list}
                isLoading={isFetching}
                currentPage={currentPage}
                total={gamesData?.total}
                categoryName={filters?.section}
                showMoreAction={
                  currentPage < gamesData?.last_page
                    ? () => setCurrentPage(currentPage + 1)
                    : null
                }
              />
            </GamesWrapper>
          );
        } else {
          if (favoriteGamesPage) {
            //запрос на получение списка игр происходит внутри этого компонента
            return <Favorites />;
          }

          if (lastPlayedGamesPage) {
            //запрос на получение списка игр происходит внутри этого компонента
            return <LastPlayed />;
          }

          if (themeGamesPage) {
            //запрос на получение списка игр происходит внутри этого компонента
            return <PageTheme />;
          } else {
            return (
              <GamesWrapper isFetching={isFetching} isUninitialized={false}>
                {
                  themesGamesPage && <ThemesGames key="themesGames" /> //запрос тем происходит внтури этого компонента
                }
                {indexPage &&
                  indexGames &&
                  Object.keys(indexGames)
                    .sort((a, b) => {
                      if (a === "all_games" && b !== "all_games") {
                        return 1;
                      }
                      if (a !== "all_games" && b === "all_games") {
                        return -1;
                      }
                      return 0;
                    })
                    .map((section, index, array) => {
                      if (section === "live_games" && activeWager) {
                        return null;
                      }
                      if (section === "new_games") {
                        return (
                          <React.Fragment key={`section-${section}`}>
                            <ProvidersMain
                              variant={mainTheme}
                              key="providersMain"
                            />
                            <GamesBlock
                              games={indexGames[section]}
                              isLoading={isFetching}
                              categoryName={section}
                              key={`section-${section}`}
                              showAllButton={true}
                              indexPage={indexPage}
                            />
                            <ThemesGames variant={mainTheme} />
                          </React.Fragment>
                        );
                      }
                      if (section === "live_games") {
                        return (
                          <React.Fragment key={`section-${section}`}>
                            <GamesBlock
                              games={indexGames[section]}
                              isLoading={isFetching}
                              categoryName={section}
                              key={`section-${section}`}
                              showAllButton={true}
                              indexPage={indexPage}
                            />
                          </React.Fragment>
                        );
                      }
                      return (
                        <React.Fragment key={`section-${section}`}>
                          <GamesBlock
                            games={indexGames[section]}
                            isLoading={isFetching}
                            categoryName={section}
                            key={`section-${section}`}
                            showAllButton={true}
                            indexPage={indexPage}
                          />
                        </React.Fragment>
                      );
                    })}
                {sectionPage && (
                  <GamesBlock
                    games={list}
                    isLoading={isFetching}
                    currentPage={currentPage}
                    total={gamesData?.total}
                    categoryName={params?.section}
                    showMoreAction={
                      currentPage < gamesData?.last_page
                        ? () => setCurrentPage(currentPage + 1)
                        : null
                    }
                  />
                )}
              </GamesWrapper>
            );
          }
        }
      })()}
    </LayoutWrapper>
  );
}

const LayoutWrapper = ({ hasLayout, children }) =>
  hasLayout ? <Layout fullWidth={true}>{children}</Layout> : <>{children}</>;
