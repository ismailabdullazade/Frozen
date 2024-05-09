import React, { useState, useRef } from "react";
import css from "./left-menu.module.css";
import classNames from "classnames";
import LanguageDrop from "./language-drop/language-drop";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import GameSectionIcon from "./game-section-icon";
import { setGame } from "../../features/games/game.slice";
import { ReactComponent as FreeMoneySvg } from "../../images/free-money.svg";
import { ReactComponent as ProfileSvg } from "../../images/header/logo_player_big.svg";
import { ReactComponent as VipSvg } from "../../images/vip_club_new.svg";
import { ReactComponent as PartnersSvg } from "../../images/header/left-menu/partners_new.svg";
import instagram_social_svg from "../../images/footer-icons/instagram_icon_footer.svg";
import telegram_social_svg from "../../images/footer-icons/telegram_icon_footer.svg";

export default function SidebarLeft() {
  const isMobile = useMediaQuery("(max-width: 960px)");
  const { t } = useTranslation();
  const auth = useAuth();
  const [closeGame] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const iconContainerRef = useRef(null);
  const dispatch = useDispatch();
  const hideSidebarLeft = useSelector((state) => state.app.hideSidebarLeft);

  const list = useRef();

  const path = window.location.pathname;

  function openLiveChat() {
    console.log(
      "typeof window?.LC_API?.open_chat_window",
      typeof window?.LC_API?.open_chat_window,
    );
    if (
      typeof window?.LC_API !== "undefined" &&
      typeof window?.LC_API?.open_chat_window !== "undefined"
    ) {
      window?.LC_API?.open_chat_window();
    }
  }

  return (
    <div
      className={classNames(
        css.menu_left,
        hideSidebarLeft ? css.menu_left_hide : css.menu_left_open,
      )}
      ref={list}
    >
      <div className={css.sb_blocks}>
        <div
          ref={iconContainerRef}
          className={classNames(
            css.menu_left_scroll_block,
            hideSidebarLeft ? css.block_small : "",
          )}
        >
          <div>
            <NavLink
              to={"/"}
              className={css.item}
              activeClassName={path === "/" ? css.active : ""}
            >
              <GameSectionIcon id="lobby" />
              {!hideSidebarLeft && (
                <span className={css.item_text}>{t("lobby")}</span>
              )}
            </NavLink>
          </div>

          {auth?.user && (
            <div>
              <div>
                <NavLink
                  to={"/profile"}
                  onClick={() => {
                    closeGame && dispatch(setGame(null));
                  }}
                  className={css.item}
                  activeClassName={css.active}
                >
                  <ProfileSvg />
                  <div>
                    <div
                      className={
                        !hideSidebarLeft ? css.title_open : css.title_close
                      }
                    ></div>
                    <div
                      className={classNames(
                        css.sidebar_user_info,
                        !hideSidebarLeft ? css.title_open : css.title_close,
                      )}
                    >
                      {!hideSidebarLeft && (
                        <span className={css.item_text}>{t("My profile")}</span>
                      )}
                    </div>
                  </div>
                </NavLink>
                <NavLink
                  to={"/games/user/favorites"}
                  className={css.item}
                  activeClassName={css.active}
                >
                  <GameSectionIcon id="favorites" />
                  {!hideSidebarLeft && (
                    <span className={css.item_text}>{t("Favorites")}</span>
                  )}
                </NavLink>
              </div>
            </div>
          )}

          <div>
            <NavLink
              to={"/games/live_games"}
              className={css.item}
              activeClassName={css.active}
            >
              <GameSectionIcon id="live_games" />
              {!hideSidebarLeft && (
                <span className={css.item_text}>{t("live_games")}</span>
              )}
            </NavLink>
          </div>

          <div
            className={classNames(
              css.parent_block,
              hideSidebarLeft ? css.parent_block_hide : "",
            )}
          >
            <div>
              <div
                onClick={() =>
                  !hideSidebarLeft && setOpenDropDown(!openDropDown)
                }
                className={classNames(
                  css.item,
                  css.item_dd_btn,
                  hideSidebarLeft ? css.item_dd_btn_arrow_hide : "",
                  openDropDown ? css.item_dd_btn_up : "",
                )}
              >
                <GameSectionIcon id="slots_small" />
                {!hideSidebarLeft && (
                  <span className={css.item_text}>{t("slots")}</span>
                )}
              </div>
            </div>
            <div
              className={classNames(
                css.child_block,
                hideSidebarLeft ? css.child_block_abs : "",
                openDropDown ? css.child_block_open : "",
              )}
            >
              <div>
                <NavLink
                  to={"/games/all_games"}
                  className={css.item}
                  activeClassName={css.active}
                >
                  <GameSectionIcon id="all_games_small" />
                  <span className={css.item_text}>{t("all_games")}</span>
                </NavLink>
              </div>

              <div>
                <NavLink
                  to={"/games/popular"}
                  className={css.item}
                  activeClassName={css.active}
                >
                  <GameSectionIcon id="popular_small" />
                  <span className={css.item_text}>{t("popular")}</span>
                </NavLink>
              </div>

              <div>
                <NavLink
                  to={"/games/new_games"}
                  className={css.item}
                  activeClassName={css.active}
                >
                  <GameSectionIcon id="new_games_small" />
                  <span className={css.item_text}>{t("new_games")}</span>
                </NavLink>
              </div>

              <div>
                <NavLink
                  to={"/games/bonus_buy"}
                  className={css.item}
                  activeClassName={css.active}
                >
                  <GameSectionIcon id="bonus_buy_small" />
                  <span className={css.item_text}>{t("bonus_buy")}</span>
                </NavLink>
              </div>

              <div>
                <NavLink
                  to={"/games/themes"}
                  className={css.item}
                  activeClassName={css.active}
                >
                  <GameSectionIcon id="theme_small" />
                  <span className={css.item_text}>{t("themes")}</span>
                </NavLink>
              </div>

              {auth?.user && (
                <div>
                  <NavLink
                    to={"/games/user/last-played"}
                    className={css.item}
                    activeClassName={css.active}
                  >
                    <GameSectionIcon id="last_small" />
                    <span className={css.item_text}>{t("last")}</span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          <div className={css.border_line}></div>

          {auth?.user && (
            <div>
              <NavLink
                to={"/my-bonus/available"}
                className={css.item}
                activeClassName={css.active}
              >
                <GameSectionIcon id="bonuses_small" />
                {!hideSidebarLeft && (
                  <span className={css.item_text}>{t("bonuses")}</span>
                )}
              </NavLink>
            </div>
          )}

          <div>
            <NavLink
              to={"/free-money"}
              className={css.item}
              activeClassName={css.active}
            >
              <FreeMoneySvg />
              {!hideSidebarLeft && (
                <span
                  className={classNames(
                    !hideSidebarLeft ? css.title_open : css.title_close,
                    css.item_text,
                  )}
                >
                  {t("free money")}
                </span>
              )}
            </NavLink>
          </div>

          <div>
            <NavLink
              to={"/tournaments"}
              className={css.item}
              activeClassName={css.active}
            >
              <GameSectionIcon id="tournaments_small" />
              {!hideSidebarLeft && (
                <span
                  className={classNames(
                    !hideSidebarLeft ? css.title_open : css.title_close,
                    css.item_text,
                  )}
                >
                  {t("tournaments")}
                </span>
              )}
            </NavLink>
          </div>

          <div>
            <NavLink
              to={"/jackpot"}
              className={css.item}
              activeClassName={css.active}
            >
              <GameSectionIcon id="jackpot_small" />
              {!hideSidebarLeft && (
                <span
                  className={classNames(
                    !hideSidebarLeft ? css.title_open : css.title_close,
                    css.item_text,
                  )}
                >
                  {t("jackpot")}
                </span>
              )}
            </NavLink>
          </div>

          <div>
            <NavLink
              to={"/vip"}
              className={css.item}
              activeClassName={css.active}
            >
              <VipSvg />
              {!hideSidebarLeft && (
                <span
                  className={classNames(
                    !hideSidebarLeft ? css.title_open : css.title_close,
                    css.item_text,
                  )}
                >
                  {t("VIP CLUB")}
                </span>
              )}
            </NavLink>
          </div>

          <div>
            <NavLink
              to={{ pathname: "https://garilla.partners/" }}
              target={"_blank"}
              className={css.item}
              activeClassName={css.active}
            >
              <PartnersSvg className={css.svg} />
              {!hideSidebarLeft && (
                <span className={css.item_text}>{t("For partners")}</span>
              )}
            </NavLink>
          </div>

          <div>
            <div
              className={css.item}
              activeClassName={css.active}
              onClick={() => openLiveChat()}
            >
              <GameSectionIcon id="support" />
              {!hideSidebarLeft && (
                <span className={css.item_text}>{t("Support chat")}</span>
              )}
            </div>
          </div>

          <div className={css.social_link_buttons}>
            {/*<div>*/}
            {/*  <img src={instagram_social_svg} alt="instagramLink" />*/}
            {/*</div>*/}
            <div>
              <img src={telegram_social_svg} alt="telegramLink" />
            </div>
          </div>
        </div>

        {/*<div className={css.sidebar_footer}>*/}
        {/*{isMobile && (*/}
        {/*    <div className={css.footer_lang}>*/}
        {/*      <LanguageDrop/>*/}
        {/*    </div>*/}
        {/*)}*/}
        {/*<div className={css.sb_soc_wrap}>*/}

        {/*<div className={css.social_link_buttons}>*/}
        {/*  <div>*/}
        {/*    <img src={instagram_social_svg} alt="instagramLink"/>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <img src={telegram_social_svg} alt="telegramLink"/>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*{!hideSidebarLeft &&*/}
        {/*    <div className={css.about_us_container}>*/}
        {/*      <Link*/}
        {/*          to={"/terms-conditions"} target={"_blank"}*/}
        {/*      >{t("Terms of Use")}*/}
        {/*      </Link>*/}
        {/*      <Link to={"/responsible-gaming"} target={"_blank"}>*/}
        {/*        {t("responsible-gaming")}*/}
        {/*      </Link>*/}
        {/*      <Link*/}
        {/*          to={"/privacy-policy"} target={"_blank"}*/}
        {/*      >Политика*/}
        {/*      </Link>*/}
        {/*      <Link*/}
        {/*          to={"/privacy-policy"} target={"_blank"}*/}
        {/*      >Конфиденциальности*/}
        {/*      </Link>*/}
        {/*    </div>*/}
        {/*}*/}
        {/*</div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
