import css from "./main-footer.module.css";
// eslint-disable-next-line
import { Link, NavLink } from "react-router-dom";
import React, { useMemo } from "react";
import { useMediaQuery } from "beautiful-react-hooks";
import { useTranslation } from "react-i18next";
import { useFetchSiteSectionQuery } from "../../../app/api/games.api";
import iphone from "./../../../images/iphone.svg";
import android from "./../../../images/android.svg";

import logoNameRCM_svg from "../../../images/footer-icons/logo_rcm_footer.svg";
import telegram_social_svg from "../../../images/footer-icons/telegram_icon_footer.svg";
import instagram_social_svg from "../../../images/footer-icons/instagram_icon_footer.svg";
import footer_app_android from "../../../images/footer-icons/android_app_footer.svg";
import footer_support_1 from "../../../images/footer-icons/1.svg";
import footer_support_2 from "../../../images/footer-icons/2.svg";
import footer_support_3 from "../../../images/footer-icons/3.svg";
import iTechLabs_footer from "../../../images/footer-icons/itechLabs_footer.svg";
import gamingCuracao from "../../../images/footer-icons/GamingCuracao_footer.svg";
import separator from "../../../images/footer-icons/separator_footer_modal.svg";
import tg_icon_footer from "../../../images/footer-icons/tg_icon_footer.svg";
import message_icon_footer from "../../../images/footer-icons/message_icon_footer.svg";
import beGamble_colorful from "../../../images/footer-icons/Vector.svg";
import gameCare_colorful from "../../../images/footer-icons/gamecare_icon_colorful.svg";
import eighteenPlus_colorful from "../../../images/footer-icons/eighteen_plus_colorful.svg";

