import GamesWrapper from "../games-wrapper/games-wrapper";
import React, {useEffect, useState} from "react";
import {useFetchFavoritesQuery, useFetchLastPlayedQuery, useGetGamesWithSectionsQuery} from "../../../app/api/games.api";
import device from "../../../utils/detect-device";
import {useParams} from "react-router-dom";
import GamesBlock from "../games-block/games-block";
import {returnScrollPosition} from "../../../components/scrollbar/scrollbar";

export default function Favorites() {
    const deviceInfo = new device();
    const [currentPage, setCurrentPage] = useState(1);
    const {data: favorites, isFetching, error, isUninitialized} = useFetchFavoritesQuery({
        device: deviceInfo.type,
        page: currentPage,
        per_page: 24
    });
    const savedPage = parseInt(localStorage.getItem("pageSection"));
    const [list, setList] = useState(false);

    useEffect(() => {
        if (!isNaN(savedPage) && savedPage !== currentPage && !isFetching) {
            setCurrentPage(currentPage + 1);
        }
        if (!isNaN(savedPage) && savedPage === currentPage && !isFetching) {
            localStorage.removeItem("pageSection")
            returnScrollPosition();
            window.closeSplash();
        }
    }, [isFetching]);

    useEffect(() => {
        if ((favorites || error) && (!savedPage || isNaN(savedPage))) {
            window.closeSplash();
        }
        if (favorites) {
            if (currentPage > 1) {
                const filtred = favorites.data.filter(newItem => !list.find(item => item.id === newItem.id));
                setList([...list, ...filtred]);
            } else {
                setList(favorites.data);
            }
        }
    }, [favorites, error]);

    return <GamesWrapper isFetching={isFetching && currentPage === 1} isUninitialized={isUninitialized}>
        {
            (!isFetching && currentPage === 1 || currentPage !== 1)
            &&
            !isUninitialized &&
            !error
            && list &&
            <GamesBlock
              total={favorites?.total}
              currentPage={currentPage}
              games={list}
              isLoading={isFetching}
              showMoreAction={currentPage < favorites.last_page ? () => setCurrentPage(currentPage + 1) : null}
            />
        }
    </GamesWrapper>;
}