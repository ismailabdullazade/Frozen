import css from "./favorite.module.css";
import classNames from "classnames";
// import favoriteAdd from "../../../../../images/favorite-add.svg";
import favoriteRemove from "../../../../../images/favorite-add.svg";
// import favoriteRemove from "../../../../../images/favorite-remove.svg";
import favoriteAdd from "../../../../../images/favorite-remove.svg";
import React, { useEffect, useRef, useState } from "react";
import { useFavoriteMutation } from "../../../../../app/api/games.api";
import { useAuth } from "../../../../../services/auth";
import detectDevice from "../../../../../utils/detect-device";

export default function FavoriteButton({ item, action }) {
  const [favoriteAction, { isLoading, error: favoriteError }] =
    useFavoriteMutation();
  const [favorite, setFavorite] = useState(item.favorite);
  const auth = useAuth();
  const device = new detectDevice();
  const isTouchScreen = device.isTouchScreen;
  const isLiveGame = () => item.category !== "slots";
  const buttonRef = useRef(null);

  useEffect(() => {
    if (favoriteError) {
      setFavorite(!favorite);
    }
    // eslint-disable-next-line
  }, [favoriteError]);

  return (
    <>
      {auth?.user && (
        <div
          onClick={() => {
            if (!isLoading) {
              setFavorite(!favorite);
              favoriteAction({ gameId: item.identifier });
            }
          }}
          onTouchStart={() => {
            if (isTouchScreen) {
              buttonRef.current.classList.add(css.visible);
            }
          }}
          onTouchEnd={() => {
            if (isTouchScreen) {
              buttonRef.current.classList.remove(css.visible);
            }
          }}
          className={classNames(css.favorite, {
            [css.live]: isLiveGame(),
            [css.mobile]: isTouchScreen,
          })}
          ref={buttonRef}
        >
          <div className={css.hover} />
          {favorite ? (
            <img src={favoriteAdd} alt="" />
          ) : (
            <img src={favoriteRemove} alt="" />
          )}
        </div>
      )}
      <div className={css.test}></div>
    </>
  );
}
