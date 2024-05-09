import { useTranslation } from "react-i18next";
import css from "./wallet.module.css";
import ContentPane from "../../components/content-pane/content-pane";
import React, { useEffect, useState } from "react";
import TopUp from "./deposit/top-up";
import Transactions from "./transactions/transactions";
import Withdrawal from "./withdrawal/withdrawal";
import classNames from "classnames";
import { Link, useHistory } from "react-router-dom";
import Modal from "../../components/modal/modal";
import Button from "../../components/button/button";
import style from "./form/style.module.css";
import { toast } from "react-toastify";
import wallet from "./../../images/wallet/wallet.svg";
import { useSelector } from "react-redux";
import { useMediaQuery } from "beautiful-react-hooks";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

const components = { Withdrawal, Transactions, TopUp };

export default function Wallet(props) {
  const { t } = useTranslation();
  const { tab = "TopUp" } = props;
  const TabContent = components[tab];
  const history = useHistory();
  const location = useLocation();
  const showBonusInfo = window.localStorage.getItem("show_bonus_info");
  const result = window.localStorage.getItem("result");
  const [successPaymentOpened, setSuccessPaymentState] = useState(
    result && result === "success"
  );
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [hiddenHeader, setHiddenHeader] = useState(true);
  const hideSidebarLeft = useSelector((state) => state.app.hideSidebarLeft);
  const isTablet = useMediaQuery("(max-width: 1280px)");

  window.addEventListener("error", (error) => {
    console.error("Global error:", error);
  });

  const hidePaymentResult = () => {
    window.localStorage.removeItem("show_bonus_info");
    window.localStorage.removeItem("result");
    setSuccessPaymentState(false);
  };

  useEffect(() => {
    if (location.pathname === "/wallet/transactions") {
      setHiddenHeader(false);
    } else {
      setHiddenHeader(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    try {
      if (result && result === "fail") {
        const notify = () =>
          toast(t("There was a deposit error"), {
            theme: "dark",
            type: "error",
          });
        notify();
        hidePaymentResult();
      }

      if (result && result === "success") {
        window.localStorage.removeItem("show_bonus_info");
        window.localStorage.removeItem("result");
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [result, t]);

  return (
    <ContentPane
      className={classNames(css.wallet, {
        [css.close]: hideSidebarLeft && !isTablet,
        [css.ransactions_meny]: !hiddenHeader,
      })}
      paneClass={css.pane}
    >
      {hiddenHeader && (
        <div className={css.wallet_header}>
          <div className={css.menu}>
            <div
              className={classNames(css.menu_item, {
                [css.active]: tab === "TopUp",
              })}
              onClick={() => {
                history.push("/wallet");
                setPaymentMethod(null);
              }}
            >
              {t("Deposit")}
            </div>
            <div
              className={classNames(css.menu_item, {
                [css.active]: tab === "Withdrawal",
              })}
              onClick={() => {
                history.push("/wallet/withdrawal");
                setPaymentMethod(null);
              }}
            >
              {t("Withdrawal of funds")}
            </div>
          </div>
          <div className={css.body}>
            <div className={css.body_name}>
              <img src={wallet} alt="" />
              <span className={css.body_name__title}>{t("wallet")}</span>
            </div>
            <div
              className={classNames(css.menu_item__history, {
                [css.active]: tab === "Transactions",
              })}
              onClick={() => {
                history.push("/wallet/transactions");
                setPaymentMethod(null);
              }}
            >
              {t("Transactions")}
            </div>
          </div>
        </div>
      )}
      <TabContent
        setTab={(tab) => {
          if (tab === "TopUp") {
            history.push("/wallet");
          }
          if (tab === "Withdrawal") {
            history.push("/wallet/withdrawal");
          }
          if (tab === "Transactions") {
            history.push("/wallet/transactions");
          }
        }}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
      <Modal
        isOpen={successPaymentOpened}
        closeModal={hidePaymentResult}
        className={style.modal}
        theme={showBonusInfo ? "withdrawal_midi" : "withdrawal_small"}
      >
        <div className={style.error}>
          <div className={style.error_header}>
            {showBonusInfo ? (
              <span className={style.error_title}>{t("Bonus")}</span>
            ) : (
              <span className={style.error_title}>{t("Deposit")}</span>
            )}
          </div>
          <div className={style.error_text}>
            {showBonusInfo ? (
              <span>
                {t(
                  "You have made a deposit and your bonus has been successfully activated. You can watch him play in the section"
                )}
                &nbsp;
                <Link to={"my-bonus"}>{t("bonus")}</Link>
              </span>
            ) : (
              t("Operation completed successfully")
            )}
          </div>
          <div className={style.btn_container}>
            <Button onClick={hidePaymentResult}>{t("Ok")}</Button>
          </div>
        </div>
      </Modal>
    </ContentPane>
  );
}
