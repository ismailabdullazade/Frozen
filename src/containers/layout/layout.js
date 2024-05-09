import css from "./layout.module.css";
import css_menu from "../menu/menu.module.css";
import React, { useEffect, useState, useRef } from "react";
import Footer from "../../components/footer/footer";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import Menu from "../menu/menu";
import classNames from "classnames";
import logo from "../../images/main-logo.svg";
import { useTranslation } from "react-i18next";
import Button from "../../components/button/button";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../services/auth";
import Balance from "../../features/user/balance-2/balance";
import BalanceBtn from "../../features/user/balance-2/balance-btn";
import Scrollbar from "../../components/scrollbar/scrollbar";
import { useDispatch, useSelector } from "react-redux";
import InternalError from "../../features/error/internal-error";
import {
  setFiltersOpened,
  setClickLogo,
  setGame,
  setFilters,
  setStopGamesFilters,
} from "../../features/games/game.slice";
import {
  setLoginModalState,
  setOpenNotification,
  setOpenSidebar,
  setHideSidebarLeft,
  setOpenUserInfo,
  setRegistrationModalState,
} from "../../app/app.slice";
import MobileMenu from "./mobile-menu/mobile-menu";
import logo_player_big from "../../images/header/logo_player_big.svg";
import Sidebar from "./sidebar";
import SidebarLeft from "./sidebar-left";
import UserMenu from "./userMenu";
import detectDevice from "../../utils/detect-device";
import Snowflakes from "./snowflakes/snowflakes";
import Loader from "../../components/loader/Loader";
import moment from "moment";
import useTokenRefresh from "../../services/refresh_token";
const Banners = React.lazy(() => import("./banners/banners"));

const ROUTES_WITHOUT_FOOTER = [
  /*'/vip', /*'/login', '/signup'*/
];

