import { useTranslation } from "react-i18next";
import css from "./support-block.module.css";
import Button from "../../../components/button/button.2";
import classNames from "classnames";
import arrow from "./../../../images/arrow-support.svg";
import arrow_open from "./../../../images/arrow-support-open.svg";
import { useState } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { useMediaQuery } from "beautiful-react-hooks";
import faq_img from "./../../../images/footer-icons/faq.svg";
import LiveChat from "react-livechat";

export default function SupportBlock({ variant, sections }) {
  const [openMail, setOpenMail] = useState(false);
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 960px)");

  function openMeilMenu() {
    setOpenMail(!openMail);
  }
  const [showChatOptions, setShowChatOptions] = useState(false);

  function openLiveChat() {
    if (typeof window?.LC_API !== "undefined") {
      window?.LC_API?.open_chat_window();
    }
  }

  const faq = sections?.find((section) => section?.slug === "faq");

  return (
    <div
      className={classNames(css.wraper, css[variant], {
        [css.wraper_openMail]: openMail,
      })}
    >
      <div className={css.support_top}>
        <div className={css.support}>
          <div className={css.support_text__block}>
            <span className={css.support_title}>{t("support 24/7")}</span>
            <span className={css.support_text}>{t("support text")}</span>
          </div>
          <Button
            className={css.support_button}
            onClick={() => setShowChatOptions(true)}
          >
            {t("chat")}
          </Button>
          {showChatOptions && (
            <div className={css.support_chat__block}>
              <div
                className={css.support_chat__chat}
                onClick={() => openLiveChat()}
              >
                {t("write to chat")}
              </div>
              <LiveChat license={"17104467"} />
              <NavLink
                className={css.support_chat__telegram}
                to={{ pathname: "https://t.me/Garilla_Casino_Support_bot" }}
                target={"_blank"}
              >
                Telegram
              </NavLink>
            </div>
          )}
          <div
            className={classNames(
              css.support_arrow,
              css.support_arrow__reverse,
              { [css.support_arrow__open]: openMail },
            )}
            onClick={() => openMeilMenu()}
          >
            <img src={arrow} className={css.arrow_icon} alt="" />
            <img src={arrow_open} className={css.arrow_icon__open} alt="" />
          </div>
        </div>
        <NavLink to={`/${faq?.slug}`} className={css.support_faq}>
          <img src={faq_img} className={css.support_faq__img} alt="" />
        </NavLink>
      </div>
      <div
        className={classNames(css.support_mail__block, {
          [css.support_mail__blockOpen]: !isMobile || openMail,
        })}
      >
        <div className={css.support_block}>
          <span className={css.support_text}>{t("technical support")}</span>
          <span className={css.support_email}>support@garillacasino.com</span>
        </div>
        <div className={css.support_block}>
          <span className={css.support_text}>{t("commercial offers")}</span>
          <span className={css.support_email}>
            press-service@garillacasino.com
          </span>
        </div>
        <div className={css.support_block}>
          <span className={css.support_text}>{t("affiliate program")}</span>
          <span className={css.support_email}>support@garilla.partners</span>
        </div>
      </div>
    </div>
  );
}
