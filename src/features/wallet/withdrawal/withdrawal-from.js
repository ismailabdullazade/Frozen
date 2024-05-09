import css from "../form/style.module.css";
import InnerPane from "../../../components/inner-pane/inner-pane";
import Button from "../../../components/button/button";
import { useTranslation } from "react-i18next";
import Input from "../../../components/form2/input";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Modal from "../../../components/modal/modal";
import { Link } from "react-router-dom";
import arrowLeft from "../../../images/arrow-left.svg";
import {
  digitsValue,
  normalizeNumericAmountToString,
  toCurrencyString,
  validatePhoneNumbers,
  validatePhoneNumbersLength,
} from "../../../utils/validation";
import { useAuth } from "../../../services/auth";
import { useGetBalanceQuery } from "../../../app/api/user.api";
import { usePayoutMutation } from "../../../app/api/wallet.api";
import { useGetActiveBonusQuery } from "../../../app/api/bonus.api";
import CancelBonus from "../../my-bonus/cancel-bonus/cancel-bonus";
import MaskInput from "../../../components/form2/mask-input";
import { useMediaQuery } from "beautiful-react-hooks";
import { toast } from "react-toastify";
import TwofaOtp from "../../../components/twofa-otp/twofa-otp";

export default function WithdrawalFrom({
  paymentMethod,
  setPaymentMethod,
  setTab,
  cardExpires,
  cardHolder,
}) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  // eslint-disable-next-line
  const withdrawalRequisitesTitles = {
    crypto: "Withdrawal crypto address",
    card: "Card number",
    emoney: "e-money",
  };
  const [requisites, setRequisites] = useState();
  const [requisitesError, setRequisitesError] = useState();
  const [errorOpened, setErrorOpened] = useState(false);
  const auth = useAuth();
  const [successOpened, setSuccessOpened] = useState(false);
  const { data: userFinance } = useGetBalanceQuery();
  // eslint-disable-next-line
  const [payout, { data, error, isLoading, reset }] = usePayoutMutation();
  const { data: activeBonus, error: errorActiveBonus } =
    useGetActiveBonusQuery();
  const [withdrawalCancel, setShowConfirm] = useState();
  const [cardExpiresMonth, setCardExpireMonth] = useState();
  const [cardExpiresYear, setCardExpireYear] = useState();
  const [expiresYearError, setExpiresYearError] = useState(false);
  const [expiresMonthError, setExpiresMonthError] = useState(false);
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardHolderError, setCardHolderError] = useState(false);
  const [acceptedBonus, setAccepted] = useState();
  // eslint-disable-next-line
  const [expiryError, setExpiryError] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = currentDate.getMonth() + 1;
  const phonePay =
    paymentMethod.slug === "piastrix_sbp_sberbank" ||
    paymentMethod.slug === "piastrix_sbp_tinkoff";

  const checkDate = () => {
    const year = +`20${cardExpiresYear}`;
    if (
      !(
        (+cardExpiresMonth >= currentMonth && year === +currentYear) ||
        year > +currentYear
      )
    ) {
      setExpiresYearError(false);
      setExpiryDateError(true);
    }
  };
  const [twoFa, setTwoFa] = useState(null);
  const confirmWithOtp = (otp) => {
    payoutBody.body.one_time_password = otp;
    payout(payoutBody);
  };
  const closeTwofaOtp = () => {
    setTwoFa(null);
    reset();
  };

  useEffect(() => {
    if (error?.status === 406) {
      setTwoFa(payoutBody);
    }
    if (error?.status === 403) {
      const notify = () =>
        toast(t("Invalide code"), {
          theme: "dark",
          type: "error",
        });
      notify();
    }
    // eslint-disable-next-line
  }, [error]);

  useEffect(() => {
    if (data) {
      setSuccessOpened(true);
      setAmount("");
      setRequisites("");
      setTwoFa(null);
    }
  }, [data]);

  useEffect(() => {
    if (activeBonus) {
      setAccepted(activeBonus);
    }
    if (errorActiveBonus) {
      setAccepted(null);
    }
  }, [errorActiveBonus, activeBonus]);

  const payoutBody = {
    body: {
      amount: normalizeNumericAmountToString(amount),
      provider: paymentMethod.provider,
      requisites: {},
    },
  };

  if (paymentMethod.type === "walletNumber") {
    payoutBody.body.requisites.walletNumber = requisites;
  }
  if (paymentMethod.type === "card") {
    payoutBody.body.requisites.cardNumber =
      normalizeNumericAmountToString(requisites);
  }

  if (cardExpires) {
    const month =
      cardExpiresMonth?.length === 1
        ? `0${cardExpiresMonth}`
        : cardExpiresMonth;
    payoutBody.body.requisites.cardExpires = `${month}/${cardExpiresYear}`;
  }
  if (cardHolder) {
    payoutBody.body.requisites.cardHolder = `${cardHolderName}`;
  }

  const body = (
    <>
      <Modal
        isOpen={errorOpened}
        closeModal={() => setErrorOpened(false)}
        theme={"withdrawal"}
      >
        <div className={css.error}>
          <div className={css.error_header}>
            <div className={css.error_title}>{t("Error")}</div>
          </div>
          <div className={css.error_text}>{t(errorOpened)}</div>
          <Button
            className={css.error_btn}
            onClick={() => setErrorOpened(false)}
          >
            {t("Ok")}
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={successOpened}
        closeModal={() => setSuccessOpened(false)}
        theme={"withdrawal"}
      >
        <div className={css.error}>
          <div className={css.error_header}>
            <div className={css.error_title}>{t("Withdrawal of funds")}</div>
          </div>
          <div className={css.error_text}>
            <div>
              <span>
                {t(
                  "Your application is accepted. Expect withdrawal confirmation. The operation is saved in the"
                )}
              </span>
              <Link
                to={""}
                onClick={(e) => {
                  e.preventDefault();
                  setTab("Transactions");
                  setSuccessOpened(false);
                }}
              >
                {t("History section")}.
              </Link>
            </div>
          </div>
          <Button
            className={css.error_btn}
            onClick={() => setSuccessOpened(false)}
          >
            {t("Ok")}
          </Button>
        </div>
      </Modal>
      <div className={css.withdrawal}>
        <div className={classNames(css.wrapper, css.wrapper_withdrawal)}>
          <div className={classNames(css.detail, css.detail_withdrawal)}>
            <div className={classNames(css.requisites, css.withdrawal_form)}>
              <div>
                <div className={css.amount}>
                  <MaskInput
                    className={css.amoutn_input}
                    label={t("enter withdrawal amount")}
                    placeholder={t("withdrawal amount-2")}
                    onChange={(val) => {
                      setAmount(val);
                      return;
                    }}
                    icon={auth.user.currency?.sign}
                  />
                </div>
              </div>
            </div>
            <div className={css.deposit_limits}>
              {paymentMethod.min_limit && (
                <div>
                  {t("Min amount withdrawal")} -{" "}
                  {toCurrencyString(paymentMethod.min_limit / 100)}{" "}
                  {auth.user.currency?.sign}
                </div>
              )}
              {paymentMethod.max_limit && (
                <div>
                  {t("Max amount withdrawal")} -{" "}
                  {toCurrencyString(paymentMethod.max_limit / 100)}{" "}
                  {auth.user.currency?.sign}
                </div>
              )}
            </div>
          </div>
          <div className={classNames(css.alt, css.withdrawal)}>
            <div className={classNames(css.info_block, css.info_block__card)}>
              <div className={css.withdrawal_requisites}>
                <Input
                  value={requisites}
                  error={requisitesError}
                  label={t("enter card number")}
                  placeholder={
                    phonePay ? t("Phone number") : "0000 0000 0000 0000"
                  }
                  onChange={(val) => {
                    if (
                      paymentMethod.type === "card" ||
                      paymentMethod.type === "piastrix_card"
                    ) {
                      if (val.length > 18) {
                        setRequisitesError(false);
                      } else {
                        setRequisitesError(true);
                      }
                      val = val.slice(0, 24);
                      setRequisites(digitsValue(val, 5));
                    } else {
                      if (paymentMethod.slug.includes("qiwi") || phonePay) {
                        const value =
                          "+7" + val.replace("+7", "").replace(/\D/g, "");

                        if (
                          value.replace("+", "").length > 13 ||
                          value.replace("+", "").length < 8
                        ) {
                          setRequisitesError(true);
                        } else {
                          setRequisitesError(false);
                        }

                        setRequisites(value);
                      } else {
                        setRequisitesError(false);
                        setRequisites(val);
                      }
                    }
                  }}
                />
                {cardExpires && (
                  <div className={css.withdrawal_requisites__card_expire}>
                    <span className={css.text}>{t("Card Expire")}</span>
                    <div className={css.withdrawal_block}>
                      <Input
                        value={cardExpiresMonth}
                        placeholder={t("mm")}
                        onChange={(val) => {
                          if (val === "" || val === "0") {
                            setExpiresMonthError(false);
                            setExpiryDateError(false);
                            setCardExpireMonth(val);
                          } else {
                            const num = parseInt(val);
                            if (
                              val.length < 3 &&
                              typeof num === "number" &&
                              num < 13 &&
                              num > -1
                            ) {
                              setExpiresMonthError(false);
                              setExpiryDateError(false);
                              setCardExpireMonth(val);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          if (+cardExpiresYear) {
                            checkDate();
                          } else {
                            if (
                              e.target.value === "" ||
                              e.target.value === "0" ||
                              e.target.value === "00"
                            ) {
                              setExpiresMonthError(true);
                            }
                          }
                          if (e.target.value.length === 1) {
                            setCardExpireMonth(`0${e.target.value}`);
                          }
                        }}
                        className={css.input}
                        error={expiresMonthError || expiryDateError}
                      />
                      <span className={css.slash}>/</span>
                      <Input
                        value={cardExpiresYear}
                        placeholder={t("yy")}
                        onChange={(val) => {
                          if (val === "" || val === "0") {
                            setExpiresYearError(false);
                            setExpiryDateError(false);
                            setCardExpireYear(val);
                          } else {
                            const num = parseInt(val);
                            if (val.length < 3 && typeof num === "number") {
                              setExpiresYearError(false);
                              setExpiryDateError(false);
                              setCardExpireYear(val);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const year = +("20" + e.target.value);
                          if (+cardExpiresMonth) {
                            //Если месяц был заполнен, то сравним месяц/год с текущими
                            checkDate();
                          } else {
                            //Если месяц не был заполнен, то проверим только год на пустоту
                            if (
                              e.target.value === "" ||
                              e.target.value === "0" ||
                              year < currentYear
                            ) {
                              setExpiresYearError(true);
                            }
                          }
                        }}
                        error={expiresYearError || expiryDateError}
                        className={css.input}
                      />
                    </div>
                  </div>
                )}
                {cardHolder && (
                  <div className={css.withdrawal_requisites__card_holder}>
                    <Input
                      label={t("Card holder")}
                      value={cardHolderName}
                      placeholder={"Ivan Ivanov"}
                      onChange={(val) => {
                        setCardHolderError(false);
                        setCardHolderName(val.toUpperCase());
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          setCardHolderError(true);
                        }
                      }}
                      error={cardHolderError}
                      className={css.input}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={css.btn}>
          <div className={css.bonus_alert}>
            {t("Withdrawal request will result in cancellation ")}
            <Link to={"/my-bonus"}>{t("active bonus (cancel)")}</Link>
          </div>
          <Button
            onClick={(e) => {
              const amountToWithdrawal =
                +normalizeNumericAmountToString(amount);
              if (
                paymentMethod.type === "phone" &&
                !(
                  validatePhoneNumbers(requisites) &&
                  validatePhoneNumbersLength(requisites)
                )
              ) {
                setRequisitesError("Wrong phone number");
                return;
              }

              if (
                paymentMethod.type === "walletNumber" &&
                requisites?.length < 2
              ) {
                setRequisitesError("Wrong wallet number");
                return;
              }

              if (userFinance?.balance / 100 < amountToWithdrawal) {
                //если указана сумма превышающаяя баланс
                setErrorOpened("Insufficient funds for output.");
              } else {
                if (acceptedBonus) {
                  setShowConfirm(true);
                } else {
                  payout(payoutBody);
                }
              }
            }}
            disabled={
              requisitesError ||
              !amount ||
              !requisites ||
              (amount &&
                paymentMethod.min_limit &&
                parseFloat(amount) < paymentMethod.min_limit / 100) ||
              (amount &&
                paymentMethod.max_limit &&
                parseFloat(amount) > paymentMethod.max_limit / 100) ||
              expiryError ||
              expiresYearError ||
              expiresMonthError ||
              cardHolderError ||
              (cardExpires && (!cardExpiresMonth || !cardExpiresYear)) ||
              (cardHolder && !cardHolderName)
            }
            isLoading={isLoading}
            variant="gold"
          >
            {t("Withdraw")}
          </Button>
        </div>
      </div>
      <CancelBonus
        setShowConfirm={setShowConfirm}
        withdrawalCancel={withdrawalCancel}
        onCancelSuccess={() => payout(payoutBody)}
      />
      <TwofaOtp
        action={confirmWithOtp}
        close={closeTwofaOtp}
        isOpen={twoFa}
        isLoading={isLoading}
        title={t("Confirmation")}
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
