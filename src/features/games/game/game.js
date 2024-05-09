import css from "./game.module.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import detectDevice from "../../../utils/detect-device";
import { useFavoriteMutation } from "../../../app/api/games.api";
import { useAuth } from "../../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { setFullScreen } from "../../../app/app.slice";
import fullScreen_img from "../../../images/games/fullScreen.svg";
import addToFavorite from "../../../images/games/addToFavorite.svg";
import addToFavoriteActive from "../../../images/games/addToFavoriteActive.svg";
import LogoMain from "../../../images/main-logo.svg";
import ToogleSwitch from "../../../components/toggle-switch/toogle-switch";
import close from "../../../images/games/garilla_close.svg";
import {useHistory, useParams} from "react-router-dom";

const TARGET = "game-container";

export default function Game({item = {}, action}) {
  const params  = useParams()
  const fullScreen = useSelector((state) => state.app.fullScreen);
  const { t } = useTranslation();
  const history = useHistory()
  const auth = useAuth();
  const dispatch = useDispatch();
  const deviceInfo = new detectDevice();
  const [favoriteAction, { isLoadingFavorite, error: favoriteError }] =
    useFavoriteMutation();
  const [game, setGame] = useState(null)
  const [favorite, setFavorite] = useState(game?.favorite);

  useEffect(() => {
    if (!game) {
      //получить игру
    }
  }, [game])

  const isLiveGame = () => item.category !== "slots";

  const [position, setPosition] = useState({ x: 0, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = React.createRef();

  const handleMouseDown = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const button = buttonRef.current;
      const { clientY } = event;
      const rect = button.getBoundingClientRect();
      const offsetY = clientY - rect.height / 2;

      setPosition({ y: offsetY });
    }
  };

  useEffect(() => {
    if (favoriteError) {
      setFavorite(!favorite);
    }
    // eslint-disable-next-line
  }, [favoriteError]);

   return (
    <div
      className={classNames(css.game, {
        [css.fullScreen]: fullScreen,
        [css.disable]: deviceInfo.type !== "desktop",
        [css.game_amatic]:
          params.provider === "amatic" || params.provider === "netent",
      })}
    >
      <div className={css.main_container} id={TARGET} />
      {fullScreen ? (
        <span
          ref={buttonRef}
          style={{ position: "absolute", top: position.y }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={(event) => handleMouseMove(event.touches[0])}
          className={classNames(css.close_icon, "ignore-active")}
          onClick={() => dispatch(setFullScreen(false))}
        >
          <img src={close} alt={""} />
        </span>
      ) : (
        <div
          className={classNames(css.sidebar, { [css.fullScreen]: fullScreen })}
        >
          <div className={css.actions}>
            <div className={css.actions_block}>
              <span
                className={css.actions_block__fullScreen}
                onClick={() => {
                  dispatch(setFullScreen(true));
                }}
              >
                <img src={fullScreen_img} alt="" />
              </span>
              {auth?.user && (
                <span
                  onClick={() => {
                    if (!isLoadingFavorite) {
                      setFavorite(!favorite);
                      favoriteAction({ gameId: params.id });
                    }
                  }}
                  className={classNames(css.favorite_block, {
                    [css.inFavorite]: favorite,
                  })}
                >
                  <img
                    className={classNames(css.addToFavorite, {
                      [css.fullScreen]: fullScreen,
                    })}
                    src={addToFavorite}
                    alt=""
                  />
                  <img
                    className={css.removeFromFavorite}
                    src={addToFavoriteActive}
                    onClick={() =>
                      action("favorite", item.identifier, item.provider)
                    }
                    alt=""
                  />
                </span>
              )}
            </div>
            <span
              className={classNames(css.actions_garilla, {
                [css.fullScreen]: fullScreen,
              })}
              onClick={() => {
                console.log("hit!!")

              }}
            >
              <img src={LogoMain} alt="" />
            </span>
            <div
              className={classNames(
                css.toogleSwitch
              )}
            >
              <div
                onClick={() => history.push(history.location.pathname.replace("-game", "-demo"))}
                className={
                  params.mode === "demo" ? css.active : ""
                }
              >
                {t("Demo")}
              </div>
              <div
                className={
                  params.mode === "demo" ? "" : css.active
                }
                onClick={() => history.push(history.location.pathname.replace("-demo", "-game"))}
              >
                {t("Money")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
