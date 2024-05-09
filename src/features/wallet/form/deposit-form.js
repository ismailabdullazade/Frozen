import css from "./style.module.css";
import Button from "../../../components/button/button";
import { useTranslation } from "react-i18next";
import InnerPane from "../../../components/inner-pane/inner-pane";
import Input from "../../../components/form3/input";
import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useAuth } from "../../../services/auth";
import arrow from "../../../images/banners/arrow_banners.svg";
import { useDepositMutation } from "../../../app/api/wallet.api";
import {
  useGetActiveBonusQuery,
  useGetBonusSlotQuery,
  useTakeBonusMutation,
} from "../../../app/api/bonus.api";
import Loader from "../../../components/loader/Loader";
import { toCurrencyString, validateEmail } from "../../../utils/validation";
import CancelBonus from "../../my-bonus/cancel-bonus/cancel-bonus";
import MaskInput from "../../../components/form2/mask-input";
import { useMediaQuery } from "beautiful-react-hooks";
import TimerComponent from "../../my-bonus/available-bonuses/timer/available-at-timer";
import { loadBaseUrl } from "../../../app/api/api.config";
import hasNoBonus from "../../../images/bonuses/has-no-bonus.svg";
import DescriptionBonus from "../../my-bonus/description-bonus/description-bonus";
import { Swiper, SwiperSlide } from "swiper/react";
import noBonusImg from "./../../../images/wallet/no_bonus.svg";
import SlideControlButton from "../../my-bonus/available-bonuses/slide-control/control";

