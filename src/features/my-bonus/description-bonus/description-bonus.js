import { useTranslation } from "react-i18next";
import css from "./description-bonus.module.css";
import classNames from "classnames";
import { num_word } from "../../../utils/numerals";
import React, { useEffect } from "react";
import { useGetAvailableForFreespinQuery } from "../../../app/api/games.api";
import { useDispatch, useSelector } from "react-redux";
import { setGame } from "../../games/game.slice";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom";

export default function DescriptionBonus({ bonus, variant, withTitle = true }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const freeSpins = bonus?.freespin_amount;
  const { data: availableForFreespin, freespinGameIsLoading } =
    useGetAvailableForFreespinQuery();
  const minimalDepositAmount = new Intl.NumberFormat("ru-RU").format(
    bonus?.deposit_min_amount / 100
  );
  const maximumBonusAmount = new Intl.NumberFormat("ru-RU").format(
    bonus?.wager_max_bonus / 100
  );
  const maxSummFreespinBonus = new Intl.NumberFormat("ru-RU").format(
    bonus?.freespin_max_bonus / 100
  );
  const maximumWinAmount = bonus?.wager_max_win;
  const maximumBet = new Intl.NumberFormat("ru-RU").format(
    bonus?.max_bet / 100
  );
  const bonusAmount = new Intl.NumberFormat("ru-RU").format(
    bonus?.bonus_amount / 100
  );
  const wager = bonus?.wager_show;
  const minBalanceToClose = new Intl.NumberFormat("ru-RU").format(
    bonus?.wager_min_cash_to_stop / 100
  );
  const bonusPeriod = bonus?.wager_period;
  const depositBonusPercent = bonus?.deposit_bonus_percent;
  const freeSpinGame =
    variant === "active_bonus"
      ? availableForFreespin?.data[0]?.title
      : bonus?.free_spin_game?.title ?? "";
  const freespinAmount = bonus?.freespin_amount;

  const identifier =
    variant === "active_bonus"
      ? availableForFreespin?.data[0]?.identifier
      : bonus?.free_spin_game?.identifier ?? "";
  const provider =
    variant === "active_bonus"
      ? availableForFreespin?.data[0]?.provider
      : bonus?.free_spin_game?.provider ?? "";

  const game = useSelector((state) => state.game.game);

  useEffect(() => {
    const unlisten = history.listen((location) => {
      if (location.pathname === "/") {
        dispatch(setGame(null));
      }
    });

    return () => {
      unlisten();
    };
  }, [history, dispatch]);

  useEffect(() => {
    if (availableForFreespin || bonus?.free_spin_game) {
      dispatch(setGame({ id: identifier, provider, mode: "play" }));
    }
  }, [availableForFreespin, bonus?.free_spin_game, identifier, provider]);

  const getNumeral = (val) => {
    if (i18n.resolvedLanguage === "en") {
      return val > 1 ? t("Freespins") : t("Freespin");
    }
    if (i18n.resolvedLanguage === "ru") {
      const words = [t("Freespin"), t("Freespins2-4"), t("Freespins5-9")];
      return num_word(val, words);
    }
  };

  return (
    <div className={classNames(css.wallet, css.description, css[variant])}>
      {withTitle &&
        (bonus?.bonus_slot_type_id === 5 ? (
          <div className={css.info_title}>
            {t("Bonus")}
            &nbsp;
            <span className={css.info_title__color}>
              {bonusAmount}&nbsp;RUB
            </span>
          </div>
        ) : (
          <div className={classNames(css.info_title)}>
            {depositBonusPercent ? (
              <div>
                {t("Bonus")}
                <span className={classNames(css.info_title__color, css.wallet)}>
                  {" "}
                  {depositBonusPercent}%{" "}
                </span>
                {t("to the deposit")}
              </div>
            ) : null}
            {bonus?.freespin_amount && (
              <>
                <span className={classNames(css.info_title__color, css.wallet)}>
                  {depositBonusPercent ? "+" : ""} {freeSpins}
                </span>
                &nbsp;FreeSpin
              </>
            )}
          </div>
        ))}
      <div className={css.info_block}>
        {bonus?.bonus_slot_type_id !== 5 && //бездепозитный бонус
        bonus?.deposit_min_amount ? (
          <span className={css.info_block__text}>
            {t("Minimal deposit amount")} -
            <span className={css.info_block__active}>
              {" "}
              {minimalDepositAmount} RUB
            </span>
          </span>
        ) : null}
        {bonus?.wager_max_bonus && !(bonus?.bonus_slot_type_id === 6 || bonus?.bonus_slot_type_id === 2) ? (
            <span className={css.info_block__text}>
                {!bonus?.sticky_bonus
                    ? t("bonus amount")
                    : t("Maximum bonus amount")}{" "}
                <span className={css.info_block__active}>
                    {" "}
                    {maximumBonusAmount} RUB
                </span>
            </span>
        ) : null}
        {bonus?.freespin_max_bonus &&
        (bonus?.bonus_slot_type_id === 2 ||
          bonus?.bonus_slot_type_id === 3 ||
          bonus?.bonus_slot_type_id === 6) ? (
          <span className={css.info_block__text}>
            {t("the max win amount Freespin bonus")} -{" "}
            <span className={css.info_block__active}>
              {" "}
              {maxSummFreespinBonus} RUB
            </span>
          </span>
        ) : null}
        {
          //bonus?.bonus_slot_type_id !== 5//бездепозитный бонус &&
          bonus?.wager_max_win && bonus?.sticky_bonus ? (
            <span className={css.info_block__text}>
              {t("the maximum bonus after wagering is")} -
              <span className={css.info_block__active}>
                {" "}
                x {maximumWinAmount}
              </span>
            </span>
          ) : null
        }
        {bonus?.max_bet ? (
          <span className={css.info_block__text}>
            {t("Maximum bet")} -
            <span className={css.info_block__active}> {maximumBet} RUB</span>
          </span>
        ) : null}
        {bonus?.wager_show ? (
          <span className={css.info_block__text}>
            {bonus?.sticky_bonus
              ? t("Wager")
              : t("the wager is won back from the real balance")}{" "}
            -<span className={css.info_block__active}> x {wager}</span>
          </span>
        ) : null}
        {bonus?.bonus_slot_type_id !== 5 && //бездепозитный бонус
        bonus?.bonus_slot_type_id !== 1 &&
        freeSpins ? (
          <span className={css.info_block__text}>
            <span className={css.info_block__active}>
              {freeSpins}&nbsp;
              {freeSpinGame ? null : (
                <span className={css.info_block__text}>
                  {getNumeral(freespinAmount)}
                </span>
              )}
            </span>
            {freeSpinGame && game ? (
              <>
                {getNumeral(freespinAmount)} {t("in")} -&nbsp;
                <NavLink to={`/games/${game.id}`} activeClassName="active">
                  <span className={css.info_block__active}>{freeSpinGame}</span>
                </NavLink>
              </>
            ) : null}
          </span>
        ) : null}
        {bonus?.wager_min_cash_to_stop && bonus?.sticky_bonus ? (
          <span className={css.info_block__text}>
            {t("the minimum balance to close the bonus is")} -
            <span className={css.info_block__active}>
              {" "}
              {minBalanceToClose} RUB
            </span>
          </span>
        ) : null}
        {bonusPeriod ? (
          <span className={css.info_block__text}>
            {t("Time to wager")} -
            <span className={css.info_block__active}>
              {" "}
              {bonusPeriod} {t("days")}
            </span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
