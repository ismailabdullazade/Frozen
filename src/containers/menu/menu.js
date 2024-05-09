import css from "./menu.module.css";
import classNames from "classnames";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import { useTranslation } from "react-i18next";
import React from "react";
import LanguageDrop from "./../layout/language-drop/language-drop";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import search from "./../../images/items/search-white.svg";
import { setOpenSearchGame } from "../../features/games/game.slice";
import Search from "../../components/search/search";

export default function Menu() {
  const isMobile = useMediaQuery("(max-width: 960px)");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const openSearchGame = useSelector((state) => state.game.openSearchGame);

  return (
    <menu className={css.menu}>
      <div className={css.container}>
        <div className={css.app_menu}>
          <div
            className={css.search}
            onClick={() => {
              dispatch(setOpenSearchGame(!openSearchGame));
            }}
          >
            <img src={search} alt="" />
          </div>
          <Search />
          {!isMobile && <LanguageDrop />}
          {!isMobile && (
            <div className={css.menu_link_block}>
              <NavLink to={"/free-money"}>
                <span>{t("free money")}</span>
              </NavLink>
              <NavLink to={"/ranks"}>
                <span>{t("Cashback and ranks")}</span>
              </NavLink>
              <NavLink to={"/vip"}>
                <span>{t("VIP club")}</span>
              </NavLink>
              <NavLink
                to={{ pathname: "https://garilla.partners/" }}
                target={"_blank"}
              >
                <span>{t("For partners")}</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </menu>
  );
}
