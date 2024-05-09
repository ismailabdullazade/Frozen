import css from "./waiting-for-wager.module.css";
import waitingForWager from "../../images/Loading.gif"
import {useTranslation} from "react-i18next";

export default function WagerLoader({isDepositBonus }) {
  const {t} = useTranslation();

  return <div className={css.container}>
    <div className={css.wrapper}>
      <img src={waitingForWager} alt=""/>
      <div className={css.text}>{t(isDepositBonus ? "Waiting for deposit.." : "Waiting for wager..")}</div>
    </div>
  </div>
}