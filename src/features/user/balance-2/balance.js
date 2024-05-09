import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import { useGetBalanceQuery } from "../../../app/api/user.api";
import css from "./balance.module.css";
import { useAuth } from "../../../services/auth";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBalance } from "../user.slice";
import classNames from "classnames";
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
          <div className={css.currency}>
            <div className={css.line}>
              <span className={classNames(css.sign, css.sign_currency)}>
                {auth.user.currency?.sign}
              </span>
              <span>
                {(balance?.balance / 100)
                  .toLocaleString(undefined, { minimumFractionDigits: 2 })
                  .replace(",", ".")}
              </span>
            </div>
            <div className={css.line}>
              <span className={css.sign}>
                <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1714_19362)">
                    <path
                        d="M3.4375 0.96875C3.4375 0.708984 3.22852 0.5 2.96875 0.5C2.70898 0.5 2.5 0.708984 2.5 0.96875V1.75C1.81055 1.75 1.25 2.31055 1.25 3H0.46875C0.208984 3 0 3.20898 0 3.46875C0 3.72852 0.208984 3.9375 0.46875 3.9375H1.25V5.03125H0.46875C0.208984 5.03125 0 5.24023 0 5.5C0 5.75977 0.208984 5.96875 0.46875 5.96875H1.25V7.0625H0.46875C0.208984 7.0625 0 7.27148 0 7.53125C0 7.79102 0.208984 8 0.46875 8H1.25C1.25 8.68945 1.81055 9.25 2.5 9.25V10.0312C2.5 10.291 2.70898 10.5 2.96875 10.5C3.22852 10.5 3.4375 10.291 3.4375 10.0312V9.25H4.53125V10.0312C4.53125 10.291 4.74023 10.5 5 10.5C5.25977 10.5 5.46875 10.291 5.46875 10.0312V9.25H6.5625V10.0312C6.5625 10.291 6.77148 10.5 7.03125 10.5C7.29102 10.5 7.5 10.291 7.5 10.0312V9.25C8.18945 9.25 8.75 8.68945 8.75 8H9.53125C9.79102 8 10 7.79102 10 7.53125C10 7.27148 9.79102 7.0625 9.53125 7.0625H8.75V5.96875H9.53125C9.79102 5.96875 10 5.75977 10 5.5C10 5.24023 9.79102 5.03125 9.53125 5.03125H8.75V3.9375H9.53125C9.79102 3.9375 10 3.72852 10 3.46875C10 3.20898 9.79102 3 9.53125 3H8.75C8.75 2.31055 8.18945 1.75 7.5 1.75V0.96875C7.5 0.708984 7.29102 0.5 7.03125 0.5C6.77148 0.5 6.5625 0.708984 6.5625 0.96875V1.75H5.46875V0.96875C5.46875 0.708984 5.25977 0.5 5 0.5C4.74023 0.5 4.53125 0.708984 4.53125 0.96875V1.75H3.4375V0.96875ZM3.125 3H6.875C7.2207 3 7.5 3.2793 7.5 3.625V7.375C7.5 7.7207 7.2207 8 6.875 8H3.125C2.7793 8 2.5 7.7207 2.5 7.375V3.625C2.5 3.2793 2.7793 3 3.125 3ZM6.875 3.625H3.125V7.375H6.875V3.625Z"
                        fill="#FA00FF"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1714_19362">
                      <rect width="10" height="10" fill="white" transform="translate(0 0.5)"/>
                  </clipPath>
                  </defs>
                </svg>
              </span>
              <span>
                {(balance?.bonus_balance / 100)
                    .toLocaleString(undefined, {minimumFractionDigits: 2})
                    .replace(",", ".")}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
