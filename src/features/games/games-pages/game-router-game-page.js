import {Redirect, useParams} from "react-router-dom";
import Favorites from "./games-favorites";
import React from "react";
import LastPlayed from "./games-last-played";
import GamesSection from "./games-section";
import ThemesGames from "./games-themes";
import PageTheme from "./game-page-theme";

export default function GameRouterGamePage() {
    
    const params = useParams();
    if (params === `/`) {
        return <Redirect to={{
            pathname: "/",
            state: { }
        }}/>
    }
    if (params.section === "themes") {
        if (params.target) {
            return (
                    <PageTheme />
            );
        } else {
            return (
                    <ThemesGames />
            );
        }
    }
    
    switch (params.section) {
        case "user" :
            if (params.target === "favorites") {
                return <Favorites/>
            }
            if (params.target === "last-played") {
                return <LastPlayed/>
            }
            return <Redirect to={{
                pathname: "/",
                state: { }
            }}/>;
            
        default:

        return <GamesSection/>
    }
}