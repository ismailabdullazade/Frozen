import React, {useEffect, useRef} from "react";
import Scrollbar from "../../../components/scrollbar/scrollbar";

export default function ScrollFunction ({className, children, isLoading, currentPage, setCurrentPage, allGames}) {

    const gameList = useRef();
    // if (gameList.current) {
    //
    //     gameList.current.onscroll = ev => {
    //         if (
    //             (ev.target.scrollHeight - ev.target.scrollTop) < (ev.target.offsetHeight + 50)
    //             && !isLoading
    //             && currentPage < allGames.last_page
    //         ) {
    //
    //             setCurrentPage(currentPage + 1);
    //         }
    //     }
    // }
    //
    // useEffect(() => {
    //
    //
    //     return () => gameList.current ? gameList.current.onscroll = null : null;
    // }, []);

    return  (
        <Scrollbar
            onScroll={ev => {
                if (
                    (ev.target.scrollHeight - ev.target.scrollTop) < (ev.target.offsetHeight + 50)
                    && !isLoading
                    && currentPage < allGames.last_page
                ) {

                    setCurrentPage(currentPage + 1);
                }
            }}
            style={{height: "100%"}}
            // className={}
        >
            <div className={className}>
                {children}
            </div>

        </Scrollbar>
    )

    return (
        <div ref={gameList} className={className}>
            {children}
        </div>
    )
}