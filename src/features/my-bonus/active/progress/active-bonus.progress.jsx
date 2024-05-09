import css from "./active-bonus.progress.module.css";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import { num_word } from "../../../../utils/numerals";
import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import ProgressIcon from "../../ProgressIcon";

export default function ProgressBar({ activeBonus, showDetails }) {
  const { t, i18n } = useTranslation();
  const timeLeftHumanize = (date) => {
    const dateEnd = moment(date);
    if (!dateEnd.isValid()) {
      return "";
    }
    const diff = dateEnd.diff(moment(), "seconds");
    const duration = moment.duration(diff * 1000);
    if (diff > 86400) {
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      // const minutes = Math.floor((diff % 3600) / 60);
      // const seconds = diff % 60;

      return `${days} ${num_word(
        days,
        JSON.parse(t("Days (numeral list)"))
      )}, ${hours} ${num_word(hours, JSON.parse(t("Hours (numeral list)")))}`;
    }

    if (duration.asHours() >= 1) {
      const amount = duration.asHours();
      const hours = Math.floor(amount);
      const minutes = Number.isInteger(amount)
        ? ""
        : Math.floor(duration.asMinutes() - hours * 60);

      return `${hours} ${num_word(
        hours,
        JSON.parse(t("Hours (numeral list)"))
      )} ${
        minutes
          ? `${minutes} ${num_word(
              minutes,
              JSON.parse(t("Minutes (numeral list)"))
            )}`
          : ""
      }`;
    }

    if (duration.asMinutes() >= 1) {
      const amount = duration.asMinutes();
      const minutes = Math.floor(amount);

      return `${minutes} ${num_word(
        minutes,
        JSON.parse(t("Minutes (numeral list)"))
      )}`;
    }

    const seconds = duration.asSeconds();

    return `${seconds} ${num_word(
      seconds,
      JSON.parse(t("Seconds (numeral list)"))
    )}`;
  };
  const progress = useMemo(() => {
    if (activeBonus?.active_wager) {
      const calculatedProgress = (
        (activeBonus.active_wager?.current_amount /
          activeBonus.active_wager?.target_amount) *
        100
      ).toFixed(2);
      return Math.min(calculatedProgress, 100);
    }
    return 0;
  }, [activeBonus]);

  const progressLine = progress.toFixed(2);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("forced cache drop");
    dispatch({
      type: "BonusApi/invalidateTags",
      payload: ["ActiveBonus"],
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {showDetails && (
        <div
          className={classNames(css.detail__info, {
            [css.without_wager]: !activeBonus.active_wager,
          })}
        >
          {activeBonus.details}
        </div>
      )}
      <div className={css.detail__progress}>
        <div className={css.detail__progressTitle}>
          {t("Wagering the bonus amount")}
        </div>
        <ProgressIcon count={progress} className={css.detail__progressBar} /> {/*0 - 100*/}
        <div className={css.detail__progressCaption}>
          <span>{t("start")}</span>
          <span className={css.detail__left}>
            {i18n.resolvedLanguage === "en" ? (
              <span style={{ textTransform: "lowercase" }}>
                {timeLeftHumanize(activeBonus.active_wager?.end_time)}
                &nbsp;
                {t("Left")}
              </span>
            ) : (
              <span>
                {t("Left")}
                &nbsp;
                {timeLeftHumanize(activeBonus.active_wager?.end_time)}
              </span>
            )}
          </span>
          <span>{isNaN(progressLine) ? t("Win") : progressLine + "%"}</span>
        </div>
        <div className={css.detail__progressCountLeft}></div>
      </div>
    </>
  );
}
