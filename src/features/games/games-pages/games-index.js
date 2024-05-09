import GamesBlock from "../games-block/games-block";
import React, {useEffect, useMemo} from "react";
import {useFetchSectionsQuery, useGetGamesMainSectionsQuery} from "../../../app/api/games.api";
import device from "../../../utils/detect-device";
import GamesWrapper from "../games-wrapper/games-wrapper";
import {useHistory} from "react-router-dom";

/**
 *   @Component
 *   Компонент отрисовывающий главную страницу
 *   Данные для этой страницы запрашиваются по запросу `/game/list-limit-section-main?device=${device}` + filters; метод RTK: getGamesMainSections
 *  Страница содержит несколько <GamesBlock/> в каждом из которых отображаются игры категории
 *
 * */


export default function IndexGames() {
    const deviceInfo = new device();
    const {data: sections} = useFetchSectionsQuery();
    const querySections = useMemo(() => {
        if (sections) {
            return sections.filter(section => section.title !== "bonus_buy").map(section => section.title).join(",")
        }
    }, [sections]);

    const {isFetching, isUninitialized, error, data} = useGetGamesMainSectionsQuery({
        device: deviceInfo.type,
        per_page: 26,
        sections: querySections
    }, {skip: !querySections});
    const history = useHistory();

    useEffect(() => {
        if (data || error) {
            window.closeSplash();
        }
    }, [data, error]);

    return <GamesWrapper isFetching={isFetching} isUninitialized={isUninitialized}>
        {
            !isFetching && !isUninitialized && !error && Object.keys(data).filter(key => data[key].length)?.map(key =>
                <GamesBlock
                    games={data[key]}
                    categoryName={key}
                    key={key}
                    showMoreAction={
                        data[key].length === 26 ?
                            () => {
                                localStorage.setItem("pageSection", 2);
                                localStorage.setItem("scrollPosition", 60000);
                                history.push(`/games/${key}`);
                            }
                            : null
                    }
                />
            )
        }
    </GamesWrapper>
}