export default function DepositForm({
  paymentMethod,
  setPaymentMethod,
  defaultSelectedBonus,
}) {
  const { t } = useTranslation();
  const auth = useAuth();
  const emailEnterForDep =
    paymentMethod.slug === "piastrix_sbp" ||
    paymentMethod.slug === "piastrix_sber" ||
    paymentMethod.slug === "piastrix_bank";
  const getDefaultNumber = () => {
    if (paymentMethod.slug === "piastrix") {
      return "";
    }
    if (emailEnterForDep) {
      return auth?.user?.email ? auth.user.email : "";
    }
    return auth?.user?.phone
      ? auth.user.phone.substring(0, auth.user.phone)
      : "";
  };

  const defaultBonus = {
    id: 1,
    title: t("no bonus"),
    image: [noBonusImg],
  };

  const [number, setNumber] = useState(getDefaultNumber());
  const [phoneNumberError, setPhoneNumberError] = useState();
  const [amount, setAmount] = useState("");
  const inputNumber = useRef();
  const [replenish, { data: payUrl, isLoading }] = useDepositMutation();
  const { data: bonusSlot, isLoading: bonusLoading } = useGetBonusSlotQuery();
  const { data } = useGetBonusSlotQuery();
  const {
    data: activeBonus,
    isLoading: fetchingActiveBonus,
    error: errorActiveBonus,
  } = useGetActiveBonusQuery();
  const [acceptedBonus, setAccepted] = useState(activeBonus);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState();
  const [selectedBonus, selectBonus] = useState(Number(defaultSelectedBonus));
  const newDataArray = Array.isArray(data)
    ? [defaultBonus, ...data]
    : [defaultBonus];
  const bonus = newDataArray?.find((item) => item.id === selectedBonus);
  const [timeBonusAvalailableAt, setTimeBonusAvalailableAt] = useState(null);
  const [
    activateBonus,
    { data: bonusActivateData, isLoading: bonusActivating },
  ] = useTakeBonusMutation();
  const [showConfirm, setShowConfirm] = useState();
  const selectedBonusObj = useMemo(() => {
    return bonusSlot?.find((item) => item.id == selectedBonus);
  }, [selectedBonus, bonusSlot]);
  const host = loadBaseUrl().split("/")[0];
  const isMobile = useMediaQuery("(max-width: 960px)");
  const isTable = useMediaQuery("(max-width: 1440px)");
  const itemsPerPage = isTable ? 2 : 3;
  // eslint-disable-next-line
  const [swiper, setSwiper] = useState(null);
  // eslint-disable-next-line
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // eslint-disable-next-line
  const [totalSlides, setTotalSlides] = useState(0);
  const swiperRef = useRef(null);
  // eslint-disable-next-line
  const [isEnd, setIsEnd] = useState(false);

  const slides = useMemo(() => {
    if (!newDataArray) {
      return [];
    }
    const t = newDataArray;

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
      if (!res[res.length - 1][i]) {
        res[res.length - 1][i] = {};
      }
    }

    return res;
    // eslint-disable-next-line
  }, [data, itemsPerPage]);

  const onPayClick = () => {
    if (
      selectedBonus &&
      acceptedBonus &&
      acceptedBonus.id != selectedBonus &&
      selectedBonus !== 1
    ) {
      //ЕСли есть активный бонус и юзер выбрал другой, то вывести препреждение, это не Без бонуса, после подверждения бонус будет деактивирован
      setShowConfirm(true);
    } else {
      action();
    }
  };

  const action = () => {
    if (
      selectedBonus &&
      acceptedBonus?.id != selectedBonus &&
      selectedBonus !== 1
    ) {
      //Если бонус выбран, но это не тот бонус, который был выбран ранее, это не Без бонуса, нужно активировать новый бонус
      activateBonus({ slotId: selectedBonus });
    } else {
      //ЕСли нет выбранного или выбран тот уже уже активный, то просто пополняем
      sendDeposit();
    }
  };
  const sendDeposit = () => {
    switch (paymentMethod.slug) {
      case "telegram_pay":
        window.location.href = "https://t.me/GarillaCasino";
        break;
      case "piastrix":
        replenish({
          amount: amount.replace(/\s/g, ""),
          provider: paymentMethod.provider,
          account: number,
        });
        break;
      case "piastrix_sbp":
        replenish({
          amount: amount.replace(/\s/g, ""),
          provider: paymentMethod.provider,
          account: number,
        });
        break;
      case "piastrix_sber":
        replenish({
          amount: amount.replace(/\s/g, ""),
          provider: paymentMethod.provider,
          account: number,
        });
        break;
      case "piastrix_bank":
        replenish({
          amount: amount.replace(/\s/g, ""),
          provider: paymentMethod.provider,
          account: number,
        });
        break;
      case "blackRabbit_p2p":
        replenish({
          amount: amount.replace(/\s/g, ""),
          provider: paymentMethod.provider,
          phone: parseInt(number),
        });
        break;
      case "paycos_p2p_106":
        replenish({
          amount: amount.replace(/\s/g, ""),
          provider: paymentMethod.provider,
          phone: parseInt(number),
        });
        break;
      case "wallet_expert_p2p":
        replenish({
          amount: amount.replace(/\s/g, ""),
          provider: paymentMethod.provider,
          phone: parseInt(number),
        });
        break;
      default:
        replenish({
          amount: amount.replace(/\s/g, ""),
          provider: paymentMethod.provider,
          phone: parseInt(number),
        });
        break;
    }
  };

  const onSuccessCancel = () => {
    //Если прошла успешная отмена активного бонуса в момент оплаты при выборе другого бонуса
    action();
  };

  useEffect(() => {
    if (selectedBonusObj?.available_at && !selectedBonusObj?.available) {
      setTimeBonusAvalailableAt(selectedBonusObj.available_at);
    } else if (timeBonusAvalailableAt) {
      setTimeBonusAvalailableAt(null);
    }
  }, [selectedBonus]);

  useEffect(() => {
    if (activeBonus) {
      setAccepted(activeBonus);
    }
    if (errorActiveBonus) {
      setAccepted(null);
    }
  }, [errorActiveBonus, activeBonus]);

  useEffect(() => {
    if (bonusActivateData) {
      window.localStorage.setItem("show_bonus_info", true);
      sendDeposit();
    }
    // eslint-disable-next-line
  }, [bonusActivateData]);

  useEffect(() => {
    if (payUrl) {
      //Если была успешно отправлена форма оплаты
      window.location.href = payUrl;
    }
  }, [payUrl]);

  useEffect(() => {
    if (newDataArray && !selectedBonus) {
      //Если при загрузке страницы были получены бонусы и при этом еще не был получен/выбран активный бонус, то выберем первый
      selectBonus(newDataArray[0]?.id);
    }
  }, [selectedBonus, newDataArray]);

  useEffect(() => {
    if (acceptedBonus && acceptedBonus.id) {
      //Если есть активынй бонус
      selectBonus(acceptedBonus.id);
    } else if (!acceptedBonus && selectedBonus) {
      //если с бека пришло что активного бонуса нет, а в стейте он есть, значит надо очисить стейт
      // selectBonus(null);
    }
    // eslint-disable-next-line
  }, [acceptedBonus]);

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

  const body = (
    <>
      <div className={classNames(css.wrapper, css.wrapper_dep)}>
        <div className={css.detail}>
          <div className={css.requisites}>
            <div className={css.requisites_margin}>
              <div className={css.inputs}>
                <Input
                  className={css.number}
                  label={t(
                    paymentMethod.slug === "piastrix"
                      ? "enter account name (piastrix)"
                      : "enter phone number"
                  )}
                  placeholder={t(
                    paymentMethod.slug === "piastrix"
                      ? "Account name (piastrix)"
                      : emailEnterForDep
                        ? "Email"
                        : "Phone number"
                  )}
                  value={number}
                  onChange={(val) => {
                    if (paymentMethod.slug === "piastrix") {
                      setNumber(val);
                      setPhoneNumberError(false);
                    } else if (emailEnterForDep) {
                      setNumber(val);
                      if (validateEmail(val)) {
                        setPhoneNumberError(false);
                      } else {
                        setPhoneNumberError(true);
                      }
                    } else {
                      const cleanedValue = val.replace(/[^0-9+]/g, "");
                      if (cleanedValue.length === 0 || cleanedValue === "+") {
                        setNumber("+7");
                      } else if (/^\+7/.test(cleanedValue)) {
                        setNumber(cleanedValue.substring(0, 12));
                      } else {
                        setNumber("+7" + cleanedValue.substring(0, 11));
                      }
                      if (cleanedValue.length === 10) {
                        setPhoneNumberError(false);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (
                      paymentMethod.slug === "piastrix" &&
                      e.target.value.length < 2
                    ) {
                      setPhoneNumberError(true);
                    } else if (emailEnterForDep) {
                      const value = e.target.value.replace(/[\n\s\t]+/g, "");
                      if (value.length) {
                        if (validateEmail(value)) {
                          setPhoneNumberError(false);
                        } else {
                          setPhoneNumberError(true);
                        }
                      }
                    } else if (
                      paymentMethod.slug !== "piastrix" &&
                      !emailEnterForDep
                    ) {
                      const value = e.target.value.replace(/[\n\s\t]+/g, "");
                      if (value.length) {
                        if (!/^(\+?7|8)[0-9]{10}$/.test(value)) {
                          setPhoneNumberError(true);
                        } else {
                          setPhoneNumberError(false);
                        }
                      }
                      if (value.length !== e.target.value.length) {
                        setNumber(value);
                      }
                    }
                  }}
                  error={phoneNumberError}
                  refLink={inputNumber}
                />
              </div>
              <div className={css.amount}>
                <MaskInput
                  onChange={setAmount}
                  label={t("enter deposit amount")}
                  placeholder={t("deposit amount")}
                  icon={auth.user.currency?.sign}
                  scale={auth.user.currency?.subunits}
                />
              </div>
            </div>
          </div>
          {paymentMethod.slug !== "telegram_pay" && (
            <div className={css.deposit_limits}>
              {paymentMethod.min_limit && (
                <div>
                  {t("Min amount deposit")} -{" "}
                  {toCurrencyString(
                    paymentMethod.min_limit.toStringWithSubUnits(
                      auth.user.currency?.subunits
                    )
                  )}{" "}
                  {auth.user.currency?.sign}
                </div>
              )}
              {paymentMethod.max_limit && (
                <div>
                  {t("Max amount deposit")} -{" "}
                  {toCurrencyString(
                    paymentMethod.max_limit.toStringWithSubUnits(
                      auth.user.currency?.subunits
                    )
                  )}{" "}
                  {auth.user.currency?.sign}
                </div>
              )}
            </div>
          )}
          <div className={css.title_selectBonus}>{t("сhoose a bonus")}</div>
          <div className={classNames(css.alt, css.card_deposit, css.bonus)}>
            {(bonusLoading || fetchingActiveBonus) && <Loader />}
            {(bonusLoading || fetchingActiveBonus) && !acceptedBonus ? null : (
              <>
                <div className={css.available_block}>
                  <Swiper
                    onSlideChange={(e) => setActiveSwiperIndex(e.activeIndex)}
                    ref={swiperRef}
                  >
                    {slides.map((slide) => (
                      <SwiperSlide>
                        <div className={css.cards_wraper}>
                          {slide?.map((item, index) =>
                            item.id ? (
                              <img
                                className={classNames(css.bonus_card, {
                                  [css.bonus_card__active]:
                                    selectedBonus === item.id,
                                })}
                                key={item.id}
                                onClick={() => {
                                  selectBonus(item.id);
                                }}
                                src={
                                  item.id === 1
                                    ? noBonusImg
                                    : `https://${host}/uploads/${item.image}`
                                }
                                alt=""
                              />
                            ) : (
                              <img
                                className={css.no_bonus}
                                src={hasNoBonus}
                                alt=""
                              />
                            )
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                    {newDataArray?.length > itemsPerPage && (
                      <div className={css.pagination}>
                        <div className={css.arrow_left} onClick={goPrev}>
                          <img src={arrow} alt="" />
                        </div>
                        {slides.map((_, index) => (
                          <SlideControlButton
                            key={index}
                            i={index}
                            isActive={index === activeSwiperIndex}
                          />
                        ))}
                        <div className={css.arrow_right} onClick={goNext}>
                          <img src={arrow} alt="" />
                        </div>
                      </div>
                    )}
                  </Swiper>
                </div>
                <div className={css.detail_blok__bonus}>
                  <div
                    className={classNames(css.description_block, {
                      [css.description_block_notBonus]: selectedBonus === 1,
                    })}
                  >
                    {selectedBonus === 1 ? (
                      <div className={css.description_block__title}>
                        {t("no bonus")}
                      </div>
                    ) : newDataArray ? (
                      <DescriptionBonus bonus={bonus} />
                    ) : (
                      <Loader />
                    )}
                  </div>
                </div>
                <div className={css.divider} />
              </>
            )}
            {timeBonusAvalailableAt ? (
              <TimerComponent dateString={timeBonusAvalailableAt} />
            ) : (
              <div className={css.bonus__notice}>
                {amount &&
                selectedBonusObj &&
                ((selectedBonusObj?.deposit_max_amount &&
                  amount.replace(/\s/g, "") >
                    selectedBonusObj?.deposit_max_amount) ||
                  (selectedBonusObj?.deposit_min_amount &&
                    amount.replace(/\s/g, "") <
                      selectedBonusObj?.deposit_min_amount.toStringWithSubUnits(
                        auth.user.currency?.subunits
                      ))) ? (
                  <>
                    {t("Bonus conditions not met")}
                    {selectedBonus &&
                    acceptedBonus &&
                    acceptedBonus.id !== selectedBonus ? (
                      <br />
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  ""
                )}
                {selectedBonus !== 1 &&
                selectedBonus &&
                acceptedBonus &&
                acceptedBonus.id !== selectedBonus ? (
                  <>
                    {t("You already have an active bonus")}.&nbsp;
                    {t("Selecting a new bonus will cancel the active one.")}
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
          <Button
            isLoading={isLoading || bonusActivating}
            className={classNames(css.bonus__button, {
              [css.button_top_notBonus]: selectedBonus === 1,
            })}
            onClick={onPayClick}
            variant="gold"
            disabled={
              !amount ||
              amount === "0" ||
              (amount &&
                paymentMethod.min_limit &&
                parseFloat(amount) < paymentMethod.min_limit / 100) ||
              (amount &&
                paymentMethod.min_limit &&
                parseFloat(amount) > paymentMethod.max_limit / 100) ||
              !number ||
              number === "0" ||
              (number.length < 10 && paymentMethod.slug !== "piastrix") ||
              timeBonusAvalailableAt
            }
          >
            {t("top up")}
          </Button>
        </div>
      </div>

      <CancelBonus
        setShowConfirm={setShowConfirm}
        showConfirm={showConfirm}
        onCancelSuccess={onSuccessCancel}
      />
    </>
  );

  if (isMobile) {
    return body;
  }

  return (
    <InnerPane paneClass={css.inner_pane} className={css.inner_pane_container}>
      {body}
    </InnerPane>
  );
}
