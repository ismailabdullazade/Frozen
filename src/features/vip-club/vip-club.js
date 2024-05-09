import css from "./vip-club.module.css"
import {useTranslation} from "react-i18next";
import hackerCard from "./../../images/ranks/cards ranks/hacker.png";
import hackerCardEn from "./../../images/ranks/cards ranks/hacker_en.png";
import rmCard from "./../../images/ranks/cards ranks/rocketman.png";
import rmCardEn from "./../../images/ranks/cards ranks/rocketman_en.png";
import add_bonus from "../../images/vip/add_bonus.png"
import bday from "../../images/vip/bday.png"
import cashback from "../../images/vip/cashback.png"
import high_limit from "../../images/vip/high_limit.png"
import newyear from "../../images/vip/newyear.png"
import personal_manager from "../../images/vip/personal_manager.png"
import quick_extract from "../../images/vip/quick_extract.png"

export default function VipClub() {
    const { t, i18n } = useTranslation();
    const rus = i18n.resolvedLanguage === "ru";

    return (
        <div className={css.vip_club_container}>
            <div className={css.header_and_cards_container}>
                <div className={css.vip_card_container}>
                    <div>
                        {
                            rus? (
                                <img src={hackerCard} alt="hackerCard" />
                            ) : (
                                <img src={hackerCardEn} alt="hackerCard" />
                            )
                        }
                    </div>
                    <div>
                        {
                            rus? (
                                <img src={rmCard} alt="rocketManCard" />
                            ) : (
                                <img src={rmCardEn} alt="rocketManCard" />
                            )
                        }
                    </div>
                </div>
                <div className={css.header_vip_club}>
                    <h2>{t("What is a VIP club?")}</h2>
                    <h3>{t("The condition for assigning VIP status is the amount of deposits from 500,000 RUB")}</h3>
                </div>
            </div>

            <div className={css.details_of_vip_club_container}>
                <div>
                    <img src={cashback} alt=""/>
                    <p>{t("Individual Cashback")}</p>
                </div>
                <div>
                    <img src={newyear} alt=""/>
                    <p>{t("New Year's gift")}</p>
                </div>
                <div>
                    <img src={add_bonus} alt=""/>
                    <p>{t("additional bonuses")}</p>
                </div>
                <div>
                    <img src={high_limit} alt=""/>
                    <p>{t("Increased withdrawal limit")}</p>
                </div>
                <div>
                    <img src={bday} alt=""/>
                    <p>{t("Birthday gift")}</p>
                </div>
                <div>
                    <img src={quick_extract} alt=""/>
                    <p>{t("Accelerated withdrawal")}</p>
                </div>
                <div>
                    <img src={personal_manager} alt=""/>
                    <p>{t("personal manager")}</p>
                </div>
            </div>
        </div>
    )
}