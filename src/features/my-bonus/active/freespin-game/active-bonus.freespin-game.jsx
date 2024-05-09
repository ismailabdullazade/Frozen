import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Loader from "../../../../components/loader/Loader";
import {setGame} from "../../../games/game.slice";
import {num_word} from "../../../../utils/numerals";
import css from "./active-bonus.freespin-game.module.css";
import React, { useEffect } from "react";
import {useGetAvailableForFreespinQuery} from "../../../../app/api/games.api";
import { NavLink } from "react-router-dom";

export default function FreespinGame ({activeBonus}){
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const {data: availableForFreespin, freeespinGameIsLoading } = useGetAvailableForFreespinQuery();

  const identifier = availableForFreespin?.data[0].identifier;
  const provider = availableForFreespin?.data[0].provider;
  const game = useSelector(state => state.game.game);

  useEffect(() => {
    if (availableForFreespin) {
      dispatch(setGame({id: identifier, provider, mode: "play"}))
    }
  }, [availableForFreespin])

  if (freeespinGameIsLoading) {
    return <Loader/>;
  }
  const gameClick = game => {
    dispatch(setGame({
      mode: "play",
      id: game.identifier
    }));
  }
  const getNumeral = val => {
    if (i18n.resolvedLanguage === "en") {
      return val > 1 ? t("Freespins") : t("Freespin")
    }
    if (i18n.resolvedLanguage === "ru") {
      const words = [t("Freespin"), t("Freespins2-4"), t("Freespins5-9")];
      return num_word(val, words)
    }
  }
  const freespinAmount = availableForFreespin?.data[0].has_freespins ? (activeBonus.freespin_amount??0) : 0

  if (!game) {
    return null;
  }

  return availableForFreespin?.data?.length ? 
    <NavLink to={`/games/${game.id}`} activeClassName="active">
        <div className={css.freespinGame}>
          <div className={css.freespinGame__wrapper} onClick={() => gameClick(availableForFreespin.data[0])}>
            <img src={availableForFreespin.data[0].images["380x380"]} className={css.freespinGame__image} alt=""/>
            <div>
              <div className={css.freespinGame__infoTitle}>{availableForFreespin.data[0].title}</div>
              <div className={css.freespinGame__infoAmount}>
                {freespinAmount}
              </div>
              <div className={css.freespinGame__infoUnits}>
                {getNumeral(freespinAmount)}
              </div>
            </div>
          </div>
        </div>
      </NavLink> : null;
}