export default function Layout({ children, fullWidth = false }) {
  const isMobile = useMediaQuery("(max-width: 960px)");
  const isTablet = useMediaQuery("(max-width: 1023px)");
  const { t } = useTranslation();
  const auth = useAuth();
  const location = useLocation();
  const [profileMenuOpened, setProfileMenuOpened] = useState(false);
  const [showBurger, setShowBurger] = useState(!isTablet);
  const error500 = useSelector((state) => state.app.err500);
  const dispatch = useDispatch();
  const userSelectorOpen = useSelector((state) => state.app.openUserInfo);
  const notificationsSelectorOpen = useSelector(
    (state) => state.app.openNotification
  );
  const openSidebar = useSelector((state) => state.app.openSidebar);
  const hideSidebarLeft = useSelector((state) => state.app.hideSidebarLeft);

  const listener = (event) => {
    // if (document.body.className.includes("games-page")) {
    //     const footer = document.getElementsByTagName("footer");
    //     const webim = document.querySelector("jdiv > jdiv > jdiv:first-child");
    //     let children = [...event.target.childNodes];
    //     children = children.map(a => a.offsetHeight)
    //
    //     if(
    //         footer
    //         && (
    //             children.reduce((a, b) => a + b)
    //             - event.target.scrollTop
    //             - event.target.offsetHeight
    //         ) < ( footer[0]?.offsetHeight - webim?.offsetHeight )
    //     ) {
    //         webim?.classList.remove("webim-hidden");
    //     } else {
    //         webim?.classList.add("webim-hidden");
    //     }
    // }
  };
  const scrollBarRef = useRef();
  const device = new detectDevice();
  const isMobileSafari = device.isSafariIOS;
  const Container = isMobileSafari ? React.Fragment : Scrollbar;
  const containerProps = isMobileSafari
    ? {}
    : {
        className: classNames(css.wrapper),
        id: "wrapper",
        onScroll: listener,
        refLink: scrollBarRef,
      };

  useEffect(() => {
    if (!auth.user) {
      setProfileMenuOpened(false);
    }
  }, [auth.user]);

  useEffect(() => {
    setShowBurger(true);
  }, [isMobile, auth.user]);

  const bodyEl = document.querySelector("body");

  const burgerClick = () => {
    dispatch(setOpenSidebar(!openSidebar));
    // !openSidebar
    //   ? bodyEl.classList.add("noscroll")
    //   : bodyEl.classList.remove("noscroll");
  };

  const arrowBtnClick = () => {
    dispatch(setHideSidebarLeft(!hideSidebarLeft));
  };

  const refreshTime = localStorage.getItem("refresh_time");
  const [currentDateTimeUTC, setCurrentDateTimeUTC] = useState(
    moment.utc().toISOString()
  );

  useEffect(() => {
    if (auth?.user) {
      const intervalId = setInterval(() => {
        setCurrentDateTimeUTC(moment.utc().toISOString());
      }, 300000);
      return () => clearInterval(intervalId);
    }
  }, [auth?.user]);

  const { refresh } = useTokenRefresh();

  const refreshToken = () => {
    refresh();
  };

  useEffect(() => {
    if (
      moment(refreshTime)
        .startOf("second")
        .isBefore(moment(currentDateTimeUTC).startOf("second"))
    ) {
      refreshToken();
      localStorage.removeItem("refresh_time");
    }
  }, [refreshTime, currentDateTimeUTC]);

  const newAvatar =
    auth.user === null
      ? ""
      : auth.user.avatar_image === null || auth.user.avatar_image === undefined
        ? logo_player_big
        : auth.user.avatar_image;
  return (
    <div
      className={classNames(css.app, {
        [css.app_block]: !auth?.user,
        [css.safari_ios]: isMobileSafari,
      })}
    >
      <header>
        <div className={css.main}>
          <div
            data-custom-attribute="burger"
            onClick={() => burgerClick()}
            // className={classNames(css.burger, {[css.burger_opacity]: !showBurger})}
            className={css.burger}
          >
            {showBurger &&
              (openSidebar ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_312_149354)">
                    <path
                      d="M32 9.14286V32H0L0 0L9.14286 0L22.8571 0L32 9.14286Z"
                      fill="#19182A"
                    />
                    <path
                      d="M11.5 10.5004L21.4998 20.5002L20.9998 22.0001L10 11.0003L11.5 10.5004Z"
                      fill="white"
                    />
                    <path
                      d="M10.5 20.4999L20.4998 10.5001L21.9998 11.0001L11 21.9999L10.5 20.4999Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_312_149354">
                      <rect width="32" height="32" rx="4" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              ) : (
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_4_23399)">
                    <path d="M42 12V42H0V0L12 0L30 0L42 12Z" fill="#19182A" />
                    <path
                      d="M11.9091 13.6364H21L21.9091 15.4545H11L11.9091 13.6364Z"
                      fill="white"
                    />
                    <path
                      d="M11.9091 20.0909H30.0909L31 21.9091H11L11.9091 20.0909Z"
                      fill="white"
                    />
                    <g filter="url(#filter0_d_4_23399)">
                      <path
                        d="M11.9091 26.5454H30.0909L31 28.3636H11L11.9091 26.5454Z"
                        fill="white"
                      />
                    </g>
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_4_23399"
                      x="7"
                      y="26.5454"
                      width="28"
                      height="9.81824"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_4_23399"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_4_23399"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="clip0_4_23399">
                      <rect width="42" height="42" rx="4" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              ))}
          </div>
          <div
            className={classNames("container-full container-full-header", {
              container: isTablet,
            })}
          >
            <Sidebar />
            {/*<Snowflakes />*/}

            {!isMobile && (
              <div
                className={classNames(
                  hideSidebarLeft ? css.btn_arrow_close : css.btn_arrow
                )}
                onClick={() => arrowBtnClick()}
              ></div>
            )}

            {!isTablet && <SidebarLeft />}

            <div className={css.logo}>
              <NavLink
                to={"/"}
                exact={true}
                onClick={(e) => {
                  dispatch(setFiltersOpened(null));
                  dispatch(setStopGamesFilters(true));
                  localStorage.removeItem("filters");
                  dispatch(setGame(null));
                  dispatch(setClickLogo(true));
                  if (location.pathname === `/`) {
                    e.preventDefault();
                    window.location.reload();
                    try {
                      scrollBarRef?.current.scrollTop();
                    } catch (e) {}
                  } else {
                    window.openSplash();
                  }
                }}
                className={"ignore-active"}
              >
                <img src={logo} alt="" />
              </NavLink>
            </div>

            <Menu
              onBurgerClick={() => setProfileMenuOpened(!profileMenuOpened)}
            />

            <div className={classNames(css.user_actions)}>
              {auth?.isLoading ? (
                <Loader />
              ) : auth.user ? (
                <>
                  <div className={css.authorized}>
                    <div
                      className={css.player}
                      // onClick={() => setProfileMenuOpened(!profileMenuOpened)}
                    >
                      <div
                        className={css.item}
                        data-custom-attribute="user-acc"
                        // onClick={() => {
                        //   dispatch(setOpenUserInfo(!userSelectorOpen));
                        // }}
                      >
                        <div>
                          <div className={css.user_nick}>
                            <div className={css.user_nick_copy}></div>
                            {auth.user.nickname}
                          </div>
                          <Balance />
                        </div>
                        <NavLink
                          to={"/profile"}
                          className={css.logo_player_block}
                        >
                          <img
                            src={newAvatar}
                            // src="https://www.realmenrealstyle.com/wp-content/uploads/2023/08/Attractive-Older-Men-Are-Confident.jpg"
                            className={css.logo_player}
                            alt=""
                          />
                        </NavLink>
                      </div>
                    </div>
                    <div>
                      <BalanceBtn />
                    </div>
                    {auth?.user && (
                      <div
                        className={css_menu.app_menu__notification}
                        data-custom-attribute="notification"
                        onClick={() => {
                          dispatch(
                            setOpenNotification(!notificationsSelectorOpen)
                          );
                        }}
                      >
                        {/*<svg*/}
                        {/*    data-custom-attribute="notification"*/}
                        {/*    className={classNames(css_menu.svg, {[css_menu.svg_active]: notificationsSelectorOpen})}*/}
                        {/*    width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*    <path data-custom-attribute="notification"*/}
                        {/*          d="M3.5 16.5L2 18.5H12.5L20 19L21.5 18.5L18.5 13V9.5L18 5.5L15.5 3L12 2L7.5 2.5L5 6L4.5 12.5L3.5 16.5Z" fill="white"/>*/}
                        {/*    <path data-custom-attribute="notification"*/}
                        {/*          d="M19.0289 9.69713C19.0289 3.8513 15.8844 1.86276 12.9435 1.41953C12.9435 1.38958 12.9495 1.35964 12.9495 1.3237C12.9495 0.586979 12.2966 0 11.5 0C10.7034 0 10.0745 0.586979 10.0745 1.3237C10.0745 1.35964 10.0745 1.38958 10.0805 1.41953C7.13359 1.86875 3.97109 3.86328 3.97109 9.70912C3.97109 16.5253 2.27604 17.256 0 19.1727H23C20.7359 17.25 19.0289 16.5133 19.0289 9.69713ZM2.5875 18.2083C3.1026 17.6693 3.56979 17.1063 3.94713 16.3036C4.66588 14.7883 4.98932 12.7578 4.98932 9.70312C4.98932 6.92396 5.73802 4.8875 7.21146 3.64167C8.58307 2.48568 10.3081 2.24609 11.512 2.24609C12.7159 2.24609 14.4409 2.48568 15.8005 3.64167C17.268 4.88151 18.0167 6.90599 18.0167 9.68516C18.0167 14.7044 18.9091 16.7109 20.4305 18.2083H2.5875ZM11.512 23C13.1172 23 14.4349 21.8081 14.6086 20.4245H8.41536C8.58307 21.8081 9.90677 23 11.512 23Z" fill="white"/>*/}
                        {/*</svg>*/}
                        <div
                          data-custom-attribute="notification"
                          className={classNames(css_menu.notif_icon, {
                            [css_menu.notif_icon_active]:
                              notificationsSelectorOpen,
                          })}
                        ></div>
                        {/*{*/}
                        {/*    Boolean(notificationCount) &&  <div className={css_menu.svg_circle}>*/}
                        {/*        <span className={css_menu.svg_circle__text}>{notificationCount}</span>*/}
                        {/*    </div>*/}
                        {/*}*/}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className={css.user_actions_log}>
                  <Button
                      onClick={() => {
                        dispatch(setLoginModalState(true));
                      }}
                      variant={"violet"}
                      className={classNames(
                          css.login_btn,
                          css.auth_btns,
                          css.auth_btns_style
                      )}
                  >
                    {t("Sign in")}
                  </Button>
                  <Button
                    onClick={() => {
                      dispatch(setRegistrationModalState(true));
                    }}
                    className={classNames(
                      css.reg_btn,
                      css.auth_btns,
                      css.auth_btns_style
                    )}
                  >
                    {t("Registration")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>
        <div
          className={classNames(css.top_decoration, {
            hidden:
              location.pathname === "/" || location.pathname.includes("/games"),
          })}
        />
        {/*{*/}
        {/*    auth.user && profileMenuOpened && console.log(auth?.user, "open dropdown")*/}
        {/*}*/}
        {auth.user && <UserMenu />}
        <Container {...containerProps}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Banners />
          </React.Suspense>
          <div
            className={classNames(css.container, {
              container: !fullWidth,
              "container-full": isMobile,
              "container-ios": isMobileSafari,
            })}
          >
            {error500 ?? <div><InternalError /></div>}
            {!error500 && children}
          </div>
          {!ROUTES_WITHOUT_FOOTER.includes(location.pathname) && <Footer />}
        </Container>
      </main>
      {auth.user || isMobile ? <MobileMenu /> : <></>}
    </div>
  );
}
