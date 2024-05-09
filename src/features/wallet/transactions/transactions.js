import { useTranslation } from "react-i18next";
import css from "./transactions.module.css";
import ContentPane from "../../../components/content-pane/content-pane";
import moment from "moment";
import closeIcon from "../../../images/close.svg";
import Select from "../../../components/form3/select";
import React, { useEffect, useState } from "react";
import Datepicker from "../../../components/Datepicker/datepicker";
import {
  useCancelWithdrawalMutation,
  useFetchPaymentsListMutation,
} from "../../../app/api/wallet.api";
import Loader from "../../../components/loader/Loader";
import { useGetCurrenciesQuery } from "../../../app/api/user.api";
import ExtraFields from "./extra-fields";
import Button from "../../../components/button/button";
import Modal from "../../../components/modal/modal";
import { searchParams } from "../../../utils/search-params";
import Pagination from "../../../components/pagination/pagination";
import { useLocation, useHistory } from "react-router-dom";
import { useMediaQuery } from "beautiful-react-hooks";
import classNames from "classnames";

import blackRabit from "./../../../images/wallet/methods/blackRabit.svg";
import p2p from "./../../../images/wallet/methods/p2p.svg";
import qiwi from "./../../../images/wallet/methods/qiwi.svg";
import sbp from "./../../../images/wallet/methods/sbp.svg";
import kauri from "./../../../images/wallet/methods/kauri.svg";
import uMoney from "./../../../images/wallet/methods/uMoney.svg";
import piastrix from "./../../../images/wallet/methods/piastrix.svg";
import wallet from "./../../../images/wallet/wallet.svg";
import piastrix_sbp_sberbank from "./../../../images/wallet/methods/piastrix_sbp_sberbank.svg";
import piastrix_sbp_tinkoff from "./../../../images/wallet/methods/piastrix_sbp_tinkoff.svg";
import piastrix_bank from "./../../../images/wallet/methods/piastrix_bank.svg";
import piastrix_sber from "./../../../images/wallet/methods/piastrix_sber.svg";
import piastrix_sbp from "./../../../images/wallet/methods/piastrix_sbp.svg";
import paycos_p2p_106 from "./../../../images/wallet/methods/paycos_p2p_106.svg";
import wallet_expert_p2p from "./../../../images/wallet/methods/wallet_expert_p2p.svg";
import blackRabit_p2p from "./../../../images/wallet/methods/blackRabit_p2p.svg";

