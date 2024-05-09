import {useTranslation} from "react-i18next";
import css from "./prohibited-country.module.css";
import {Link} from "react-router-dom";
import React from "react";
import Button from "../../../../components/button/button";
import classNames from "classnames";

export default function ProhibitedCountry({message, onClickOk}) {
    const {t} = useTranslation();

    return (
        <div className={css.container}>
            <div className={css.title}>{t("Error")}</div>
            <div className={classNames(css.center, css.text)}>
                <span>{t("In accordance with")}</span>
                <Link to={"/terms-of-use#section2.1"} target={"_blank"}>{t("conditions uses")}</Link>
                <span>{t("we cannot accept user from this country")}</span>
            </div>
            <div className={css.center}>
                <Button onClick={onClickOk} className={css.btn}>{t("Ok")}</Button>
            </div>
        </div>
    );
}