import React from 'react';
import css from "./category-icon.module.css";
import {useTranslation} from "react-i18next";
import  all_games from "../../images/games/index/all_games.svg";
import popular from "../../images/games/index/popular.svg";
import live_games from "../../images/games/live_games.svg";
import bonus_buy from "../../images/games/index/bonus_buy.svg";
import new_games from "../../images/games/index/new_games.svg";
export default function CategoryIconBackground (props) {
    let fillColor = "#31B5FF";
    let opacity = "0.1";
    let icon = all_games;
    const { t } = useTranslation();

    switch (props.category.title) {
        case "all_games":
            break;
        case "live_games":
            fillColor = "#FF1F6F";
            opacity = "0.3"
            icon = live_games;
            break;
        case "new_games":
            fillColor = "#08C7D3";
            opacity = "0.12"
            icon = new_games;
            break;
        case "popular":
            fillColor = "#FFC01F";
            icon = popular;
            break;
        case "bonus_buy":
            fillColor = "#3646DE";
            icon = bonus_buy;
            break;
        default:
            break;
    }

    return (
        <div className={css.category_item}>
            <svg width="144" height="144" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0.999996C0 0.447711 0.447715 0 1 0H107.586C107.851 0 108.105 0.105357 108.293 0.292893L143.707 35.7071C143.895 35.8946 144 36.149 144 36.4142V143C144 143.552 143.552 144 143 144H0.999996C0.447711 144 0 143.552 0 143V0.999996Z" fill={fillColor} fillOpacity={opacity}/>
            </svg>
            <div className={css.category_title}>
                <img  src={icon} alt=""/>
                <p>{t(props.category.title)}</p>
            </div>
        </div>
    );
}

