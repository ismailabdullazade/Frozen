import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import InnerPane from "../../../components/inner-pane/inner-pane";
import css from "./style.module.css";
import Input from "../../../components/form3/input";
import copy from "../../../images/items/copy.svg";
import classNames from "classnames";
import { toast } from "react-toastify";
import { successConfig } from "../../../utils/toastify.config";
import arrow from "../../../images/banners/arrow_banners.svg";
import Loader from "../../../components/loader/Loader";
import Button from "../../../components/button/button";
import {
  useGetActiveBonusQuery,
  useGetBonusSlotQuery,
  useTakeBonusMutation,
} from "../../../app/api/bonus.api";
import {
  useDepositMutation,
  useFetchExchangeRatesDepositQuery,
} from "../../../app/api/wallet.api";
import { toCurrencyString } from "../../../utils/validation";
import { useAuth } from "../../../services/auth";
import CancelBonus from "../../my-bonus/cancel-bonus/cancel-bonus";
import MaskInput from "../../../components/form2/mask-input-3";
import TimerComponent from "../../my-bonus/available-bonuses/timer/available-at-timer";
import { loadBaseUrl } from "../../../app/api/api.config";
import DescriptionBonus from "../../my-bonus/description-bonus/description-bonus";
import { Swiper, SwiperSlide } from "swiper/react";
import SlideControlButton from "../../my-bonus/available-bonuses/slide-control/control";
import hasNoBonus from "../../../images/bonuses/has-no-bonus.svg";
import noBonusImg from "./../../../images/wallet/no_bonus.svg";
import { useDispatch, useSelector } from "react-redux";
import { setNotBonusDep } from "../../../app/app.slice";
import Modal from "../../../components/modal/modal";
import card from "./../../../images/wallet/kauri_modal.svg";
import { useMediaQuery } from "beautiful-react-hooks";

