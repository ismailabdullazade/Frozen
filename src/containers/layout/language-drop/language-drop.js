import css from "./language-drop.module.css";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Dropdown from "../../../components/dropdown/dropdown";
import React, { useState } from "react";

export default function LanguageDrop() {
  const { t, i18n } = useTranslation();
  const [langSelectorOpened, setLangSelectorOpened] = useState(false);
  const language =
    i18n.language.indexOf("-") > 0
      ? i18n.language.split("-")[0].toLowerCase()
      : i18n.language;

  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        <div
          onClick={() =>
            language === "ru"
              ? i18n.changeLanguage("en")
              : i18n.changeLanguage("ru")
          }
          // onClick={() => i18n.changeLanguage('ru')}
          className={classNames(css.switcher, {
            [css.active]: language === "ru",
          })}
        >
          ru
        </div>
        <div
          onClick={() =>
            language === "en"
              ? i18n.changeLanguage("ru")
              : i18n.changeLanguage("en")
          }
          // onClick={() =>  i18n.changeLanguage('en')}
          className={classNames(css.switcher, {
            [css.active]: language === "en",
          })}
        >
          en
        </div>
      </div>
    </div>
  );
}
