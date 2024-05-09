import css from "./mobile-game-menu.module.css";
import arrow from "./../../../images/arrow_game_menu.svg";
import {useTranslation} from "react-i18next";
import Balance from "../../../features/user/balance-2/balance";
import {ReactComponent as BurgerOpen} from "../../../images/header/burger.svg"
import {ReactComponent as BurgerClosed} from "../../../images/header/burger_close.svg"
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../../../app/app.slice";
import Sidebar from "../sidebar";
import { setGame } from "../../../features/games/game.slice";

export default function MobileGameMenu() {
    const {t} = useTranslation();
    const openSidebar = useSelector(state => state.app.openSidebar);
    const dispatch = useDispatch();

    return (
        <div className={css.menu}>
            <div className={css.menu_back} onClick={() => dispatch(setGame(null))}>
                <img src={arrow} alt="" />
                <span className={css.menu_back__text}>{t("back")}</span>
            </div>
            <Balance />
            <div onClick={() => dispatch(setOpenSidebar(!openSidebar))} className={css.menu_burger}>
                {
                    openSidebar ? <BurgerClosed className={css.burger_menu} /> : <BurgerOpen className={css.burger_menu__hover} />
                }
            </div>
            <Sidebar variant={"game"} />
        </div>
    )
}

