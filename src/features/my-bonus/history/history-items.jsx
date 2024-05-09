import css from "./history-items.module.css";
import ContentPane from "../../../components/content-pane/content-pane";
import classNames from "classnames";
import moment from "moment/moment";
import React from "react";
import { loadBaseUrl } from "../../../app/api/api.config";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "beautiful-react-hooks";

export default function HistoryItems({ historyItems }) {
  const getStatusName = (alias) => {
    const names = {
      initial: t("Activated"),
      in_progress: t("Activated"),
      win: t("Played"),
      lose: t("Canceled"),
      cancel: t("Canceled"),
    };

    return names[alias] ? names[alias] : "";
  };
  const host = loadBaseUrl().split("/")[0];
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <>
      <div className={css.caption}>
        <span>{t("Bonus")}</span>
        <span>{t("Status")}</span>
        <span>{t("Date and time")}</span>
      </div>
      <div>
        {historyItems &&
          [...historyItems]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((item) => {
              const bonusAmount = new Intl.NumberFormat("ru-RU").format(
                item.bonus_slot?.bonus_amount / 100,
              );
              const depositBonusPercent =
                item.bonus_slot?.deposit_bonus_percent;
              const freeSpins = item.bonus_slot?.freespin_amount;
              const title = () => {
                if (item.bonus_slot?.bonus_slot_type_id === 5) {
                  return (
                    <div className={css.title}>
                      {t("Bonus")}
                      &nbsp;
                      <span>{bonusAmount}&nbsp;RUB</span>
                    </div>
                  );
                } else {
                  return (
                    <div className={css.title}>
                      {depositBonusPercent ? (
                        <div>
                          {t("Bonus")}
                          <span> {depositBonusPercent}% </span>
                          {t("to the deposit")}
                        </div>
                      ) : null}
                      {freeSpins && (
                        <>
                          <span>
                            {depositBonusPercent ? "+" : ""} {freeSpins}
                          </span>
                          &nbsp;FreeSpin
                        </>
                      )}
                    </div>
                  );
                }
              };
              return (
                <ContentPane
                  key={`bets-history-item-${item.id}-${item.wager_id}`}
                  className={css.content_pane}
                  paneClass={css.content}
                >
                  {isMobile ? (
                    <>
                      <img
                        src={`https://${host}/uploads/${item.bonus_slot?.image}`}
                        alt=""
                        className={css.img}
                      />
                      <div className={css.detail}>
                        <div
                          className={classNames(css.status, css[item.status])}
                        >
                          {getStatusName(item.status)}
                        </div>
                        <div className={css.bonus_info}>{title()}</div>
                        <div className={css.date_block}>
                          <span className={css.date}>
                            {moment.utc(item.created_at).format("DD.MM.YYYY")}
                          </span>
                          <br />
                          <span className={css.time}>
                            {moment.utc(item.created_at).format("HH:mm:ss")} GMT
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={css.bonus_info}>
                        <img
                          src={`https://${host}/uploads/${item.bonus_slot?.image}`}
                          className={css.img}
                          alt=""
                        />
                        {title()}
                      </div>
                      <div className={classNames(css.status, css[item.status])}>
                        {getStatusName(item.status)}
                      </div>
                      <div className={css.date_block}>
                        <div>
                          <span className={css.time}>
                            {moment.utc(item.created_at).format("HH:mm:ss")} GMT
                          </span>
                          <br/>
                          <span className={css.date}>
                            {moment.utc(item.created_at).format("DD.MM.YYYY")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </ContentPane>
              );
            })}
      </div>
    </>
  );
}
