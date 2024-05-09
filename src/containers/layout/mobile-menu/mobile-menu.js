import css from "./mobile-menu.module.css";
import { useAuth } from "../../../services/auth";
import classNames from "classnames";
import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { setOpenNotification } from "../../../app/app.slice";
import home from "../../../images/mobile-menu/home.svg";
import homeActive from "../../../images/mobile-menu/home-active.svg";
import searchBottom from "../../../images/mobile-menu/search-bottom-mobile.svg";
import wallet from "../../../images/mobile-menu/wallet.svg";
import walletActive from "../../../images/mobile-menu/wallet-active.svg";
import bonus from "../../../images/mobile-menu/bonus.svg";
import bonusActive from "../../../images/mobile-menu/bonus-active.svg";
import notification from "./../../../images/mobile-menu/notifications.svg";
import notificationActive from "./../../../images/mobile-menu/notifications-active.svg";
import { useGetActiveBonusQuery } from "../../../app/api/bonus.api";
import {setGame, setOpenSearchGame} from "../../../features/games/game.slice";

export default function MobileMenu() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const openSearchGame = useSelector((state) => state.game.openSearchGame);
  const { t } = useTranslation();
  const {
    data: activeBonus,
    // eslint-disable-next-line
    isLoading: fetchingActiveBonus,
    // eslint-disable-next-line
    error,
  } = useGetActiveBonusQuery();
  const notificationsSelectorOpen = useSelector(
    (state) => state.app.openNotification
  );
  const notifications = useSelector((state) => state.app.notifications);
  const notificationCount = notifications.length;

  return (
    <div
      className={classNames(css.mobile_menu, "container", "container-full", {
        [css.authorized]: !auth?.user,
      })}
    >
      {auth?.user ? (
        <div className={css.mobile_menu__profile}>
          <NavLink
            to={"/"}
            exact={true}
            onClick={() => dispatch(setGame(null))}
            className={classNames(
              css.mobile_menu__profileLink,
              css.mobile_menu__main
            )}
            activeClassName={!notificationsSelectorOpen ? css.active : ""}
          >
            <img src={home} alt="" className={css.mobile_menu__profileIcon} />
            <div className={css.main_wrapper__icon}>
              <img
                src={homeActive}
                alt=""
                className={css.mobile_menu__profileIconActive}
              />
            </div>
            <span className={css.title}>{t("lobby")}</span>
          </NavLink>
          <NavLink
            to={!!activeBonus ? "/my-bonus" : "/my-bonus/available"}
            exact={true}
            className={classNames(
              css.mobile_menu__profileLink,
              css.mobile_menu__bonus
            )}
            activeClassName={!notificationsSelectorOpen ? css.active : ""}
            onClick={() => {}}
          >
            <img src={bonus} alt="" className={css.mobile_menu__profileIcon} />
            <div className={css.bonus_wrapper__icon}>
              <img
                src={bonusActive}
                alt=""
                className={css.mobile_menu__profileIconActive}
              />
            </div>
            <span className={css.title}>{t("bonus")}</span>
          </NavLink>
          <div
            className={classNames(
              css.mobile_menu__profileLink,
              css.mobile_menu__mainProfile
            )}
            activeClassName={!notificationsSelectorOpen ? css.active : ""}
            onClick={() => {
              dispatch(setOpenSearchGame(!openSearchGame));
            }}
          >
            <div className={css.profile_wrapper__icon}>
              <img src={searchBottom} className={css.profile_img} alt="" />
            </div>
            <span className={classNames(css.title, css.title_profile)}>
              {t("Search")}
            </span>
          </div>
          <div
            onClick={() =>
              dispatch(setOpenNotification(!notificationsSelectorOpen))
            }
            data-custom-attribute="notification"
            className={classNames(
              css.mobile_menu__profileLink,
              css.mobile_menu__notification,
              { [css.active]: notificationsSelectorOpen }
            )}
          >
            <img
              src={notification}
              alt=""
              className={css.mobile_menu__profileIcon}
            />
            <div className={css.notification_wrapper__icon}>
              <img
                src={notificationActive}
                alt=""
                className={css.mobile_menu__profileIconActive}
              />
            </div>
            {Boolean(notificationCount) && (
              <div className={css.svg_circle}>
                {/*<span className={css.svg_circle__text}>*/}
                  {/*{notificationCount}*/}
                {/*</span>*/}
              </div>
            )}
            <span className={css.title} data-custom-attribute="notification">
              {t("notification")}
            </span>
          </div>
          <NavLink
            to="/wallet"
            exact={true}
            className={classNames(
              css.mobile_menu__profileLink,
              css.mobile_menu__wallet
            )}
            activeClassName={!notificationsSelectorOpen ? css.active : ""}
            onClick={() => {}}
          >
            <img src={wallet} className={css.mobile_menu__profileIcon} alt="" />
            <div className={css.wallet_wrapper__icon}>
              <img
                src={walletActive}
                className={css.mobile_menu__profileIconActive}
                alt=""
              />
            </div>
            <span className={css.title}>{t("wallet")}</span>
          </NavLink>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
