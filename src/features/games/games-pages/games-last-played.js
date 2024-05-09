import GamesWrapper from "../games-wrapper/games-wrapper";
import React, {useEffect, useState} from "react";
import {useFetchLastPlayedQuery} from "../../../app/api/games.api";
import GamesBlock from "../games-block/games-block";
import {returnScrollPosition} from "../../../components/scrollbar/scrollbar";

export default function LastPlayed() {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data,
        isFetching,
        isUninitialized,
        error
    } = useFetchLastPlayedQuery({page: currentPage, limit: 24});
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
        if ((data || error) && (!savedPage || isNaN(savedPage))) {
            window.closeSplash();
        }

        if (data) {
            if (currentPage > 1) {
                const filtred = data.data.filter(newItem => !list.find(item => item.id === newItem.id));
                setList([...list, ...filtred]);
            } else {
                setList(data.data);
            }
        }
    }, [data, error]);

    return <GamesWrapper isFetching={isFetching && currentPage === 1} isUninitialized={isUninitialized}>
        {
            (!isFetching && currentPage === 1 || currentPage !== 1)
            &&
            !isUninitialized &&
            !error
            && list &&
            <GamesBlock
                currentPage={currentPage}
                games={list}
                total={data?.total}
                isLoading={isFetching}
                showMoreAction={currentPage < data.last_page ? () => setCurrentPage(currentPage + 1) : null}
            />
        }
    </GamesWrapper>;
}