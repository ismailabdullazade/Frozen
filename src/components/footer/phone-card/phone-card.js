import css from "./phone-card.module.css";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

export default function PhoneCard(props) {
    const {image, title, variant, type} = props;
    const {t} = useTranslation();
    
    return (
        <div className={classNames(css.card, css[variant], css[type])}>
            <img src={image} className={css.card_img} alt="" />
            <div className={css.card_block}>
                <span className={css.card_block__text}>{t("application")}</span>
                <span className={css.card_block__title}>{title}</span>
            </div>
        </div>
    )
}