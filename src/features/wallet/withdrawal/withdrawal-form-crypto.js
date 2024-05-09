import css from "../form/style.module.css";
import InnerPane from "../../../components/inner-pane/inner-pane";
import Button from "../../../components/button/button";
import { useTranslation } from "react-i18next";
import Input from "../../../components/form2/input";
import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import Modal from "../../../components/modal/modal";
import { Link } from "react-router-dom";
import arrowLeft from "../../../images/arrow-left.svg";
import {
  normalizeNumericAmountToString,
  toCurrencyString,
  // eslint-disable-next-line
  validatePhoneNumbers,
  validatePhoneNumbersLength,
} from "../../../utils/validation";
import { useAuth } from "../../../services/auth";
import { useGetBalanceQuery } from "../../../app/api/user.api";
// eslint-disable-next-line
import {
  useFetchExchangeRatesQuery,
  usePayoutMutation,
} from "../../../app/api/wallet.api";
import { useGetActiveBonusQuery } from "../../../app/api/bonus.api";
import CancelBonus from "../../my-bonus/cancel-bonus/cancel-bonus";
import MaskInput from "../../../components/form2/mask-input-3";
import { useMediaQuery } from "beautiful-react-hooks";
import TwofaOtp from "../../../components/twofa-otp/twofa-otp";
import { toast } from "react-toastify";

export default function WithdrawalFrom({
  paymentMethod,
  setPaymentMethod,
  setTab,
  cardExpires,
  cardHolder,
}) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [requisites, setRequisites] = useState();
  // eslint-disable-next-line
  const [requisitesError, setRequisitesError] = useState();
  const [errorOpened, setErrorOpened] = useState(false);
  const auth = useAuth();
  const [successOpened, setSuccessOpened] = useState(false);
  const { data: userFinance } = useGetBalanceQuery();
  // eslint-disable-next-line
  const [payout, { data, error, isLoading, reset }] = usePayoutMutation();
  const { data: activeBonus, error: errorActiveBonus } =
    useGetActiveBonusQuery();
  const [withdrawalCancel, showConfirmCancel] = useState();
  const [acceptedBonus, setAccepted] = useState();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [amountOut, setAmountOut] = useState("");
  const { data: exchangeRates } = useFetchExchangeRatesQuery();
  const requestCurency = paymentMethod.currency?.includes("USDT")
    ? "USDT"
    : paymentMethod.currency;
  const currencyPair = useMemo(() => {
    if (!auth || !exchangeRates) {
      return null;
    } else if (auth.user.currency.code === requestCurency) {
      return { exchange: 1 };
    } else {
      return exchangeRates.find(
        (currency) =>
          currency.code_from === auth.user.currency.code &&
          currency.code_to === requestCurency
      );
    }
  }, [auth, exchangeRates]);
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
  }, [error]);

  useEffect(() => {
    if (data) {
      setSuccessOpened(true);
      setAmount("");
      setTwoFa(null);
      setRequisites("");
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

  const payoutBody = (function () {
    const body = {
      body: {
        amount: normalizeNumericAmountToString(amount),
        provider: paymentMethod.provider,
      },
    };

    if (paymentMethod.type === "piastrix") {
      body.body.requisites = {
        account: requisites,
      };
    } else {
      body.body.requisites = {
        currencyOut: paymentMethod.currency,
        walletNumber: requisites,
        amount: amount,
      };
    }

    return body;
  })();

  const body = (
    <>
      <Modal
        isOpen={errorOpened}
        closeModal={() => setErrorOpened(false)}
        theme="withdrawal_small"
      >
        <div className={css.error}>
          <div className={css.error_header}>
            <div className={css.error_title}>{t("Error")}</div>
          </div>
          <div className={css.error_text}>
            {t("not enough funds for withdrawal")}
          </div>
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
        theme="withdrawal"
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
      <div className={classNames(css.wrapper, css.wrapper_withdrawal__kauri)}>
        <div className={classNames(css.detail, css.withdrawal_cripto)}>
          <div className={classNames(css.requisites, css.withdrawal_form)}>
            <div>
              <div className={css.amount}>
                <MaskInput
                  label={t("enter withdrawal amount")}
                  onChange={(val) => {
                    setAmount(val);
                    if (val && paymentMethod.type === "kauri") {
                      const newAmountOut = val * currencyPair.exchange;
                      if (newAmountOut && !isNaN(newAmountOut)) {
                        setAmountOut(val * currencyPair.exchange);
                      }
                    } else {
                      setAmountOut("");
                    }
                  }}
                  currencySubunits={auth.user.currency?.subunits}
                  value={amount}
                  icon={auth.user.currency?.sign}
                />
              </div>
              {paymentMethod.type === "kauri" && (
                <div className={css.currencies}>
                  <MaskInput
                    label={t("according to the rate")}
                    value={amountOut}
                    disabled={true}
                    type={"text"}
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
                    name="currency-out"
                    currencySubunits={5}
                  />
                  <div className={css.currenciesRateTitle}>
                    {t("Exchange rate")}
                  </div>
                </div>
              )}
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
        <div
          className={classNames(
            css.alt,
            css.withdrawal,
            css.withdrawal__piastrix
          )}
        >
          <div
            className={classNames(css.info_block, css.info_block__mobile, {
              [css.info_block__piastrix]: paymentMethod.type === "piastrix",
            })}
          >
            <div className={css.withdrawal_requisites}>
              <Input
                value={requisites}
                error={requisitesError}
                label={paymentMethod.requisitesLabel}
                placeholder={paymentMethod.requisitesLabel}
                onChange={(val) => {
                  setRequisites(val);
                }}
              />
            </div>
          </div>
          <div className={css.btn}>
            <div className={css.bonus_alert}>
              {t("Withdrawal request will result in cancellation ")}
              <Link to={"/my-bonus"}>{t("active bonus (cancel)")}</Link>
            </div>
            <Button
              variant="gold"
              onClick={(e) => {
                const amountToWithdrawal =
                  +normalizeNumericAmountToString(amount);
                if (userFinance?.balance / 100 < amountToWithdrawal) {
                  //если указана сумма превышающаяя баланс
                  setErrorOpened("Insufficient funds for output.");
                } else {
                  if (acceptedBonus) {
                    showConfirmCancel(true);
                  } else {
                    payout(payoutBody);
                  }
                }
              }}
              disabled={
                !amount ||
                !requisites ||
                (amount &&
                  paymentMethod.min_limit &&
                  parseFloat(amount) < paymentMethod.min_limit / 100) ||
                (amount &&
                  paymentMethod.max_limit &&
                  parseFloat(amount) > paymentMethod.max_limit / 100)
              }
              isLoading={isLoading}
            >
              {t("Withdraw")}
            </Button>
          </div>
        </div>
      </div>
      <CancelBonus
        setShowConfirm={showConfirmCancel}
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
