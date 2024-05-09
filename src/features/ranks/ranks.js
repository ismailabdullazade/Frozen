import ContentPane from "../../components/content-pane/content-pane";
import { useTranslation } from "react-i18next";
import css from "./ranks.module.css";
import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import siberCard from "./../../images/ranks/cards ranks/siber.png";
import siberCardEn from "./../../images/ranks/cards ranks/siber_en.png";
import bladeCard from "./../../images/ranks/cards ranks/blade.png";
import bladeCardEn from "./../../images/ranks/cards ranks/blade_en.png";
import viperCard from "./../../images/ranks/cards ranks/viper.png";
import viperCardEn from "./../../images/ranks/cards ranks/viper_en.png";
import hackerCard from "./../../images/ranks/cards ranks/hacker.png";
import hackerCardEn from "./../../images/ranks/cards ranks/hacker_en.png";
import rmCard from "./../../images/ranks/cards ranks/rocketman.png";
import rmCardEn from "./../../images/ranks/cards ranks/rocketman_en.png";
// import marquisCard from "./../../images/ranks/cards ranks/marquisCard.svg";
// import dukeCard from "./../../images/ranks/cards ranks/dukeCard.svg";
// import kingCard from "./../../images/ranks/cards ranks/kingCard.svg";
// import godCard from "./../../images/ranks/cards ranks/godCard.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import { EffectCoverflow, Autoplay, Navigation } from "swiper/modules";

