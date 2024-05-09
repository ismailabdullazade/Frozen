import {useTranslation} from "react-i18next";

import ErrorLayout from "./layout";

import image from "../../images/items/Page-Error.png"
import line from "../../images/items/line.svg"
import line_604px from "../../images/items/line_604px.svg"

import css from "./error.module.css";

export default function Developing() {
    const {t} = useTranslation();
    const mediaQuery = window.matchMedia('(min-width: 1280px)');

    return (
        <ErrorLayout>
            <div className={css.image}>
                <img src={image} alt=""/>
            </div>
            <div className={css.description}>
                <div>
                    <div className={css.title}>{t("Page construction title")}</div>
                    {mediaQuery.matches ?
                        <img src={line}/> :
                        <img src={line_604px}/>}
                    <div className={css.text}>{t("engineering works text")}</div>
                    <div className={css.supportMail}>
                        <a className={css.mail} href="mailto:support@rocketmancasino.com">support@rocketmancasino.com</a>
                    </div>
                </div>
            </div>
        </ErrorLayout>
    );
}
