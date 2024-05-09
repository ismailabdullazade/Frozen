import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

import ErrorLayout from "./layout";

import image from "../../images/items/404.png"
import line from "../../images/items/line.svg"
import line_604px from "../../images/items/line_604px.svg"

import css from "./error.module.css";

export default function NotFound() {
    const {t} = useTranslation();
    const mediaQuery = window.matchMedia('(min-width: 1280px)');


    return (
        <ErrorLayout>
            <div className={css.image}>
                <img src={image} alt=""/>
            </div>
            <div className={css.description}>
                <div>
                    {mediaQuery.matches ?
                        <div className={css.title}>{t("error 404 title")}</div> :
                        <div className={css.title}>{t("error 404 title second")}</div>}
                    {mediaQuery.matches ?
                        <img src={line}/> :
                        <img src={line_604px}/>}
                    <div className={css.text}>{t("error 404 text first")}</div>
                    <div className={css.text}>{t("error 404 text second")}<Link to="/" exact={true}>{t("error 404 link text")}</Link></div>
                </div>
            </div>
        </ErrorLayout>
    );
}
