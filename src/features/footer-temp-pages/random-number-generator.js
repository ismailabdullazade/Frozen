import ContentPane from "../../components/content-pane/content-pane";
import {useTranslation} from "react-i18next";
import css from "./terms-of-use.module.css";

export default function RandomGenerator() {
    const {t, i18n} = useTranslation();

    if (i18n.resolvedLanguage === "ru")

        return (
            <ContentPane title={t("Random number generator")}>
                <div className={css.text}>
                    <p><b>Наш ГСЧ сертифицирован</b></p>
                    <a>ITECH LABS</a>

                    <p>
                        iTech Labs - одна из самых надежных и опытных частных независимых лабораторий тестирования игр в мире. Лаборатория работает в игровой индустрии уже более 15 лет.
                        Наш игровой контент тестируется в соответствии с техническими стандартами и юрисдикционными правилами, в том числе, алгоритм и реализация Генератора Случайных Чисел.
                    </p>
                </div>
            </ContentPane>
        )

    else {
        return (
            <ContentPane title={t("Random number generator")}>
                <div className={css.text}>
                    <p><b>Our RNG is certified by</b></p>
                    <a>ITECH LABS</a>

                    <p>
                        iTech Labs is one of the most trustworthy and most accomplished private independent gaming testing labs in the world. The lab has been serving the gaming industry for over 15 years.

                    </p>
                    <p>Our gaming content is tested according to the technical standard and jurisdictional rules, such as but not limited to Random Number Generator algorithm and implementation.
                    </p>
                </div>
            </ContentPane>
        )
    }
}