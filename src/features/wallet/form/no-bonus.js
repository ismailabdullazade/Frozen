import card from "../../../images/wallet/image-deposit-card.png";
import css from "./style.module.css";
// import Button from "../../../components/button/button";
import {useTranslation} from "react-i18next";

export default function NoBonus() {
    const {t} = useTranslation();

    return <>
        <img src={card} className={css.card_img} alt=""/>
        <div className={css.no_bonus_text}>
            {t("You don't have available bonuses")}
        </div>
        {/*<div className={css.btn}> <Button>{t("top up")}</Button></div>*/}
    </>
}