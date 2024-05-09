import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import { useGetBalanceQuery, useGetUserQuery } from "../../../app/api/user.api";
import css from "./balance.module.css";
import { useAuth } from "../../../services/auth";
// import chevron from "../../../images/header/chevron-rigth.svg";
import Button from "../../../components/button/button";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBalance } from "../user.slice";
// import useWebSocket from "../../../services/websocket";
// import coins from "../../../images/header/coins.svg"
import classNames from "classnames";
import { setGame } from "../../games/game.slice";
import Loader from "../../../components/loader/Loader";

export default function Balance() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { data } = useGetBalanceQuery();
  const auth = useAuth();
  const balance = useSelector((state) => state.user.balance);
  const button = useRef();
  const container = document.getElementById("container");
  const containerWidth = container?.clientWidth;
  const history = useHistory();
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game.game);
  const [isAnimating, setIsAnimating] = useState(false);

  const listener = function (e) {
    e = e || window.event;
    var start = 0,
      diff = 0;
    let source = e.changedTouches
      ? e.changedTouches[e.changedTouches.length - 1]
      : e;
    if (source.pageX) start = source.pageX;
    else if (source.clientX) start = source.clientX;

    document.body.ontouchmove = document.body.onmousemove = function (e) {
      e = e || window.event;
      let end = 0;
      let source = e.changedTouches
        ? e.changedTouches[e.changedTouches.length - 1]
        : e;
      if (source.pageX) end = source.pageX;
      else if (source.clientX) end = source.clientX;

      diff = end - start;

      if (
        diff <= containerWidth + 2 - button.current.clientWidth &&
        diff >= 0
      ) {
        button.current.style.left = diff + "px";
      }
    };

    /*document.body.onmouseleave = */ document.body.ontouchend =
      document.body.onmouseup = function () {
        button.current.classList.add(css.automovement);

        if (containerWidth - diff > button.current.clientWidth) {
          //фикс чтобы кнопка не съезжала
          button.current.style.left = 0 + "px";
        }
        /*  document.body.onmouseleave = */ document.body.ontouchmove =
          document.body.onmousemove =
          document.body.ontouchend =
          document.body.onmouseup =
            null;

        if (diff > containerWidth / 1.7 - button.current.clientWidth / 2) {
          history.push("/wallet");
        }
        setTimeout(() => {
          button.current?.classList.remove(css.automovement);
        }, 300);
        button.current.style.left = 0;
      };
  };

  useEffect(() => {
    if (data && !balance) {
      dispatch(setBalance(data));
    }
  }, [data]);

  useEffect(() => {
    if (button.current && container) {
      button.current.ontouchstart = button.current.onmousedown = listener;
    }

    return () => {
      if (button.current) {
        button.current.ontouchstart = button.current.onmousedown = null;
      }
    };
  }, [containerWidth]);

  return (
    <>
      {balance === null ? (
        <Loader />
      ) : (
        <div className={css.balance} id="container">
          <Button
              referal={button}
              childrenClassName={classNames(css.button__children, {
                [css.animate]: isAnimating,
              }, css.top_up_btn)}
              variant={"gold"}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setIsAnimating(false);
                  history.push("/wallet");
                  if (Boolean(game)) dispatch(setGame(null));
                }, 700);
              }}
          >
            {t("top up")}
          </Button>
        </div>
      )}
    </>
  );
}
