import ContentPane from "../../components/content-pane/content-pane";
import {useTranslation} from "react-i18next";
import css from "./terms-of-use.module.css";

export default function About() {
    const {t, i18n} = useTranslation();

    if (i18n.resolvedLanguage === "ru")

    return (
        <ContentPane title={t("About")}>
            <div className={css.text}>
                <p>Garilla Casino создано командой Garilla в 2022 году. Мы постоянно работаем, чтобы наши клиенты, играя в Garilla Casino, получали больше удовольствия, чем на других сервисах.</p>

                <p>Мы стремимся подарить нашим клиентам новые, яркие и исключительно приятные впечатления. </p>

                <p>Garilla Casino предоставляет качественные игровые настройки и функциональные возможности программного обеспечения. Особый приоритет для нас — обеспечение динамичных сеансов игры, необходимых для людей, живущих в активном ритме.</p>
            </div>
        </ContentPane>
    )

    else {
        return (
            <ContentPane title={t("About")}>
                <div className={css.text}>
                    <p>Garilla Casino was created by the Garilla team in 2022. We constantly work to make sure that our gamblers have more enjoyment playing at the Garilla Casino than elsewhere.</p>

                    <p>We want to deliver modern, flashy, and most importantly of all pleasant experiences to our players.
                    </p>

                    <p>Garilla Casino provides appealing gaming setups and software features that are respectively better, we’re especially focused on providing the type of all-action gaming sessions that those with an occupied style of living are searching for.
                    </p>
                </div>
            </ContentPane>
        )
    }
}