export default function FooterMain() {
  const { t, i18n } = useTranslation();
  function openLiveChat() {
    if (typeof window?.LC_API !== "undefined") {
      window?.LC_API?.open_chat_window();
    }
  }
  const { data } = useFetchSiteSectionQuery();
  const sections = useMemo(() => {
    if (data)
      return data.filter(
        (section) => section.language === i18n.resolvedLanguage,
      );
    else return [];
    // eslint-disable-next-line
  }, [data]);

  const halfWayIndex = Math.ceil(sections.length / 2);

  const first = sections.slice(0, halfWayIndex);
  const second = sections.slice(halfWayIndex);

  return (
    <div className={css.shadow_container}>
      <div className={css.main_footer}>
        <div className={css.main_container}>
  {/* LOGO */}
          <div className={css.logo_container_rcm}>
            <img alt="logo_rcm_footer" src={logoNameRCM_svg} />
          </div>
{/* MOBILE SOCIAL LINK */}
          <div className={css.container_footer_navlinks}>

              <div className={css.social_link_buttons_mobile}>
                  <Link
                  to={{ pathname: "https://www.instagram.com/garilla_inst" }}
                  target={"_blank"}
                  >
                    <img src={instagram_social_svg} alt="instagramLink"/>
                  </Link>

                  <Link
                  to={{ pathname: "https://t.me/GARILLA_CASINO_OFFICIAL" }}
                  target={"_blank"}
                  >
                    <img src={telegram_social_svg} alt="telegramLink" />
                  </Link>
              </div>
{/* ABOUT US */}

            <div className={css.container_footer_about_us}>
              <div className={css.about_us_container}>
              {first.map((section) => {
                    return (
                        <Link key={section.slug} to={`/${section.slug}`}>{t(section.slug)}</Link>
                    );
                })}
                {second.map((section) => {
                    return (
                        <Link key={section.slug} to={`/${section.slug}`}>{t(section.slug)}</Link>
                    );
                })}
              </div>
            </div>
{/* SUPPORT MOBILE */}
              <div className={css.support_mobile_container}>
                <div className={css.support_container_button}>
                    <img src={footer_support_1} alt="support" />
                    <div className={css.chat_support_label}>{t("support 24/7")}</div>
                    <img src={footer_support_3} alt="support" />

                    <div className={css.support_modal_container_footer}>
                      <div
                        onClick={() => openLiveChat()}
                      >
                        <img src={message_icon_footer} alt="sample"/>
                        <span>{t("write to chat")}</span>
                      </div>
                      <div>
                        <img src={separator} alt="separator"/>
                      </div>
                      <Link
                      className={css.message_to_telegram_button}
                        to={{ pathname: "https://t.me/Garilla_Casino_Support_bot" }}
                        target={"_blank"}
                      >
                        <img src={tg_icon_footer} alt="sample"/>
                        <span>Telegram</span>
                      </Link>
                    </div>
                </div>
              </div>
  {/* FOOTER SUPPORT */}
            <div className={css.container_footer_support}>
              <p>{t("technical support")}</p>
              <p>@rocketman.com</p>
              <p>{t("commercial offers")}</p>
              <p>press-service@rocketman.com</p>
              <p>{t("affiliate program")}</p>
              <p>support@rocketman.partners</p>
            </div>
  {/* SOCIAL SUPPORT */}
              <div className={css.container_social_support_new}>
                  <div className={css.support_container_button}>
                      <img src={footer_support_1} alt="support"/>
                      <div className={css.chat_support_label}>{t("support 24/7")}</div>
                      <img src={footer_support_3} alt="support"/>

                      <div className={css.support_modal_container_footer}>
                          <div
                              onClick={() => openLiveChat()}
                          >
                              <img src={message_icon_footer} alt="sample"/>
                              <span>{t("write to chat")}</span>
                          </div>
                          <div>
                              <img src={separator} alt="separator"/>
                          </div>
                          <Link
                              className={css.message_to_telegram_button}
                              to={{pathname: "https://t.me/Garilla_Casino_Support_bot"}}
                              target={"_blank"}
                          >
                              <img src={tg_icon_footer} alt="sample"/>
                              <span>Telegram</span>
                          </Link>
                      </div>
                  </div>
                  <div className={css.social_link_buttons}>
                      <Link
                          to={{pathname: "https://www.instagram.com/garilla_inst"}}
                          target={"_blank"}
                      >
                          <img src={instagram_social_svg} alt="instagramLink"/>
                      </Link>

                      <Link
                          to={{pathname: "https://t.me/GARILLA_CASINO_OFFICIAL"}}
                          target={"_blank"}
                      >
                          <img src={telegram_social_svg} alt="telegramLink"/>
                      </Link>
                  </div>
              </div>
          </div>
            {/* PARTNERS */}
            <div className={css.partners_container_footer_mobile}>
                <div className={css.second_container_partner}>
                    <Link
                        className={css.partner_begamble_mobile}
                        to={{pathname: "https://www.begambleaware.org/"}}
                        target={"_blank"}
                    >
                        <img src={beGamble_colorful} alt=""/>
                    </Link>
                    <Link
                        className={css.partner_gamecare_mobile}
                        to={{pathname: "https://www.gamcare.org.uk/"}}
                        target={"_blank"}
                    >
                        <img src={gameCare_colorful} alt=""/>
                    </Link>
                </div>
                <div className={css.first_container_partner}>
                    <Link
                        className={css.partner_itechlabs_mobile}
                        to={{pathname: "https://itechlabs.com/"}}
                        target={"_blank"}
                    >
                        <img src={iTechLabs_footer} alt=""/>
                    </Link>
                    <a href={"#"}
                       className={css.partner_eighteenplus_mobile}>
                <img src={eighteenPlus_colorful} alt="" />
              </a>
              <Link
              className={css.partner_curacao_mobile}
                target={"_blank"}
                to={{
                  pathname:
                    "https://licensing.gaming-curacao.com/validator/?lh=ca4f0acc960fef5397993f7940630b3d&rlh=9471a23b0a82c225f9c9e57369bd6983",
                }}
              >
                <img src={gamingCuracao} alt="" />
              </Link>
            </div>

          </div>
  {/* DESKTOP */}
          <div className={css.partners_container_footer_desktop}>
            <Link
            className={css.partner_begamble}
              to={{ pathname: "https://www.begambleaware.org/" }}
              target={"_blank"}
            >
              <img className={css.footer_begamble_icon} src={beGamble_colorful} alt="" />
            </Link>
            <Link
            className={css.partner_gamecare}
              to={{ pathname: "https://www.gamcare.org.uk/" }}
              target={"_blank"}
            >
              <img className={css.footer_gamecare_icon} src={gameCare_colorful} alt="" />
            </Link>
            <a
            href={"#"}
            className={css.partner_eighteenplus}
            >
              <img className={css.footer_eighteenplus_icon} src={eighteenPlus_colorful} alt="" />
            </a>
            <Link
            className={css.partner_curacao}
              target={"_blank"}
              to={{
                pathname:
                  "https://licensing.gaming-curacao.com/validator/?lh=ca4f0acc960fef5397993f7940630b3d&rlh=9471a23b0a82c225f9c9e57369bd6983",
              }}
            >
              <img className={css.footer_gamincuracao_icon} src={gamingCuracao} alt="" />
            </Link>
            <Link
            className={css.partner_itechlabs}
              to={{ pathname: "https://itechlabs.com/" }}
              target={"_blank"}
            >
              <img className={css.footer_itechLabs_icon} src={iTechLabs_footer} alt="" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
