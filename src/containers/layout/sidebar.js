import React, { useEffect, useMemo, useState, useRef } from "react";
import css from "./layout.module.css";
import classNames from "classnames";
import LanguageDrop from "./language-drop/language-drop";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import GameSectionIcon from "./game-section-icon";
import { useGetActiveBonusQuery } from "../../app/api/bonus.api";
import { setOpenSidebar } from "../../app/app.slice";
import useOnClickOutside from "../../utils/click-outside";
import { setGame } from "../../features/games/game.slice";

import { ReactComponent as ThemesSvg } from "../../images/header/left-menu/themes.svg";
import { ReactComponent as FavoriteGamesSvg } from "../../images/games/favorite_games.svg";
import { ReactComponent as LastPlayedSvg } from "../../images/games/last_played.svg";
import { ReactComponent as FreeMoneySvg } from "../../images/free-money.svg";
import { ReactComponent as RanksSvg } from "../../images/cash_ranks.svg";
import { ReactComponent as ProfileSvg } from "../../images/header/logo_player_big.svg";
import { ReactComponent as VipSvg } from "../../images/vip_club_new.svg";
import { ReactComponent as PartnersSvg } from "../../images/header/left-menu/partners_new.svg";
import { ReactComponent as TelegramSvg } from "../../images/header/left-menu/tg_white.svg";
import { ReactComponent as VkSvg } from "../../images/header/left-menu/vk_white.svg";
import { ReactComponent as InstSvg } from "../../images/header/left-menu/inst_white.svg";

