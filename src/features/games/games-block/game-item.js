import classNames from "classnames";
import css from "./games-block.module.css";
import logo from "../../../images/logo.png";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import detectDevice from "../../../utils/detect-device";
import useOnClickOutside from "../../../utils/click-outside";
import FavoriteButton from "./components/favorite-button/favorite-button";
import PlayButton from "./components/play-button/play-button";
import Button from "../../../components/button/button";
import { useAuth } from "../../../services/auth";
import useTokenRefresh from "../../../services/refresh_token";
import {Link} from "react-router-dom";

export default function GameItem({ item, action, className }) {
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const auth = useAuth();
  const device = new detectDevice();
  const [touchSelected, setTouchSelected] = useState(false);
  const ref = useRef();
  const isTouchScreen = device.isTouchScreen;
  const isLiveGame = () => item.category !== "slots";
  const { refresh } = useTokenRefresh();

  const refrechToken = () => {
    refresh();
  };

  useOnClickOutside(ref, () => {
    touchSelected && setTouchSelected(false);
  });

  return (
    <div
      className={classNames(
        css.game_item,
        {
          [css.touchscreen]: isTouchScreen,
          [css.touch_selected]: touchSelected,
          [css.error]: !!error,
          // [css.loaded]: !loaded,
        },
        className
      )}
      onClick={() => {
        if (isTouchScreen && !touchSelected) {
          setTouchSelected(true);
        }
      }}
      ref={ref}
    >
      <div className={css.style_img} />
      <div className={css.game_icon}>
        <img
          src={item.images["380x380"]}
          alt=""
          // onError={(e) => {
          //   console.error("Image loading error:", e);
          //   e.target.src = logo;
          //   setError(true);
          // }}
        />
        <div className={css.item_info__block}>
          <div className={css.game_title}>{item.title}</div>

          {item.provider && (
            <div className={css.game_provider}>
              {item.provider === "alg" ||
              item.provider === "oryx" ||
              item.producer === "bigtimegaming" ||
              item.producer === "eagaming" ||
              item.producer === "fazi" ||
              item.producer === "fugaso" ||
              item.producer === "igrosoft" ||
              item.producer === "kiron" ||
              item.producer === "pgsoft" ||
              item.producer === "retrogaming" ||
              item.producer === "revolver" ||
              item.producer === "tvbet" ||
              item.producer === "redtiger" ||
              item.producer === "spearhead" ||
              item.producer === "hacksaw" ||
              item.producer === "backseatgaming" ||
              item.producer === "fantasma" ||
              item.producer === "pragmaticplaylive" ||
              item.producer === "pragmaticplay"
                ? item.producer
                : item.provider}
            </div>
          )}
        </div>
      </div>

      <div className={css.cover}>
        <div className={css.game_actions}>
          <div
            className={classNames(css.actions_wrapper, {
              [css.actions_wrapper__guest]: !auth?.user,
              [css.actions_wrapper__customer]: auth?.user,
            })}
          >
            <PlayButton item={item} action={action} />
          </div>
        </div>
        {!isLiveGame() && (
          <Link
            to={`/play-demo/${item.provider}/${item.identifier}`}
            onClick={() => {
              refrechToken();
            }}

          >
            <Button variant={"demo"} className={css.demo}>
              {t("Demo")}
            </Button>
          </Link>
        )}
        <FavoriteButton item={item} action={action} />
      </div>
    </div>
  );
}
