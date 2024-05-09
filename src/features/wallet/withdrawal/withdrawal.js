import PaymentsMethods from "../payment-methods/payment-methods";
import css from "../payment-default.module.css";
import { useTranslation } from "react-i18next";
import WithdrawalFrom from "./withdrawal-from";
import WithdrawalFromCrypto from "./withdrawal-form-crypto";
import { useGetWithdrawalPaymentMethodsQuery } from "../../../app/api/wallet.api";
import { useState } from "react";

export default function Withdrawal({
  setTab,
  paymentMethod,
  setPaymentMethod,
}) {
  const { t } = useTranslation();
  const { data } = useGetWithdrawalPaymentMethodsQuery();
  const provider = paymentMethod?.provider;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "Black Rabbit acquirin"
  );

  console.log(selectedPaymentMethod);
  const handlePaymentMethodSelection = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentMethod(method);
  };

  return (
    <div className={css.wrapper}>
      {/* Отображаем список всех платежек */}
      {data && (
        <PaymentsMethods
          setPaymentMethod={handlePaymentMethodSelection}
          methods={data}
          type={"withdrawal"}
        />
      )}
      {/* Отображаем форму выбранной платежки, если она выбрана */}
      {selectedPaymentMethod && (
        <>
          {selectedPaymentMethod.provider === "kauri" ||
          selectedPaymentMethod.provider === "piastrix" ? (
            <WithdrawalFromCrypto
              setPaymentMethod={setPaymentMethod}
              paymentMethod={{
                ...paymentMethod,
                type: provider,
                requisitesLabel:
                  "kauri" === provider
                    ? `${t("Crypto address")}`
                    : t("Account name (piastrix)"),
              }}
              setTab={setTab}
            />
          ) : (
            <WithdrawalFrom
              setPaymentMethod={setPaymentMethod}
              paymentMethod={{
                ...paymentMethod,
                type: ["paycos_yoomoney", "paycos_qiwi"].includes(provider)
                  ? "walletNumber"
                  : "card",
                requisitesLabel: ["paycos_yoomoney", "paycos_qiwi"].includes(
                  provider
                )
                  ? t("Wallet number for withdrawal")
                  : t("Card number"),
              }}
              setTab={setTab}
              cardExpires={["paycos_p2p"].includes(provider)}
              cardHolder={["paycos_p2p"].includes(provider)}
            />
          )}
        </>
      )}
    </div>
  );
}
