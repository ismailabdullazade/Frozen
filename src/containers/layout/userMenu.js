import React, { useEffect, useMemo, useState, useRef } from "react";
import css from "./layout.module.css";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetActiveBonusQuery,
  useGetBonusSlotQuery,
} from "../../app/api/bonus.api";
import { setOpenUserInfo } from "../../app/app.slice";
import useOnClickOutside from "../../utils/click-outside";

export default function UserMenu() {
  const { t } = useTranslation();
  const auth = useAuth();
  const dispatch = useDispatch();
  const {
    data: activeBonus,
    isLoading: fetchingActiveBonus,
    error,
  } = useGetActiveBonusQuery();
  const openUserInfo = useSelector((state) => state.app.openUserInfo);
  const rankTitle =
    auth?.user?.rank === null ? t("Player") : auth?.user?.rank?.title;

  const list = useRef();
  useOnClickOutside(list, (event) => {
    if (event.target.getAttribute("data-custom-attribute") === "user-acc") {
      return;
    }
    if (openUserInfo) {
      dispatch(setOpenUserInfo(false));
    }
  });

  const itemClick = () => {
    dispatch(setOpenUserInfo(false));
  };
  const userSelectorOpen = useSelector((state) => state.app.openUserInfo);
  const balance = useSelector((state) => state.user.balance);
  const { data, bonusLoading } = useGetBonusSlotQuery();

  return (
    <div
      className={classNames(css.user_info_block, {
        [css.show]: userSelectorOpen,
      })}
      ref={list}
    >
      <NavLink
        to={"/profile"}
        data-custom-attribute="user-link"
        onClick={() => itemClick()}
        activeClassName={css.active}
        className={classNames(
          css.user_info_block_item,
          css.user_info_block_item_1
        )}
      >
        <div className={css.user_info_block_item_name}>{t("profile")}</div>
        <div className={css.user_info_block_item_info}>
          {rankTitle},{" "}
          {auth?.user?.verified ? (
            <>{t("Verified")}</>
          ) : (
            <>{t("Not verified")}</>
          )}
        </div>
      </NavLink>
      <NavLink
        to={activeBonus ? "/my-bonus" : "/my-bonus/available"}
        data-custom-attribute="user-link"
        onClick={() => itemClick()}
        activeClassName={css.active}
        className={classNames(
          css.user_info_block_item,
          css.user_info_block_item_2
        )}
      >
        <div className={css.user_info_block_item_name}>{t("bonuses")}</div>
        <div className={css.user_info_block_item_info}>
          {data && data?.length ? (
            <div>
              {t("Available_bonuses")} : {data.length}
            </div>
          ) : (
            <div>{t("You don't have available bonuses")}</div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={"/wallet"}
        data-custom-attribute="user-link"
        onClick={() => itemClick()}
        activeClassName={css.active}
        className={classNames(
          css.user_info_block_item,
          css.user_info_block_item_3
        )}
      >
        <div className={css.user_info_block_item_name}>{t("wallet")}</div>
        {balance && (
          <div className={css.user_info_block_item_info}>
            {(balance.balance / 100)
              .toLocaleString(undefined, { minimumFractionDigits: 2 })
              .replace(",", ".")}
            <span className={css.sign}>{auth.user.currency?.sign}</span>
            &nbsp;/&nbsp;
            <span className={css.user_info_block_item_info_balance}>
              {(balance.bonus_balance / 100)
                .toLocaleString(undefined, { minimumFractionDigits: 2 })
                .replace(",", ".")}
              <span className={css.sign}>
                <svg
                  width="13"
                  height="10"
                  viewBox="0 0 13 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.32652 0.298108L5.58271 2.10235e-05L2.7823 2.05338e-05L-5.60914e-07 3.20806L2.82376 3.20806L5.32652 0.298108ZM3.49413 3.20828L8.78312 3.20828L7.34525 1.53585L6.13894 0.132908L4.31594 2.25248L3.49413 3.20828ZM0.0338378 3.71649L5.29206 9.24968L2.7775 3.7165L0.0338378 3.71649ZM8.9424 3.71607L8.48415 3.71607L6.55748 3.7165L3.33482 3.7165L6.12213 9.84934L6.14005 9.88839L8.79575 4.0399L8.9424 3.71607ZM6.99154 9.24181L12.2415 3.71672L9.50018 3.71672L6.99154 9.24181ZM12.2757 3.20806L9.49254 1.65973e-06L6.6941 1.17043e-06L9.45283 3.20806L12.2757 3.20806Z"
                    fill="#6A6A6A"
                  />
                </svg>
              </span>
            </span>
          </div>
        )}
      </NavLink>
    </div>
  );
}
