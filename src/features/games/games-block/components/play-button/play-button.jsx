import css from "./play-button.module.css";
import React from "react";
import filled from "../../../../../images/play-filled.svg";
import empty from "../../../../../images/play-empty.svg";
import useTokenRefresh from "../../../../../services/refresh_token";
import {Link} from "react-router-dom";
export default function PlayButton({ item }) {
  const { refresh } = useTokenRefresh();

  const refreshToken = () => {
    refresh();
  };
  return (
    <Link
      className={css.play}
      to={`/play-game/${item.provider}/${item.identifier}`}
      onClick={() => {
        refreshToken();
      }}
    >
      <div className={css.hover} />
      <div className={css.core}>
        <img src={empty} alt="" />
        <img src={filled} alt="" />
      </div>
    </Link>
  );
}