export default function Ranks() {
  const { t, i18n } = useTranslation();
  const rus = i18n.resolvedLanguage === "ru";

  const swiperOptions = {
    // effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 1,
    // slidesPerView: "auto",
    navigation: true,
    // autoplay: {
    //     delay: 3000,
    //     disableOnInteraction: false,
    //     pauseOnMouseEnter: true
    // },
    // coverflowEffect: {
    //   rotate: 0,
    //   stretch: "-70%",
    //   // depth: 250,
    //   modifier: -1,
    //   slideShadows: false,
    // },
  };

  const [activeSlide, setActiveSlide] = useState(0);

  const slideTo = (e) => {
    setActiveSlide(e.realIndex);
  };

  return (
    <div className={css.ranks_background}>
      <ContentPane className={css.ranks_wraper}>
        <div className={css.ranks__title_container}>
          <div className={css.ranks_block}>
            <div className={css.ranks_block__name}>
              {activeSlide === 0 ? (
                <span>{t("Cyber")}</span>
              ) : activeSlide === 1 ? (
                <span>{t("Blade")}</span>
              ) : activeSlide === 2 ? (
                <span>{t("Viper")}</span>
              ) : activeSlide === 3 ? (
                <span>{t("Hacker")}</span>
              ) : (
                <span>{t("RocketMan")}</span>
              )}
              <span
                className={classNames(
                  css.ranks_block__name_vip,
                  activeSlide <= 2 ? "" : css.ranks_block__name_vip_active,
                )}
              >
                vip
              </span>
            </div>
            <div className={css.ranks_block__cond}>
              {/*<span>{t("Conditions")}: </span>{t("deposit amount from")} 0 {t("rub")}.*/}
            </div>
          </div>
        </div>
        <div className={css.ranks_wraper__container}>
          <div
            className={classNames(
              css.ranks_progress,
              activeSlide === 0
                ? css.siber
                : activeSlide === 1
                  ? css.blade
                  : activeSlide === 2
                    ? css.viper
                    : activeSlide === 3
                      ? css.hacker
                      : css.rocketman,
            )}
          >
            {/*<div className={css.rank_name_title}>*/}
            {/*  <div className={css.rank_name_block}>*/}
            {/*    {(activeSlide === 0 && (*/}
            {/*            <div className={css.rank_name}>{t("Player")}</div>*/}
            {/*        )) ||*/}
            {/*        (activeSlide === 1 && (*/}
            {/*            <div className={css.rank_name}>{t("Knight")}</div>*/}
            {/*        )) ||*/}
            {/*        (activeSlide === 2 && (*/}
            {/*            <div className={css.rank_name}>{t("Baron")}</div>*/}
            {/*        )) ||*/}
            {/*        (activeSlide === 3 && (*/}
            {/*            <div className={css.rank_name}>{t("Viscount")}</div>*/}
            {/*        )) ||*/}
            {/*        (activeSlide === 4 && (*/}
            {/*            <div className={css.rank_name}>{t("Earl")}</div>*/}
            {/*        )) ||*/}
            {/*        (activeSlide === 5 && (*/}
            {/*            <div className={css.rank_name}>{t("Marquis")}</div>*/}
            {/*        )) ||*/}
            {/*        (activeSlide === 6 && (*/}
            {/*            <div className={css.rank_name}>{t("Duke")}</div>*/}
            {/*        )) ||*/}
            {/*        (activeSlide === 7 && (*/}
            {/*            <div className={css.rank_name}>{t("King")}</div>*/}
            {/*        )) ||*/}
            {/*        (activeSlide === 8 && (*/}
            {/*            <div className={css.rank_name}>{t("God")}</div>*/}
            {/*        ))}*/}
            {/*    {activeSlide >= 4 ? (*/}
            {/*        <div*/}
            {/*            className={classNames(*/}
            {/*                css.rank_name_vip_club,*/}
            {/*                css.rank_name_vip_club_show*/}
            {/*            )}*/}
            {/*        >*/}
            {/*          {t("vip club")}*/}
            {/*        </div>*/}
            {/*    ) : (*/}
            {/*        <div className={css.rank_name_vip_club}>{t("vip club")}</div>*/}
            {/*    )}*/}
            {/*  </div>*/}
            {/*  <div className={css.rank_name_description}>*/}
            {/*    {t("Condition")}: {t("deposits amount")}&nbsp;*/}
            {/*    {(activeSlide === 0 && <>0 RUB.</>) ||*/}
            {/*        (activeSlide === 1 && <>400 000 RUB.</>) ||*/}
            {/*        (activeSlide === 2 && <>650 000 RUB.</>) ||*/}
            {/*        (activeSlide === 3 && <>900 000 RUB.</>) ||*/}
            {/*        (activeSlide === 4 && <>4 500 000 RUB.</>) ||*/}
            {/*        (activeSlide === 5 && <>7 000 000 RUB.</>) ||*/}
            {/*        (activeSlide === 6 && <>10 000 000 RUB.</>) ||*/}
            {/*        (activeSlide === 7 && <>15 000 000 RUB.</>) ||*/}
            {/*        (activeSlide === 8 && <>25 000 000 RUB.</>)}*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div className={css.rank_block_info}>
              <div className={css.rank_block_info_title}>{t("Advantages")}</div>
              <div className={css.rank_block_items}>
                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("cashback")}
                  </div>
                  <div className={css.rank_block_item_val}>10%</div>
                  {/*{*/}
                  {/*    (activeSlide === 0 && <div className={css.rank_block_item_val}>10%</div>)*/}
                  {/*    || (activeSlide === 1 && <div className={css.rank_block_item_val}>2%</div>)*/}
                  {/*    || (activeSlide === 2 && <div className={css.rank_block_item_val}>3%</div>)*/}
                  {/*    || (activeSlide === 3 && <div className={css.rank_block_item_val}>5%</div>)*/}
                  {/*    || (activeSlide === 4 && <div className={css.rank_block_item_val}>6%</div>)*/}
                  {/*    || (activeSlide === 5 && <div className={css.rank_block_item_val}>7%</div>)*/}
                  {/*    || (activeSlide === 6 && <div className={css.rank_block_item_val}>8%</div>)*/}
                  {/*    || (activeSlide === 7 && <div className={css.rank_block_item_val}>9%</div>)*/}
                  {/*    || (activeSlide === 8 && <div className={css.rank_block_item_val}>10%</div>)*/}
                  {/*}*/}
                </div>
                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("birthday gift")}
                  </div>
                  {(activeSlide === 0 && (
                    <div className={css.rank_block_item_val}>1 000 RUB</div>
                  )) ||
                    (activeSlide === 1 && (
                      <div className={css.rank_block_item_val}>2 000 RUB</div>
                    )) ||
                    (activeSlide === 2 && (
                      <div className={css.rank_block_item_val}>8 000 RUB</div>
                    )) ||
                    (activeSlide === 3 && (
                      <div className={css.rank_block_item_val}>15 000 RUB</div>
                    )) ||
                    (activeSlide === 4 && (
                      <div className={css.rank_block_item_val}>20 000 RUB</div>
                    )) ||
                    (activeSlide === 5 && (
                      <div className={css.rank_block_item_val}>40 000 RUB</div>
                    )) ||
                    (activeSlide === 6 && (
                      <div className={css.rank_block_item_val}>60 000 RUB</div>
                    )) ||
                    (activeSlide === 7 && (
                      <div className={css.rank_block_item_val}>80 000 RUB</div>
                    )) ||
                    (activeSlide === 8 && (
                      <div className={css.rank_block_item_val}>100 000 RUB</div>
                    ))}
                </div>
                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("Accelerated withdrawal")}
                  </div>
                  {(activeSlide < 4 && (
                    <div className={css.rank_block_item_val}>{t("No")}</div>
                  )) ||
                    (activeSlide > 3 && (
                      <div className={css.rank_block_item_val}>{t("Yes")}</div>
                    ))}
                </div>

                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("support 24/7")}
                  </div>
                  <div className={css.rank_block_item_val}>{t("Yes")}</div>
                </div>
                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("new year's gift")}
                  </div>
                  {(activeSlide < 4 && (
                    <div className={css.rank_block_item_val}>{t("No")}</div>
                  )) ||
                    (activeSlide === 4 && (
                      <div className={css.rank_block_item_val}>5 000 RUB</div>
                    )) ||
                    (activeSlide === 5 && (
                      <div className={css.rank_block_item_val}>8 000 RUB</div>
                    )) ||
                    (activeSlide === 6 && (
                      <div className={css.rank_block_item_val}>10 000 RUB</div>
                    )) ||
                    (activeSlide === 7 && (
                      <div className={css.rank_block_item_val}>15 000 RUB</div>
                    )) ||
                    (activeSlide === 8 && (
                      <div className={css.rank_block_item_val}>20 000 RUB</div>
                    ))}
                </div>
                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("personal manager")}
                  </div>
                  {(activeSlide < 4 && (
                    <div className={css.rank_block_item_val}>{t("No")}</div>
                  )) ||
                    (activeSlide > 3 && (
                      <div className={css.rank_block_item_val}>{t("Yes")}</div>
                    ))}
                </div>
              </div>
            </div>

            <div className={css.rank_block_info}>
              <div className={css.rank_block_info_title}>{t("bonuses")}</div>
              <div className={css.rank_block_items}>
                <div
                  className={classNames(
                    css.rank_block_item,
                    css.rank_block_item_big,
                  )}
                >
                  <div className={css.rank_block_item_name}>
                    {t("Weekly Bonus")}
                  </div>
                  <div className={css.rank_block_item_val}>{t("Yes")}</div>
                </div>
                <div
                  className={classNames(
                    css.rank_block_item,
                    css.rank_block_item_big,
                  )}
                >
                  <div className={css.rank_block_item_name}>
                    {t("Additional bonus")}
                  </div>
                  {(activeSlide < 4 && (
                    <div className={css.rank_block_item_val}>{t("No")}</div>
                  )) ||
                    (activeSlide > 3 && (
                      <div className={css.rank_block_item_val}>{t("Yes")}</div>
                    ))}
                </div>
              </div>
            </div>

            <div className={css.rank_block_info}>
              <div className={css.rank_block_info_title}>
                {t("Withdrawal limits")}
              </div>
              <div className={css.rank_block_items}>
                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("Withdrawal per day")}
                  </div>
                  {(activeSlide === 0 && (
                    <div className={css.rank_block_item_val}>
                      {t("up to")} 200 000 RUB
                    </div>
                  )) ||
                    (activeSlide === 1 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 300 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 2 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 450 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 3 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 900 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 4 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 4 500 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 5 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 7 000 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 6 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 10 000 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 7 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 15 000 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 8 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 25 000 000 RUB
                      </div>
                    ))}
                </div>
                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("Withdrawal per week")}
                  </div>
                  {(activeSlide === 0 && (
                    <div className={css.rank_block_item_val}>
                      {t("up to")} 450 000 RUB
                    </div>
                  )) ||
                    (activeSlide === 1 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 1 000 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 2 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 1 300 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 3 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 1 800 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 4 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    )) ||
                    (activeSlide === 5 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    )) ||
                    (activeSlide === 6 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    )) ||
                    (activeSlide === 7 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    )) ||
                    (activeSlide === 8 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    ))}
                </div>
                <div className={css.rank_block_item}>
                  <div className={css.rank_block_item_name}>
                    {t("Withdrawal per month")}
                  </div>
                  {(activeSlide === 0 && (
                    <div className={css.rank_block_item_val}>
                      {t("up to")} 1 000 000 RUB
                    </div>
                  )) ||
                    (activeSlide === 1 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 2 500 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 2 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 3 100 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 3 && (
                      <div className={css.rank_block_item_val}>
                        {t("up to")} 6 500 000 RUB
                      </div>
                    )) ||
                    (activeSlide === 4 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    )) ||
                    (activeSlide === 5 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    )) ||
                    (activeSlide === 6 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    )) ||
                    (activeSlide === 7 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    )) ||
                    (activeSlide === 8 && (
                      <div className={css.rank_block_item_val}>No Limit</div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className={css.ranks_cards}>
            <Swiper
              {...swiperOptions}
              modules={[EffectCoverflow, Autoplay, Navigation]}
              className={classNames(css.swiper, "ranks-swiper")}
              onSlideChange={(e) => slideTo(e)}
            >
              <SwiperSlide>
                <div className={css.slider}>
                  {rus ? (
                    <img src={siberCard} alt="siber" />
                  ) : (
                    <img src={siberCardEn} alt="siber" />
                  )}

                  {/*<div className={css.slider_card}>*/}
                  {/*  <div className={css.slider_card__block}></div>*/}
                  {/*</div>*/}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={css.slider}>
                  {rus ? (
                    <img src={bladeCard} alt="bladeCard" />
                  ) : (
                    <img src={bladeCardEn} alt="bladeCard" />
                  )}
                  {/*<div className={css.slider_card}>*/}
                  {/*  <div className={css.slider_card__block}></div>*/}
                  {/*  <div className={css.slider_card__blockBootom}>*/}
                  {/*    <span className={css.carusel_slider__player}>*/}
                  {/*      {t("Knight")}*/}
                  {/*    </span>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={css.slider}>
                  {rus ? (
                    <img src={viperCard} alt="viperCard" />
                  ) : (
                    <img src={viperCardEn} alt="viperCard" />
                  )}
                  {/*<div className={css.slider_card}>*/}
                  {/*  <div className={css.slider_card__block}></div>*/}
                  {/*  <div className={css.slider_card__blockBootom}>*/}
                  {/*    <span className={css.carusel_slider__player}>*/}
                  {/*      {t("Baron")}*/}
                  {/*    </span>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={css.slider}>
                  {rus ? (
                    <img src={hackerCard} alt="hackerCard" />
                  ) : (
                    <img src={hackerCardEn} alt="hackerCard" />
                  )}
                  {/*<div className={css.slider_card}>*/}
                  {/*  <div className={css.slider_card__block}></div>*/}
                  {/*  <div className={css.slider_card__blockBootom}>*/}
                  {/*    <span className={css.carusel_slider__player}>*/}
                  {/*      {t("Viscount")}*/}
                  {/*    </span>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={css.slider}>
                  {rus ? (
                    <img src={rmCard} alt="rmCard" />
                  ) : (
                    <img src={rmCardEn} alt="rmCard" />
                  )}
                  {/*<div className={css.slider_card}>*/}
                  {/*  <div className={css.slider_card__block}></div>*/}
                  {/*  <div className={css.slider_card__blockBootom}>*/}
                  {/*    <span className={css.carusel_slider__player}>*/}
                  {/*      {t("Earl")}*/}
                  {/*    </span>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </SwiperSlide>
              {/*<SwiperSlide>*/}
              {/*  <div className={css.slider}>*/}
              {/*    <img src={marquisCard} alt="marquisCard"/>*/}
              {/*    <div className={css.slider_card}>*/}
              {/*      <div className={css.slider_card__block}></div>*/}
              {/*      <div className={css.slider_card__blockBootom}>*/}
              {/*        <span className={css.carusel_slider__player}>*/}
              {/*          {t("Marquis")}*/}
              {/*        </span>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</SwiperSlide>*/}
              {/*<SwiperSlide>*/}
              {/*  <div className={css.slider}>*/}
              {/*    <img src={dukeCard} alt="dukeCard"/>*/}
              {/*    <div className={css.slider_card}>*/}
              {/*      <div className={css.slider_card__block}></div>*/}
              {/*      <div className={css.slider_card__blockBootom}>*/}
              {/*        <span className={css.carusel_slider__player}>*/}
              {/*          {t("Duke")}*/}
              {/*        </span>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</SwiperSlide>*/}
              {/*<SwiperSlide>*/}
              {/*  <div className={css.slider}>*/}
              {/*    <img src={kingCard} alt="kingCard"/>*/}
              {/*    <div className={css.slider_card}>*/}
              {/*      <div className={css.slider_card__block}></div>*/}
              {/*      <div className={css.slider_card__blockBootom}>*/}
              {/*        <span className={css.carusel_slider__player}>*/}
              {/*          {t("King")}*/}
              {/*        </span>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</SwiperSlide>*/}
              {/*<SwiperSlide>*/}
              {/*  <div className={css.slider}>*/}
              {/*    <img src={godCard} alt="godCard"/>*/}
              {/*    /!*<img src={auth.user.rank === null? godCard : (auth.user.rank_id === 9 || auth.user.rank_id > 9 ? godCard : godCardLock)} alt="godCard" />*!/*/}
              {/*    <div className={css.slider_card}>*/}
              {/*      <div className={css.slider_card__block}></div>*/}
              {/*      <div className={css.slider_card__blockBootom}>*/}
              {/*        <span className={css.carusel_slider__player}>*/}
              {/*          {t("God")}*/}
              {/*        </span>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</SwiperSlide>*/}
            </Swiper>
          </div>
        </div>
      </ContentPane>
    </div>
  );
}
