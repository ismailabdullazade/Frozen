import css from "./available-bonuses.module.css";
import ContentPane from "../../../components/content-pane/content-pane";
import classNames from "classnames";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  useGetActiveBonusQuery,
  useGetBonusSlotQuery,
  useTakeBonusMutation,
} from "../../../app/api/bonus.api";
import Loader from "../../../components/loader/Loader";
import NoBonus from "../../wallet/form/no-bonus";
import Button from "../../../components/button/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../services/auth";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "beautiful-react-hooks";
import CancelBonus from "../cancel-bonus/cancel-bonus";
import { toast } from "react-toastify";
import TimerComponent from "./timer/available-at-timer";
import { isFreeDepBonus } from "../../../utils/bonus-helpers";
import { loadBaseUrl } from "../../../app/api/api.config";
import hasNoBonus from "../../../images/bonuses/withoutpromocode.svg";
import DescriptionBonus from "../description-bonus/description-bonus";
import { Swiper, SwiperSlide } from "swiper/react";
import SlideControlButton from "./slide-control/control";
import arrow from "../../../images/banners/arrow_banners.svg";

export default function AvailableBonuses() {
  const { data, bonusLoading } = useGetBonusSlotQuery();
  const [selectedId, selectId] = useState(null);
  const bonus = data?.find((item) => item.id === selectedId);
  const { t } = useTranslation();
  const history = useHistory();

  const desktop = useMediaQuery("(min-width: 1200px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1199px)");
  const itemsPerPage = desktop ? 8 : isTablet ? 4 : 2;

  const {
    data: activeBonus,
    isLoading: fetchingActiveBonus,
    error: activeBonusExist,
  } = useGetActiveBonusQuery();
  const [showConfirm, setShowConfirm] = useState();
  const host = loadBaseUrl().split("/")[0];
  const [
    activateBonusTrigger,
    {
      data: bonusActivateData,
      isLoading: bonusActivating,
      error: errorBonusActivate,
    },
  ] = useTakeBonusMutation();
  const activateBonus = () => {
    if (isFreeDepBonus(bonus)) {
      //Если бонус доступен для активации без депозита
      if (activeBonus && !activeBonusExist) {
        //если уже есть активный бонус, то надо предупредить юзера
        setShowConfirm(true);
      } else {
        //Если активного бонуса нет, сразу активируем
        activateBonusTrigger({ slotId: selectedId });
      }
    } else {
      // Если бонус требует депозит
      if (activeBonus && !activeBonusExist) {
        // Если уже есть активный бонус, показываем модалку
        setShowConfirm(true);
      } else {
        // Если активного бонуса нет, перенаправляем на страницу кошелька
        history.push(`/wallet?b=${bonus.id}`);
      }
    }
  };
  const [timeBonusAvalailableAt, setTimeBonusAvalailableAt] = useState(null);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState();
  const [loadedSliderBonus, setLoadedSliderBonus] = useState(false);
  const swiperRef = useRef(null);
  const [swiper, setSwiper] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (bonus?.available_at && !bonus?.available) {
      setTimeBonusAvalailableAt(bonus.available_at);
    } else if (timeBonusAvalailableAt) {
      setTimeBonusAvalailableAt(null);
    }
  }, [selectedId]);

  useEffect(() => {
    if (bonusActivateData && isFreeDepBonus(bonus)) {
      const notify = () =>
        toast(t("Bonus successfully activated"), {
          theme: "dark",
          type: "success",
        });
      notify();
      // ЕСли бонус был усешно активирован и без депозита, то кидаем юзера к активным бонусам
      history.push(`/my-bonus`);
    }
    if (bonusActivateData && !isFreeDepBonus(bonus)) {
      const notify = () =>
        toast(t("Bonus successfully activated"), {
          theme: "dark",
          type: "success",
        });
      notify();
      // ЕСли бонус был усешно активирован и с депозитом, то кидаем юзера в кошелек
      history.push(`/wallet?b=${bonus.id}`);
    }
  }, [bonusActivateData]);

  useEffect(() => {
    if (errorBonusActivate) {
      console.error(errorBonusActivate);
    }
    // eslint-disable-next-line
  }, [errorBonusActivate]);

  useEffect(() => {
    // Проверяем, что есть данные и их длина больше нуля
    if (data && data?.length > 0) {
      // Устанавливаем id первого бонуса в selectedId, используя activeSwiperIndex
      const firstBonusIndex =
        activeSwiperIndex !== undefined ? activeSwiperIndex * itemsPerPage : 0;
      selectId(data[firstBonusIndex]?.id);
    }
  }, [data, activeSwiperIndex, itemsPerPage]);

  const slides = useMemo(() => {
    if (!data) {
      return [];
    }
    const t = data; // [{
    //     image: "images/logo-gc.png",
    //     id: 1
    // },{
    //     image: "images/logo-gc.png",
    //     id: 2
    // },{
    //     image: "images/logo-gc.png",
    //     id: 3
    // },{
    //     image: "images/logo-gc.png",
    //     id: 4
    // },{
    //     image: "images/logo-gc.png",
    //     id: 5
    // },{
    //     image: "images/logo-gc.png",
    //     id: 6
    // },{
    //     image: "images/logo-gc.png",
    //     id: 7
    // },{
    //     image: "images/logo-gc.png",
    //     id: 8
    // },{
    //     image: "images/logo-gc.png",
    //     id: 9
    // }]

    const res = [];
    const int = Math.trunc(t.length / itemsPerPage);
    const rest = t.length % itemsPerPage;

    for (let i = 0; i < int; i++) {
      res[i] = t.slice(i * itemsPerPage, itemsPerPage * (i + 1));
    }
    if (rest > 0) {
      res.push(t.slice(-rest));
    }
    for (let i = 0; i < itemsPerPage; i++) {
      if (!res[res.length - 1]) {
        res[res.length - 1] = [];
      }
      if (!res[res.length - 1][i]) {
        res[res.length - 1][i] = {};
      }
    }

    return res;
  }, [data]);

  useEffect(() => {
    slides.forEach((slide) => {
      slide.forEach((item) => {
        const img = new Image();
        img.onload = () => {
          setLoadedSliderBonus((prevLoadedGames) => {
            return {
              ...prevLoadedGames,
              [item.id]: true,
            };
          });
        };
        img.src = `https://${host}/uploads/${item.image}`;
      });
    });
  }, [slides]);

  useEffect(() => {
    if (swiperRef?.current) {
      setSwiper(swiperRef?.current.swiper);
    }
  }, [swiperRef]);

  useEffect(() => {
    if (swiperRef?.current) {
      const swiperInstance = swiperRef?.current?.swiper;
      if (swiperInstance) {
        setSwiper(swiperInstance);

        swiperInstance.on("slideChange", () => {
          setCurrentSlideIndex(swiperInstance.activeIndex);
          setIsEnd(swiperInstance.isEnd);
        });

        swiperInstance.on("reachEnd", () => {
          setIsEnd(true);
        });

        swiperInstance.on("reachBeginning", () => {
          setIsEnd(false);
        });

        setTotalSlides(swiperInstance.slides.length);
      }
    }
    // eslint-disable-next-line
  }, [swiperRef?.current]);

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    } else {
      console.error("Swiper is not initialized yet");
    }
  };

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    } else {
      console.error("Swiper is not initialized yet");
    }
  };
  return (
    <ContentPane
      className={classNames(css.available)}
      paneClass={classNames(css.pane)}
    >
      {bonusLoading && <Loader />}
      {!data?.length && (
        <div className={css.available__not_available}>
          <NoBonus />
        </div>
      )}

      <div className={css.available_wraper}>
        {bonusLoading || !data || data?.length < 1 ? null : (
            <>
              <div className={css.select_bonus_top}>{t("select bonus")}</div>
              <div
                  className={classNames(css.carousel, {
                    [css.loading]: !loadedSliderBonus,
                  })}
              >
                <Swiper
                    initialSlide={activeSwiperIndex || 0}
                    onSlideChange={(e) => setActiveSwiperIndex(e.activeIndex)}
                    ref={swiperRef}
                >
                  {slides.map((slide) => (
                      <SwiperSlide>
                        <div className={css.cards_wraper}>
                          {slide?.map((item, index) => (
                              <div key={index} className={css.card_wrapper}>
                                {item.image && loadedSliderBonus[item.id] ? (
                                    <img
                                        className={classNames(css.bonus_card, {
                                          [css.bonus_card__active]:
                                          selectedId === item.id,
                                        })}
                                        onClick={() => {
                                          selectId(item.id);
                                        }}
                                        src={`https://${host}/uploads/${item.image}`}
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        className={css.no_bonus}
                                        src={hasNoBonus}
                                        alt=""
                                    />
                                )}
                              </div>
                          ))}
                        </div>
                      </SwiperSlide>
                  ))}
                  {data?.length > !loadedSliderBonus && itemsPerPage && (
                      <div className={css.pagination}>
                        <div className={css.arrow_left} onClick={goPrev}>
                          <img src={arrow} alt=""/>
                        </div>
                        {slides.map((_, index) => (
                            <SlideControlButton
                                key={index}
                                i={index}
                                isActive={index === activeSwiperIndex}
                            />
                        ))}
                        <div className={css.arrow_right} onClick={goNext}>
                          <img src={arrow} alt=""/>
                        </div>
                      </div>
                  )}
                  <div className={css.select_bonus}>{t("select bonus")}</div>
                </Swiper>
              </div>
              <div className={css.divider}/>
            </>
        )}
        {bonusLoading || !data || data?.length === 0 || !bonus ? null : (
          <div className={css.activation}>
            {bonus && (
              <div className={css.activation_info}>
                <DescriptionBonus bonus={bonus} variant={"available_bonuses"} />
              </div>
            )}
            <ActivationButtonBlock
              bonus={bonus}
              activateBonus={activateBonus}
              fetchingActiveBonus={fetchingActiveBonus}
              timeBonusAvalailableAt={timeBonusAvalailableAt}
            />
          </div>
        )}
      </div>
      <div className={css.card_bonus__info}>
        <CancelBonus
          setShowConfirm={setShowConfirm}
          showConfirm={showConfirm}
          onCancelSuccess={() => {
            activateBonusTrigger({ slotId: selectedId });
          }}
        />
      </div>
    </ContentPane>
  );
}
function ActivationButtonBlock({
  bonus,
  activateBonus,
  fetchingActiveBonus,
  timeBonusAvalailableAt,
}) {
  const { t } = useTranslation();
  const auth = useAuth();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={css.activation_info__battonBlock}>
      {bonus?.deposit_min_amount > 0 && (
        <div className={css.activation__text}>
          {t("The bonus is activated when replenishing the balance from ")}
          {(
            bonus?.deposit_min_amount /
            Math.pow(10, auth.user.currency?.subunits)
          ).toLocaleString("ru-RU")}
          &nbsp;
          {auth.user.currency?.sign}
        </div>
      )}
      {timeBonusAvalailableAt ? (
        <TimerComponent dateString={timeBonusAvalailableAt} />
      ) : (
        <Button
          disabled={fetchingActiveBonus}
          onClick={activateBonus}
          className={css.button}
        >
          {t("Activate")}
        </Button>
      )}
    </div>
  );
}
