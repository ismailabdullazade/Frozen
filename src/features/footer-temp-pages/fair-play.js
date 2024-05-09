import ContentPane from "../../components/content-pane/content-pane";
import {useTranslation} from "react-i18next";
import css from "./terms-of-use.module.css";
import license from "../../images/License_Certificate-Royal_Assa_N.V._2022-2023.jpg";

export default function FAQ() {
    const {t, i18n} = useTranslation();

    if (i18n.resolvedLanguage === "ru")

    return (
        <ContentPane title={t("FAQ")}>
            <div className={css.text}>
               <p>Garilla Casino имеет лицензию на игорный бизнес на Нидерландских Антильских островах и осуществляет свою деятельность в соответствии с законодательством страны.
               </p>
                <img src={license} alt="" style={{maxWidth: "800px", width: "100%"}}/>
            </div>
        </ContentPane>
    )

    else {
        return (
            <ContentPane title={t("Garilla Casino Fair play")}>
                <div className={css.text}>
                    <p>Garilla Casino is fully licensed by the gaming license of the Netherlands Antilles and is carried out in accordance with the legislation of the country.

                    </p>
                    <img src={license} alt="" style={{maxWidth: "800px", width: "100%"}}/>
                </div>
            </ContentPane>
        )
    }
}