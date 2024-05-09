import { useTranslation } from "react-i18next";
import css from "./my-bonus.module.css";
import ContentPane from "../../components/content-pane/content-pane";
import classNames from "classnames";
import Active from "./active/active";
import History from "./history/history"
import AvailableBonuses from "./available-bonuses/available-bonuses";
import PromoCode from "./promo-code/promo-code";
import { useHistory } from "react-router-dom";
import leftArrow from "./../../images/bonuses/arrow-left.svg"
import rightArrow from "./../../images/bonuses/arrow-right.svg"
import { useEffect, useRef, useState } from "react";

const components = { Active, History, AvailableBonuses, PromoCode };

export default function MyBonus(props) {
    const { tab = "Active" } = props;
    const { t } = useTranslation();
    const TabContent = components[tab];
    const history = useHistory();
    const [scroll, setScroll] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);

    const menuRef = useRef(null);
    const availableRef = useRef(null);
    const activeRef = useRef(null);
    const historyRef = useRef(null);

    const handleScroll = event => {
        setScroll(event.target.scrollLeft);
        setMaxScroll(event.target.scrollWidth - event.target.clientWidth);
    };

    const scrollToMenu = (scrollLeft) => {
        if (menuRef.current) {
            menuRef.current.scrollLeft = scrollLeft;
        }
    }

    useEffect(() => {
        const { state } = history.location;
        if (state && state.scrollLeft !== undefined) {
            scrollToMenu(state.scrollLeft);
        } else {
            scrollToMenu(0);
        }
    }, [history.location.pathname]);

    const handleMenuItemClick = (scrollLeft, path) => {
        history.push(path, { scrollLeft });
    }

    return (
        <ContentPane className={css.my_bonus} paneClass={css.pane}>
            <div className={css.menu} onScroll={handleScroll} ref={menuRef}>
                <div
                    className={classNames(css.menu_item, {[css.active]: tab === "Active"})}
                    onClick={() => {
                        const scrollLeft = activeRef.current.offsetLeft - (menuRef.current.clientWidth - activeRef.current.clientWidth) / 2;
                        handleMenuItemClick(scrollLeft, "/my-bonus");
                    }}
                    ref={activeRef}
                >
                    {t("Active bonus")}
                </div>
                <div
                    className={classNames(css.menu_item, {[css.active]: tab === "AvailableBonuses"})}
                    onClick={() => {
                        const scrollLeft = availableRef.current.offsetLeft - (menuRef.current.clientWidth - availableRef.current.clientWidth) / 2;
                        handleMenuItemClick(scrollLeft, "/my-bonus/available");
                    }}
                    ref={availableRef}
                >
                    {t("Available bonuses")}
                </div>
                <div
                    className={classNames(css.menu_item, {[css.active]: tab === "PromoCode"})}
                    onClick={() => {
                        handleMenuItemClick(0, "/my-bonus/promocode");
                    }}
                >
                    {t("Promo code")}
                </div>
                <div
                    className={classNames(css.menu_item, {[css.active]: tab === "History"})}
                    onClick={() => {
                        const scrollLeft = historyRef.current.offsetLeft - (menuRef.current.clientWidth - historyRef.current.clientWidth) / 2;
                        handleMenuItemClick(scrollLeft, "/my-bonus/history");
                    }}
                    ref={historyRef}
                >
                    {t("History")}
                </div>
            </div>
            <TabContent setTab={tab => {
                if (tab === "History") {
                    handleMenuItemClick(0, "/my-bonus/history");
                }
                if (tab === "Active") {
                    handleMenuItemClick(0, "/my-bonus");
                }
                if (tab === "AvailableBonuses") {
                    handleMenuItemClick(0, "/my-bonus/available");
                }
                if (tab === "PromoCode") {
                    handleMenuItemClick(0, "/my-bonus/promocode");
                }
            }}/>
        </ContentPane>
    )
}