export default function Sidebar({ variant }) {
  const isMobile = useMediaQuery("(max-width: 960px)");
  const { t } = useTranslation();
  const auth = useAuth();
  const [gamesMenuOpened, setGamesMenuOpened] = useState(true);
  const [profileMenuOpened, setProfileMenuOpened] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [closeGame, setCloseGame] = useState(false);
  const [activeWager, setActiveWager] = useState();
  const iconContainerRef = useRef(null);
  const dispatch = useDispatch();
  const openSidebar = useSelector((state) => state.app.openSidebar);

  const { data: activeBonus } = useGetActiveBonusQuery();
  useEffect(() => {
    if (activeBonus?.active_wager?.active) {
      setActiveWager(true);
    } else {
      setActiveWager(false);
    }
  }, [activeBonus?.active_wager?.active]);

  useEffect(() => {
    if (!auth.user) {
      setProfileMenuOpened(false);
    }
  }, [auth.user]);
  useEffect(() => {
    const container = iconContainerRef.current;

    const checkOverflow = () => {
      if (container.scrollHeight > container.clientHeight + 30) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (gamesMenuOpened || profileMenuOpened) {
      setIsOverflowing(
        iconContainerRef.current.scrollHeight >
          iconContainerRef.current.clientHeight + 30
      );
    }
  }, []);

  const scrollToBottom = () => {
    if (iconContainerRef.current) {
      iconContainerRef.current.scrollTop =
        iconContainerRef.current.scrollHeight;
    }
  };
  const list = useRef();
  const bodyEl = document.querySelector("body");
  // useOnClickOutside(list, (event) => {
  //   bodyEl.classList.remove("noscroll");
  //   if (event.target.getAttribute("data-custom-attribute") === "burger") {
  //     return;
  //   }
  //   if (openSidebar) {
  //     dispatch(setOpenSidebar(false));
  //   }
  // });

  useEffect(() => {
    if (variant === "game") {
      setCloseGame(true);
    }
  }, [variant]);

  const itemClick = () => {
    dispatch(setOpenSidebar(false));
    !openSidebar
      ? bodyEl.classList.add("noscroll")
      : bodyEl.classList.remove("noscroll");
  };

  const status = useMemo(() => {
    const ranks = [
      "profile",
      "Player",
      "Knight",
      "Baron",
      "Viscount",
      "Earl",
      "Marquis",
      "Duke",
      "King",
      "God",
    ];
    if (auth.user === null || auth.user.rank_id === null) {
      return ranks[0];
    }
    return ranks[auth.user.rank_id];
  }, [auth.user]);
  const nick =
    auth.user === null
      ? ""
      : auth.user.nickname === null
        ? ""
        : " | " + auth.user.nickname;

  return (
    <div
      className={classNames(
        css.menu_left,
        { [css.menu_left__auth]: auth?.user },
        css[variant]
      )}
      ref={list}
    >
      <div
          onClick={() => {
            dispatch(setOpenSidebar(false));
          }}
          className={openSidebar ? css.paranja : ""}>
      </div>
      <div
        className={classNames(
          openSidebar ? css.menu_left_container : css.menu_left_container_open,
          { [css.menu_left_container_auth]: auth?.user },
          css.no_horizontal_scroll
        )}
      >
        <div
            style={{maxHeight: isOverflowing ? "970px" : "none"}}
            ref={iconContainerRef}
            className={classNames(
                openSidebar ? css.container_menu : css.container_menu_open,
                {[css.menu_left_container_auth]: auth?.user}
            )}
        >
          {auth?.user ? (
              <div className={css.profile_wraper}>
                <NavLink
                    to={"/profile"}
                    onClick={() => {
                      closeGame && dispatch(setGame(null));
                      itemClick();
                    }}
                    className={classNames(
                        openSidebar
                            ? (css.item, css.profile, css.profile_user)
                            : (css.item, css.profile_close)
                    )}
                    activeClassName={css.active}
                >
                  <ProfileSvg/>
                  <div>
                    <div
                        className={openSidebar ? css.title_open : css.title_close}
                    >
                      {auth.user.nickname}
                    </div>
                    <div
                        className={classNames(
                            css.sidebar_user_info,
                            openSidebar ? css.title_open : css.title_close
                        )}
                    >
                      <span>{t("rank")}</span>
                      <span>{t(status)}</span>
                    </div>
                  </div>
                </NavLink>
              </div>
          ) : (
              <div className={css.profile_wraper}>
                <div
                    className={classNames(
                        openSidebar
                            ? (css.item, css.profile_guest)
                            : (css.item, css.profile_close)
                    )}
                >
                  <ProfileSvg/>
                  <span
                      className={openSidebar ? css.title_open : css.title_close}
                  >
                  {t("Guest")}
                </span>
                </div>
              </div>
          )}

          <div>
            <NavLink
                to={"/games/popular"}
                onClick={() => itemClick()}
                className={classNames(
                    openSidebar ? (css.item, css.vip) : css.vip_close
                )}
                activeClassName={css.active}
            >
              <GameSectionIcon id="popular" className={css.game_svg}/>
              <span className={openSidebar ? css.title_open : css.title_close}>
                {t("popular")}
              </span>
            </NavLink>
          </div>

          <div>
            <NavLink
                to={"/games/new_games"}
                onClick={() => itemClick()}
                className={classNames(
                    openSidebar ? (css.item, css.vip) : css.vip_close
                )}
                activeClassName={css.active}
            >
              <GameSectionIcon id="new_games" className={css.game_svg}/>
              <span className={openSidebar ? css.title_open : css.title_close}>
                {t("new_games")}
              </span>
            </NavLink>
          </div>

          {!activeWager && (
              <div>
                <NavLink
                    to={"/games/live_games_"}
                    onClick={() => itemClick()}
                    className={classNames(
                        openSidebar ? (css.item, css.vip) : css.vip_close
                    )}
                    activeClassName={css.active}
                >
                  <GameSectionIcon id="live_games_big" className={css.game_svg}/>
                  <span
                      className={openSidebar ? css.title_open : css.title_close}
                  >
                  {t("live_games")}
                </span>
                </NavLink>
              </div>
          )}

          <div>
            <NavLink
                to={"/games/bonus_buy"}
                onClick={() => itemClick()}
                className={classNames(
                    openSidebar ? (css.item, css.vip) : css.vip_close
                )}
                activeClassName={css.active}
            >
              <GameSectionIcon id="bonus_buy" className={css.game_svg}/>
              <span className={openSidebar ? css.title_open : css.title_close}>
                {t("bonus_buy")}
              </span>
            </NavLink>
          </div>

          <div>
            <NavLink
                to="/games/themes"
                className={classNames(
                    openSidebar ? (css.item, css.vip) : css.vip_close
                )}
                activeClassName={css.active_filter}
                onClick={() => itemClick()}
            >
              <ThemesSvg className={css.svg}/>
              <span className={openSidebar ? css.title_open : css.title_close}>
                {t("themes")}
              </span>
            </NavLink>
          </div>

          <div>
            <NavLink
                to={"/games/all_games"}
                onClick={() => itemClick()}
                className={classNames(
                    openSidebar ? (css.item, css.vip) : css.vip_close
                )}
                activeClassName={css.active}
            >
              <GameSectionIcon id="all_games" className={css.game_svg}/>
              <span className={openSidebar ? css.title_open : css.title_close}>
                {t("all_games")}
              </span>
            </NavLink>
          </div>

          <div className={css.border_line}></div>

          {/*{auth?.user && (*/}
          {/*    <div>*/}
          {/*      <NavLink*/}
          {/*          to="/games/user/favorites"*/}
          {/*          className={classNames(*/}
          {/*              openSidebar ? (css.item, css.vip) : css.vip_close*/}
          {/*          )}*/}
          {/*          activeClassName={css.active_filter}*/}
          {/*          onClick={() => itemClick()}*/}
          {/*      >*/}
          {/*        <FavoriteGamesSvg className={css.svg}/>*/}
          {/*        <span*/}
          {/*            className={openSidebar ? css.title_open : css.title_close}*/}
          {/*        >*/}
          {/*        {t("favorite_games")}*/}
          {/*      </span>*/}
          {/*      </NavLink>*/}
          {/*      <NavLink*/}
          {/*          to="/games/user/last-played"*/}
          {/*          className={classNames(*/}
          {/*              openSidebar ? (css.item, css.vip) : css.vip_close*/}
          {/*          )}*/}
          {/*          activeClassName={css.active_filter}*/}
          {/*          onClick={() => itemClick()}*/}
          {/*      >*/}
          {/*        <LastPlayedSvg className={css.svg}/>*/}
          {/*        <span*/}
          {/*            className={openSidebar ? css.title_open : css.title_close}*/}
          {/*        >*/}
          {/*        {t("last")}*/}
          {/*      </span>*/}
          {/*      </NavLink>*/}
          {/*    </div>*/}
          {/*)}*/}

          <div>
            <NavLink
                to={"/free-money"}
                onClick={() => itemClick()}
                className={classNames(
                    openSidebar ? (css.item, css.vip) : css.vip_close
                )}
                activeClassName={css.active}
            >
              <FreeMoneySvg className={css.small_icons}/>
              <span className={openSidebar ? css.title_open : css.title_close}>
                {t("free money")}
              </span>
            </NavLink>
          </div>

          {/*<div>*/}
          {/*  <NavLink*/}
          {/*    to={"/ranks"}*/}
          {/*    onClick={() => itemClick()}*/}
          {/*    className={classNames(*/}
          {/*      openSidebar ? (css.item, css.vip) : css.vip_close*/}
          {/*    )}*/}
          {/*    activeClassName={css.active}*/}
          {/*  >*/}
          {/*    <RanksSvg className={css.svg} />*/}
          {/*    <span className={openSidebar ? css.title_open : css.title_close}>*/}
          {/*      {t("Cashback and ranks")}*/}
          {/*    </span>*/}
          {/*  </NavLink>*/}
          {/*</div>*/}

          <div>
            <NavLink
                to={"/vip"}
                onClick={() => itemClick()}
                className={classNames(
                    openSidebar ? (css.item, css.vip) : css.vip_close
                )}
                activeClassName={css.active}
            >
              <VipSvg className={css.small_icons}/>
              <span className={openSidebar ? css.title_open : css.title_close}>
                {t("VIP CLUB")}
              </span>
            </NavLink>
          </div>

          <div>
            <NavLink
                to={{pathname: "https://garilla.partners/"}}
                target={"_blank"}
                onClick={() => itemClick()}
                className={classNames(
                    openSidebar ? (css.item, css.vip) : css.vip_close
                )}
                activeClassName={css.active}
            >
              <PartnersSvg className={css.small_icons}/>
              <span className={openSidebar ? css.title_open : css.title_close}>
                {t("For partners")}
              </span>
            </NavLink>
          </div>

          {openSidebar ? (
              <div className={css.footer}></div>
          ) : (
              <div className={css.footer_block__icon}></div>
          )}
        </div>
        <div className={css.sidebar_footer}>
          {isMobile && (
              <div className={css.footer_lang}>
                <LanguageDrop/>
              </div>
          )}
          <div>
            <NavLink
                to={{pathname: "https://vk.com/garilla_casino"}}
                target={"_blank"}
                // onClick={window.openSplash}
                className={css.telegram}
            >
              <VkSvg className={css.telegram_icon}/>
            </NavLink>
            <NavLink
                to={{pathname: "https://t.me/Garilla_Casino_Support_bot" }}
              target={"_blank"}
              // onClick={window.openSplash}
              className={css.telegram}
            >
              <TelegramSvg className={css.telegram_icon} />
            </NavLink>
            <NavLink
              to={{ pathname: "https://www.instagram.com/garilla_inst/" }}
              target={"_blank"}
              // onClick={window.openSplash}
              className={css.telegram}
            >
              <InstSvg className={css.telegram_icon} />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
