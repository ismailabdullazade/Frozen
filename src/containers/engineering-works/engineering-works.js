import image from "../../images/error.png";
import css from "./style.module.css";
import {useTranslation} from "react-i18next";

export default function EngineeringWorks() {
    const {t} = useTranslation();

    return <div className={css.layout}>
        <div className={css.image}>
            <img src={image} alt=""/>
        </div>
        <div className={css.description}>
            <div>
                <div className={css.title}>{t("engineering works")}</div>
                <div className={css.text}>
                    <span>{t("engineering works text")}</span>
                    <br/><br/>
                    <a href="mailto:support@garillacasino.com">support@garillacasino.com</a>
                </div>
            </div>
        </div>
    </div>
}