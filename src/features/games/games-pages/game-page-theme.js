import GamesWrapper from "../games-wrapper/games-wrapper";
import { returnScrollPosition } from "../../../components/scrollbar/scrollbar";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import GamesBlock from "../games-block/games-block";
import { useFetchThemeQuery } from "../../../app/api/games.api";

export default function PageTheme() {
  const [currentPage, setCurrentPage] = useState(1);
  const { pathname } = useLocation();
  const params = useParams();
  const urlTitle = pathname.split("/")[3];
  const themesList = {
    ancient_civilizations: 'Ancient civilizations',
    books: 'Books',
    fantasy: 'Fantasy',
    food_sweets: 'Food & Sweets',
    fruits: 'Fruits',
    girls: 'Girls',
    holidays: 'Holidays',
    horrors: 'Horrors',
    joker: 'Joker',
    luxury_life: 'Luxury life',
    military: 'Military',
    party: 'Party',
    pirates: 'Pirates',
    retro: 'Retro',
    space: 'Space',
    sport: 'Sport',
    underwater_world: 'Underwater world',
    world_regions: 'World regions',
  };
  const title = themesList[urlTitle]; 
  const page = currentPage;

  const { data, isFetching, isUninitialized, error } = useFetchThemeQuery({title, page, limit: 24});
  const [list, setList] = useState(false);
  const savedPage = parseInt(localStorage.getItem("pageTheme"));

  useEffect(() => {
    if ((data || error) && (!savedPage || isNaN(savedPage))) {
        window.closeSplash();
    }
    if (data) {
        if (currentPage > 1 && list) {
            setList([...list, ...data.data]);
        } else {
            setList(data.data);
        }
    }
    }, [data, error]);

    useEffect(() => {
        if (!isNaN(savedPage) && savedPage !== currentPage) {
        } else {
            setCurrentPage(1);
        }
    }, [params?.theme]);

useEffect(() => {
    if (!isNaN(savedPage) && savedPage !== currentPage && !isFetching) {
        setCurrentPage(currentPage + 1);
    }
    if (!isNaN(savedPage) && savedPage === currentPage && !isFetching) {
        localStorage.removeItem("pageTheme")
        returnScrollPosition();
        window.closeSplash();
    }
}, [currentPage, isFetching]);

  return (
    <GamesWrapper isFetching={isFetching && currentPage === 1} isUninitialized={isUninitialized}>
        {
            (!isFetching && currentPage === 1 || currentPage !== 1) && !isUninitialized && !error && list && (
                <GamesBlock
                    games={list} 
                    total={data?.total}
                    isLoading={isFetching}
                    currentPage={currentPage}
                    categoryName={themesList[urlTitle]}
                    showMoreAction={currentPage < data.last_page ? () => setCurrentPage(currentPage + 1) : null}
                />
        )}
    </GamesWrapper>
  )
}
