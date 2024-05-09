import {useHistory, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import detectDevice from "../../../utils/detect-device";
import {useGameSessionMutation} from "../../../app/api/games.api";
import {GAMES_LIST_OUR_PLAYING} from "../config";
import {toast} from "react-toastify";
import {useMediaQuery} from "beautiful-react-hooks";
import {useTranslation} from "react-i18next";
import Game from "./game";
import Loader from "../../../components/loader/Loader";
import classNames from "classnames";
import css from "./game.module.css";
import err500 from "../../../images/items/Page-Error.png";
import {useAuth} from "../../../services/auth";
import {setLoginCloseCallback, setLoginModalState, setRedirectAfterLogin} from "../../../app/app.slice";
import {useDispatch, useSelector} from "react-redux";

const errorCodes = ["502", "101", "404", "405"];
const TARGET = "game-container";

export default function GameController() {
  const params = useParams()
  const {isMobile} = new detectDevice();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1180px)");
  const history = useHistory()
  const [ready, setReady] = useState(false)
  const [gameSession, { data, error, isLoading, isUninitialized }] =
    useGameSessionMutation();
  const [errorMessage, setErrorMessage] = useState(null);
  const { t } = useTranslation();
  const auth = useAuth();
  const dispatch = useDispatch()
  const loginModalIsOpen = useSelector((state) => state.app.loginIsOpen);

  useEffect(() => {
    if (error?.status === 409) {
      errorHandler(t("This game is not available with an activated bonus"));
    }
  }, [error]);

  const errorHandler = (text) => {
    const notify = () =>
      toast(text, {
        theme: "dark",
        type: "error",
      });
    notify();
    setErrorMessage(text);
    if (isMobile || isTablet) {
      window.closeSplash();
    }
  };

  useEffect(() => {
    if(params.mode !== "demo" && auth && !auth.user && !auth.isLoading) {
      dispatch(setRedirectAfterLogin(history.location.pathname))
      dispatch(setLoginModalState(true));
      dispatch(setLoginCloseCallback(() => {
        history.push({
          pathname: `/play-demo/${params.provider}/${params.id}`,
        });
      }))
    }
  }, [auth, params]);

  useEffect(() => {
    // if (isUninitialized || ) {
      gameSession({
        body: { gameId: params.id },
        demo: params.mode === "demo",
      })
    // }
  }, [isUninitialized, params, auth])

  useEffect(() => {
    if (data) {

      if (errorCodes.includes(data.code)) {
        errorHandler(data.message ? data.message : t("Error"));
      } else {
        if (data.strategy) {
          if(isMobile) {
            const stateObj = { game: params.id };
            window.history.pushState(stateObj, '', history.location.pathname);
            window.history.replaceState(stateObj, '', '/');
            // history.replace(history.location.pathname)
            // console.log(history.location.pathname, history.replace(history.location.pathname))
          }
          if (GAMES_LIST_OUR_PLAYING.includes(params.provider) && isMobile) {
            const mobileUrl = data.mobile_url;
            const redirectUrl = `${mobileUrl}&return_url=${encodeURIComponent(
              window.location.origin
            )}`;

            try {
              window.location.href = redirectUrl;
            } catch (e) {
              console.error(`Can't push location state "${redirectUrl}"`);
            }
          } else {
            window.sg.launch(
              {
                target_element: TARGET,
                launch_options: JSON.parse(JSON.stringify(data)),
              },
              (e) => {
                if (process.env.NODE_ENV === "development") {
                  console.log(`SUCCESS ${e},`);
                }
                setReady(true)
              },
              (err) => {
                if (process.env.NODE_ENV === "development") {
                  console.error(`ERROR`, err);
                }
                setErrorMessage(t("Unfortunately the game is not available"))
              }
            );
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    if (!isLoading && (errorMessage || error)) {
      window.closeSplash()
    }
  }, [error, isLoading, errorMessage])

  useEffect(() => {
    if (!ready) {
      window.openSplash()
    } else if (ready && !isMobile) {
      window.closeSplash()
    }
  }, [ready]);

  if (params.mode !== "demo" && (!auth || auth.isLoading || auth && !auth.user)) {
    return <Loader />;
  }

  if (isLoading || (!error && !data)) {
    return  <Loader
      className={classNames(css.main_container, { [css.mobile]: isMobile })}
    />
  }

  if (!!errorMessage) {
    return <div className={css.gameError}>
      <div>{t("Unfortunately the game is not available")}</div>
      <div>
        {t("error text:")} <b>{errorMessage}</b>
      </div>
      <div
        onClick={() => {
          history.goBack()
        }}
        className={css.goBack}
      >
        {t("Go backward")}
      </div>
    </div>
  }

  if ((!!error || errorCodes.includes(data?.code)) && !isLoading) {
    return <div
      className={classNames(css.main_container, css.error, {
        [css.mobile]: isMobile,
      })}
    >
      <img
        className={classNames({ [css.mobile]: isMobile })}
        src={err500}
        alt=""
      />
    </div>
  }

  // if (isMobile) {
  //   return <></>
  // }


  return <Game errorCodes={errorCodes}/>
}