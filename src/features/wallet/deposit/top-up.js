import PaymentsMethods from "../payment-methods/payment-methods";
import css from "../payment-default.module.css";
import Form from "../form/deposit-form";
import Kauri from "../form/kauri";
import { useGetPaymentMethodsQuery } from "../../../app/api/wallet.api";
import { useLocation } from "react-router-dom";
import { searchParams } from "../../../utils/search-params";
import { useState } from "react";

export default function TopUp({ paymentMethod, setPaymentMethod }) {
  const { data } = useGetPaymentMethodsQuery();
  const location = useLocation();
  const searchParameters = searchParams(location.search);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "Black Rabbit acquirin"
  );

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
          methods={[...data]}
        />
      )}

      {/* Отображаем форму выбранной платежки, если она выбрана */}
      {selectedPaymentMethod && (
        <>
          {selectedPaymentMethod.provider === "kauri" ? (
            <Kauri
              setPaymentMethod={setPaymentMethod}
              paymentMethod={selectedPaymentMethod}
              defaultSelectedBonus={searchParameters.b}
            />
          ) : (
            <Form
              setPaymentMethod={setPaymentMethod}
              paymentMethod={selectedPaymentMethod}
              defaultSelectedBonus={searchParameters.b}
            />
          )}
        </>
      )}
    </div>
  );
}
