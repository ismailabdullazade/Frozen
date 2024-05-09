import { useTranslation } from "react-i18next";
import css from "./free-money.module.css";
import topBanner from "../../images/free-money/fm_main_banner_new.png";
import topBannerEn from "../../images/free-money/fm_main_banner_en_new.png";
import topBannerMob from "../../images/free-money/fm_main_banner_mob_new.png";
import topBannerMobEn from "../../images/free-money/fm_main_banner_mob_en_new.png";
import rectangle_pink from "../../images/free-money/rectangle_pink_btn.png"
import subscribe from "./../../images/free-money/subscribe.svg";
import { useMediaQuery } from "beautiful-react-hooks";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

export default function FreeMoney() {
  const { i18n, t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={css.fm_wrapper}>
      {/* <div className={css.fm_border}></div> */}
      <div className={css.main_banner}>

      </div>

      <div className={css.fm_group}>
        <div className={css.fm_tg}>
          <div className={css.fm_bonus}>
          <div className={css.bonus_quantity}>150 ₽</div>
            <div className={css.txt_btn_bonus_container}>
              <div className={css.fm_bonus_txt}>{t("per subscription")}</div>
              <img className={css.left_rectangle_subscribe} src={rectangle_pink} alt="rectangle" />
              <img className={css.right_rectangle_subscribe} src={rectangle_pink} alt="rectangle" />

            </div>
          </div>
          <div className={css.fm_condition}>
            <div className={css.fm_condition_title}>{t("Conditions")}</div>
            <ol>
              <span className={css.preplist}>
                <li> <span className={css.ordered_list_object}> {t("verification")}</span></li>
              </span>
              <span className={css.preplist}>
                <li><span className={css.ordered_list_object}>{t("Link your TG account to your profile")}</span></li>
              </span>
              <span className={css.preplist}>
                <li>
                  <span className={css.ordered_list_object}>
                  {t("subscribe on")}&nbsp;
                  <NavLink
                    to={{ pathname: "https://t.me/GARILLA_CASINO_OFFICIAL" }}
                    target={"_blank"}
                    className={css.fm_condition_link}
                  >
                    {t("group")}
                  </NavLink>
                </span>
              </li>
              </span>
              <span className={css.preplist}>
                <li><span className={css.ordered_list_object}>{t("total deposit amount from 1000 ₽")}</span></li>
              </span>
            </ol>
          </div>
        </div>
        <div className={css.fm_phone}>
          <div className={css.fm_bonus}>
            <div className={css.bonus_quantity}>150 ₽</div>
            <div className={css.txt_btn_bonus_container}>
              <div className={css.fm_bonus_txt}>
                {t("for linking a phone number")}
              </div>
                <img className={css.left_rectangle} src={rectangle_pink} alt="rectangle" />
                <img className={css.right_rectangle} src={rectangle_pink} alt="rectangle" />

            </div>
          </div>
          <div className={css.fm_condition}>
            <div className={css.fm_condition_title}>{t("Conditions")}</div>

            <ol>
              <span className={css.preplist}>
                <li> <span className={css.ordered_list_object}> {t("verification")}</span></li>
              </span>
              <span className={css.preplist}>
                <li><span className={css.ordered_list_object}>{t("Link your phone number")}</span></li>
              </span>
              <span className={css.preplist}>
                <li>
                  <span className={css.ordered_list_object}>
                  <NavLink
                  to={"/profile"}
                  className={css.fm_condition_link}
                  target="_blank"
                >
                  {t("Confirm")}
                </NavLink>
                &nbsp;{t("number via TG")}
                </span>
              </li>
              </span>
            </ol>
          </div>
        </div>
      </div>

      {/*<h1 className={css.title}>{t("title free-money")}</h1>*/}
      {/*<div className={css.free_money__block}>*/}
      {/*    {blocksCard.map((block, index) => (*/}
      {/*        <div key={index} className={css.social_block}>*/}
      {/*            <div className={css.social_block__number}>{block.number}</div>*/}
      {/*            <img src={block.image} className={css.social_block__img} alt="" />*/}
      {/*            <div className={css.social_block__info}>*/}
      {/*                <h3 className={css.info__title}>{block.title}</h3>*/}
      {/*                <span className={css.info__text}>{block.text}</span>*/}
      {/*            </div>*/}
      {/*            <NavLink */}
      {/*                        to={{pathname: block.link}}*/}
      {/*                        target={"_blank"}*/}
      {/*            >*/}
      {/*                <div className={css.social_block__btn}>{block.button}</div>*/}
      {/*            </NavLink>*/}
      {/*        </div>*/}
      {/*        )*/}
      {/*    )}*/}
      {/*</div>*/}
      {/*<div className={css.big_cards}>*/}
      {/*    <div className={css.big_card__left}>*/}
      {/*        <div className={css.left_rhombus__1}></div>*/}
      {/*        <div className={css.left_rhombus__2}></div>*/}
      {/*        <img src={setings} className={css.card_leftImg} alt="" />*/}
      {/*        <img src={pin} className={css.card_rightImg} alt="" />*/}
      {/*        <span className={css.card_info}>{t("application")}</span>*/}
      {/*        <h3 className={css.card_title}>{t("bonus for app installation")}</h3>*/}
      {/*        <span className={css.card_text}>{t("Install the application bonus")}</span>*/}
      {/*        <div className={css.card_btn__block}>*/}
      {/*            <div className={css.left_btn}>*/}
      {/*                <img src={apple} className={css.left_btn__img} alt="" />*/}
      {/*                {!isMobile && <span className={css.left_btn__text}>IOS</span>}*/}
      {/*            </div>*/}
      {/*            <div className={css.right_btn}>*/}
      {/*                <img src={android} className={classNames(css.right_btn__img, css.right_btnImg__android)} alt="" />*/}
      {/*                {!isMobile && <span className={css.right_btn__text}>Android</span>}*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*    <div className={css.big_card__right}>*/}
      {/*        <div className={css.right_rhombus}></div>*/}
      {/*        <img src={chips} className={css.card_leftImg} alt="" />*/}
      {/*        <img src={money} className={css.card_rightImg} alt="" />*/}
      {/*        <span className={css.card_info}>{t("social media")}</span>*/}
      {/*        <h3 className={css.card_title}>{t("distribute money")}</h3>*/}
      {/*        <span className={css.card_text}>{t("in social networks")}</span>*/}
      {/*        <div className={css.card_btn__block}>*/}
      {/*            <div className={css.left_btn}>*/}
      {/*                <span className={css.left_btn__title}>Telegram</span>*/}
      {/*                <NavLink */}
      {/*                            to={{pathname: "https://t.me/Garilla_Casino_Support_bot"}}*/}
      {/*                            target={"_blank"}*/}
      {/*                >*/}
      {/*                    <div className={css.left_btn__text}>{t("subscribe")}</div> */}
      {/*                </NavLink>*/}
      {/*            </div>*/}
      {/*            <div className={css.right_btn}>*/}
      {/*                <span className={css.right_btn__title}>{t("VK")}</span>*/}
      {/*                <div className={css.right_btn__text}>{t("subscribe")}</div>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}
    </div>
  );
}