export default function Kauri({
  paymentMethod,
  setPaymentMethod,
  defaultSelectedBonus,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: bonusSlot, isLoading: bonusLoading } = useGetBonusSlotQuery();
  const {
    data: activeBonus,
    isLoading: fetchingActiveBonus,
    error: errorActiveBonus,
  } = useGetActiveBonusQuery();
  const [selectedBonus, selectBonus] = useState(Number(defaultSelectedBonus));
  const selectedBonusObj = useMemo(() => {
    return bonusSlot?.find((item) => item.id === selectedBonus);
  }, [selectedBonus, bonusSlot]);

  const defaultBonus = {
    id: 1,
    title: t("no bonus"),
    image: [noBonusImg],
  };

  // eslint-disable-next-line
  const [
    activateBonus,
    // eslint-disable-next-line
    { data: bonusActivateData, isLoading: bonusActivating },
  ] = useTakeBonusMutation();
  const { data: exchangeRates } = useFetchExchangeRatesDepositQuery();
  const { data } = useGetBonusSlotQuery();
  const [acceptedBonus, setAccepted] = useState(activeBonus);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState();
  const newDataArray = Array.isArray(data)
    ? [defaultBonus, ...data]
    : [defaultBonus];
  const bonus = newDataArray?.find((item) => item.id === selectedBonus);
  // eslint-disable-next-line
  const [replenish, { data: paymentData, isLoading, error }] =
    useDepositMutation();
  const auth = useAuth();
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState();
  const notBonusDep = useSelector((state) => state.app.notBonusDep);
  const [openQRCodeModal, setOpenQRCodeModal] = useState(false);
  const isTable = useMediaQuery("(max-width: 1440px)");
  const itemsPerPage = isTable ? 2 : 3;
  const [amountOut, setAmountOut] = useState("");
  const host = loadBaseUrl().split("/")[0];
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

  const onPayClick = () => {
    if (
      selectedBonus &&
      acceptedBonus &&
      acceptedBonus.id !== selectedBonus &&
      selectedBonus !== 1
    ) {
      //ЕСли есть активный бонус и юзер выбрал другой, то вывести препреждение, это не Без бонуса, после подверждения бонус будет деактивирован
      setShowConfirm(true);
    } else {
      depositRequest();
    }
  };
  const [timeBonusAvalailableAt, setTimeBonusAvalailableAt] = useState(null);
  const requestCurrency = paymentMethod.currency.includes("USDT")
    ? "USDT"
    : paymentMethod.currency;
  const depositRequest = () => {
    if (selectedBonus && acceptedBonus?.id !== selectedBonus) {
      //Если бонус выбран, но это не тот бонус, который был выбран ранее, нужно активировать новый бонус
      activateBonus({ slotId: selectedBonus });
    }
    if (selectedBonus === 1) {
      dispatch(setNotBonusDep(true));
    }
    if (!paymentData && !isLoading) {
      replenish({
        provider: paymentMethod.provider,
        requisites: {
          currency: paymentMethod.currency,
        },
      });
    }
  };
  const currencyPair = useMemo(() => {
    if (!auth || !exchangeRates) {
      return null;
    } else if (auth.user.currency.code === paymentMethod.currency) {
      return { exchange: 1 };
    } else {
      return exchangeRates.find(
        (currency) =>
          currency.code_from === auth.user.currency.code &&
          currency.code_to === requestCurrency
      );
    }
    // eslint-disable-next-line
  }, [auth, exchangeRates]);

  useEffect(() => {
    if (selectedBonusObj?.available_at && !selectedBonusObj?.available) {
      setTimeBonusAvalailableAt(selectedBonusObj.available_at);
    } else if (timeBonusAvalailableAt) {
      setTimeBonusAvalailableAt(null);
    }
    // eslint-disable-next-line
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
    if (newDataArray && !selectedBonus) {
      //Если при загрузке страницы были получены бонусы и при этом еще не был получен/выбран активный бонус, то выберем первый
      selectBonus(newDataArray[0]?.id);
      dispatch(setNotBonusDep(false));
    }
    // eslint-disable-next-line
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

  const closeModalKauri = () => {
    dispatch(setNotBonusDep(false));
    setOpenQRCodeModal(false);
  };

  useEffect(() => {
    paymentData ? setOpenQRCodeModal(true) : setOpenQRCodeModal(false);
  }, [paymentData]);

  return (
    <InnerPane paneClass={css.inner_pane} className={css.inner_pane_container}>
      <div className={classNames(css.wrapper, css.wrapper_dep)}>
        <div className={classNames(css.detail, css.kauri)}>
          <div className={css.requisites}>
            <div>
              <div className={css.amount}>
                <MaskInput
                  label={t("enter withdrawal amount")}
                  onChange={(val) => {
                    setAmount(val);
                    if (val) {
                      const newAmountOut = val * (currencyPair?.exchange ?? 0);
                      if (newAmountOut && !isNaN(newAmountOut)) {
                        setAmountOut(val * currencyPair.exchange);
                      }
                    } else {
                      setAmountOut("");
                    }
                  }}
                  value={amount}
                  disabled={!!paymentData}
                  icon={auth.user.currency?.sign}
                  currencySubunits={auth.user.currency?.subunits}
                  name="currency-from"
                  scale={auth.user.currency?.subunits}
                  className={css.amoutn_input}
                />
              </div>
              <div className={css.currencies}>
                <MaskInput
                  value={amountOut}
                  type={"text"}
                  label={t("according to the rate")}
                  onChange={(val) => {
                    setAmountOut(val);
                    if (val) {
                      const newAmount = val / currencyPair.exchange;
                      if (newAmount && !isNaN(newAmount)) {
                        setAmount(newAmount);
                      }
                    } else {
                      setAmount("");
                    }
                  }}
                  icon={
                    <div className={css.outputCurrencyName}>
                      <span>{paymentMethod.currency}</span>
                    </div>
                  }
                  currencySubunits={5}
                  disabled={true}
                  name="currency-out"
                />
              </div>
            </div>
          </div>
          {(paymentMethod.min_limit || paymentMethod.max_limit) && (
            <div className={css.deposit_limits}>
              {paymentMethod.min_limit && (
                <div>
                  {t("Min amount deposit")} -{" "}
                  {toCurrencyString(
                    paymentMethod?.min_limit.toStringWithSubUnits(
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
                    paymentMethod?.max_limit.toStringWithSubUnits(
                      auth.user.currency?.subunits
                    )
                  )}{" "}
                  {auth.user.currency?.sign}
                </div>
              )}
            </div>
          )}
          <div className={css.title_selectBonus}>{t("сhoose a bonus")}</div>
          <div className={classNames(css.detail_blok__bonus, css.cripto)}>
            <div
              className={classNames(
                css.alt,
                css.card_deposit,
                css.bonus,
                css.cripto
              )}
            >
              {bonusLoading ||
                fetchingActiveBonus ||
                (bonusSlot && isLoading && <Loader />)}
              {((bonusLoading || fetchingActiveBonus) && !acceptedBonus) ||
              isLoading ||
              !newDataArray ? null : (
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
                  <div className={css.divider} />
                </>
              )}

              {timeBonusAvalailableAt ? (
                <div className={css.bonus__timer}>
                  {t(`Will be available at`)}&nbsp;
                  <TimerComponent dateString={timeBonusAvalailableAt} />
                </div>
              ) : (
                <div className={css.bonus__notice}>
                  {!notBonusDep &&
                  amount &&
                  selectedBonusObj &&
                  ((selectedBonusObj?.deposit_max_amount &&
                    String(amount).replace(/\s/g, "") >
                      selectedBonusObj?.deposit_max_amount) ||
                    (selectedBonusObj?.deposit_min_amount &&
                      String(amount).replace(/\s/g, "") <
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
            <div
              className={classNames(css.description_block, {
                [css.description_block_noBonus]: selectedBonus === 1,
              })}
            >
              {selectedBonus === 1 || notBonusDep ? (
                <div className={css.description_block__title}>
                  {t("no bonus")}
                </div>
              ) : (
                <DescriptionBonus bonus={bonus} variant={"wallet"} />
              )}
            </div>
          </div>
          <Button
            isLoading={isLoading || bonusActivating}
            className={classNames(css.bonus__button, css.bonus__button_kauri, {
              [css.button_kauri_notBonus]: selectedBonus === 1,
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
              (selectedBonusObj &&
                selectedBonusObj?.deposit_max_amount &&
                String(amount).replace(/\s/g, "") >
                  selectedBonusObj?.deposit_max_amount) ||
              (selectedBonusObj?.deposit_min_amount &&
                String(amount).replace(/\s/g, "") <
                  selectedBonusObj?.deposit_min_amount.toStringWithSubUnits(
                    auth.user.currency?.subunits
                  )) ||
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
        onCancelSuccess={depositRequest}
      />
      <Modal isOpen={openQRCodeModal} theme={"kauri"}>
        <div className={classNames(css.payment_crypto)}>
          <div className={css.input}>
            <div className={css.input_title}>
              <img src={card} alt="" />
              <span className={css.title_modal__kauri}>
                {t("deposit via crypto")}
              </span>
            </div>
            <label>{t("Casino wallet")}</label>
            <div className={css.inputs}>
              <Input
                defaultValue={paymentData?.addr}
                icon={
                  <img
                    onClick={() => {
                      navigator.clipboard.writeText(paymentData?.addr);
                      const notify = () =>
                        toast(t("address copied"), {
                          ...successConfig,
                        });
                      notify();
                    }}
                    src={copy}
                    className={classNames(css.pointer, css.input_icon)}
                    alt=""
                  />
                }
                className={css.crypto_address}
                readOnly={true}
              />
            </div>
            <div className={css.btn_block}>
              <Button variant="gold" onClick={() => closeModalKauri()}>
                {t("paid kauri")}
              </Button>
              <Button variant="violet" onClick={() => closeModalKauri()}>
                {t("Cancel")}
              </Button>
            </div>
          </div>
          <div className={css.qr_block}>
            <div className={css.qr_code}>
              <img src={`data:image/jpeg;base64,${paymentData?.qr}`} alt="" />
            </div>
            <div className={css.requisites_text}>{t("Requisites text 2")}</div>
          </div>
        </div>
      </Modal>
    </InnerPane>
  );
}