export default function Transactions({ setTab }) {
  const { t } = useTranslation();
  const [
    fetchHistory,
    { data: history, isLoading, error: historyError, reset, isUninitialized },
  ] = useFetchPaymentsListMutation();
  const location = useLocation();
  const historyLocation = useHistory();
  const searchParameters = searchParams(location.search);
  const [page, setPage] = useState(
    parseInt(searchParameters.page ? searchParameters.page : 1)
  );
  const [per_page, setPer_page] = useState(8);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const isMobile = useMediaQuery("(max-width: 960px)");
  const operations = [
    { label: t("All operations"), value: null },
    { label: t("Deposit"), value: "replenishment" },
    { label: t("Withdrawal-2"), value: "payout" },
    // {label: t("Transfer"), value: "transfer"},
    // {label: t("rejected"), value: "rejected"}
  ];
  const currentDate = () => new Date();
  const { data: currencies } = useGetCurrenciesQuery();
  const getCurrencySign = (code) => {
    const currency = currencies
      ? currencies.find((currency) => currency.code === code)
      : null;

    return currency?.sign;
  };
  const [showConfirm, setShowConfirm] = useState();
  // eslint-disable-next-line
  const [cancelWithdrawal, { data, error }] = useCancelWithdrawalMutation();
  const [dates, setDates] = useState(null);
  const [isInitted, setIsInitted] = useState();

  useEffect(() => {
    if (data) {
      reset();
    }
    // eslint-disable-next-line
  }, [data]);

  const methods = {
    "Black Rabbit acquiring": blackRabit,
    "BlackRabbit P2P": blackRabit_p2p,
    "Paycos P2P 10.6": paycos_p2p_106,
    "Wallet Expert P2P": wallet_expert_p2p,
    Piastrix: piastrix,
    "Paycos P2P": p2p,
    "Paycos Qiwi": qiwi,
    "Paycos Yoomoney": uMoney,
    Kauri: kauri,
    "Piastrix SBER SBP": piastrix_sbp_sberbank,
    "Piastrix TINKOFF SBP": piastrix_sbp_tinkoff,
    "Piastrix CARD": piastrix_bank,
    "Piastrix SBER CARD": piastrix_bank,
    "piastrix SBER": piastrix_sber,
    "Piastrix SBP": piastrix_sbp,
  };

  useEffect(() => {
    if (isMobile) {
      setPer_page(4);
    } else {
      setPer_page(8);
    }
    const filters = {
      page,
      per_page,
    };

    fetchHistory(filters);
    // eslint-disable-next-line
  }, [isMobile, page, per_page]);

  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    if (!historyLoaded && !isLoading && !historyError) {
      fetchHistory({ page });
      setHistoryLoaded(true);
    }
    if (history) {
      setIsInitted(true);
    }
    // eslint-disable-next-line
  }, [historyLoaded, isLoading, historyError, history]);

  useEffect(() => {
    if (historyLoaded || historyError) {
      const filters = {
        page,
        per_page,
      };
      if (selectedOperation) {
        filters.type = selectedOperation.value;
      }
      if (dates && dates.length === 2) {
        filters.date_from = moment(dates[0]).format("YYYY-MM-DD");
        filters.date_to = moment(dates[1]).format("YYYY-MM-DD");
      }
      fetchHistory(filters);
    }
    // eslint-disable-next-line
  }, [page, per_page, selectedOperation, dates, historyLoaded, historyError]);

  useEffect(() => {
    if (!history && !isLoading && !historyError) {
      fetchHistory({ page });
    }
    if (history) {
      setIsInitted(true);
    }
    // eslint-disable-next-line
  }, [history, historyError]);

  const body = (
    <>
      <div className={css.transactions_header}>
        <div className={css.body_name}>
          <img src={wallet} alt="" />
          <span className={css.body_name__title}>{t("wallet")}</span>
        </div>
        <div
          className={css.transactions_title}
          onClick={() => {
            historyLocation.push("/wallet");
          }}
        >
          {t("Deposit")}
        </div>
        <div
          className={css.transactions_title}
          onClick={() => {
            historyLocation.push("/wallet/withdrawal");
          }}
        >
          {t("Withdrawal of funds")}
        </div>
      </div>
      {((isInitted && history?.data?.length > 0) ||
        (isLoading && isInitted)) && (
        <div className={css.filters_wraper}>
          <div className={css.filters}>
            <Datepicker
              id={"date-filter"}
              placeholder={t("Period")}
              className={css.datepicker}
              config={{
                minDate: currentDate().setFullYear(
                  currentDate().getFullYear() - 1
                ),
                maxDate: currentDate(),
                range: true,
              }}
              value={
                dates && dates.length === 2
                  ? moment(dates[0]).format(t("date format")) +
                    " - " +
                    moment(dates[1]).format(t("date format"))
                  : ""
              }
              onChange={(val) => {
                if (val?.date) {
                  if (val.date?.length === 2) {
                    setDates(val.date);
                  }
                  if (val.date?.length === 0) {
                    setDates(null);
                  }
                } else {
                  setDates(null);
                }
              }}
            />
            <Select
              onChange={(val) => setSelectedOperation(val)}
              value={selectedOperation}
              placeholder={t("Operation")}
              // className={css.select}
              itemClass={css.select}
              options={operations}
              variant="top"
            />
          </div>
          {!isMobile && (
            <div className={css.bar_container}>
              <div className={css.bar_container__data}>
                {t("time and date")}
              </div>
              <div className={css.bar_container__metod}>{t("method")}</div>
              <div className={css.bar_container__chek}>
                {t("write-off account")}
              </div>
              <div className={css.bar_container__sum}>{t("sum")}</div>
              <div className={css.bar_container__status}>{t("Status")}</div>
            </div>
          )}
        </div>
      )}
      {(isLoading || isUninitialized) && (
        <div className={css.centred_content}>
          <Loader />
        </div>
      )}
      {history &&
        history?.data.map((item) => (
          <ContentPane
            key={`transactions-history-item-${item.created_at}`}
            className={css.content_pane}
            paneClass={css.content}
          >
            <div className={css.date_block}>
              <span className={css.time}>
                {moment(item.created_at).utc().format("HH:mm:ss")} GMT
              </span>
              <br />
              <span className={css.date}>
                {moment(item.created_at).utc().format("DD.MM.YYYY")}
              </span>
              <br />
              {item.type === "payout_request" &&
              (item.state_id === "wait" ||
                item.state_id === "verification_needed") ? (
                <Button
                  onClick={() => {
                    setShowConfirm(item);
                  }}
                  variant="blue"
                  className={css.cancel_icon}
                >
                  {t("Cancel-2")}
                </Button>
              ) : null}
            </div>
            <div className={css.methods_block}>
              <img src={methods[item?.method]} alt="" />
            </div>
            <div className={css.amount}>
              {(item.amount / 100)
                .toLocaleString(undefined, { minimumFractionDigits: 2 })
                .replace(",", ".")}
              &nbsp;
              {getCurrencySign(item.code)}
            </div>
            <ExtraFields item={item} />
          </ContentPane>
        ))}
      <Modal
        isOpen={showConfirm}
        closeModal={() => setShowConfirm(null)}
        className={css.modal}
        theme={"transaction"}
      >
        <div className={css.error}>
          <div className={css.error_header}>
            <div className={css.error_title}>{t("withdrawal-2")}</div>
          </div>

          <div className={css.error_text}>
            <span>{t("Are you sure you want to cancel the operation?")}</span>
          </div>
          <div
            className={classNames(css.btn_container, css.btn_container__width)}
          >
            <Button
              onClick={() => {
                cancelWithdrawal(showConfirm.id);
                setShowConfirm(false);
              }}
            >
              {t("Confirm")}
            </Button>
            <Button onClick={() => setShowConfirm(false)} variant={"blue"}>
              {t("Cancel")}
            </Button>
          </div>
        </div>
      </Modal>
      {!isUninitialized && history?.data?.length === 0 && (
        <div className={css.centred_content}>
          <div className={css.has_no_items}>
            <div>{t("You have not had financial transactions yet.")}</div>
            <Button
              onClick={() => setTab("TopUp")}
              childrenClassName={css.has_no_items__button}
            >
              {t("Top up balance")}
            </Button>
          </div>
        </div>
      )}
      {!isUninitialized && history?.data?.length > 0 && (
        <Pagination
          className={classNames(css.pagination, css.pagination_margin)}
          setPage={setPage}
          lastPage={history ? history.last_page : 1}
          variant={"wallet"}
          page={page}
        />
      )}
    </>
  );

  if (isMobile) {
    return <div className={css.mobile_wrapper}>{body}</div>;
  }

  return (
    <ContentPane className={css.transactions} paneClass={css.pane}>
      {body}
    </ContentPane>
  );
}
