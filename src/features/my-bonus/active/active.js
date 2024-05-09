import css from "./active.module.css";
import style from "../my-bonus.module.css";
import InnerPane from "../../../components/inner-pane/inner-pane";
import Button from "../../../components/button/button";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import ProgressBar from "./progress/active-bonus.progress";
import { useGetActiveBonusQuery } from "../../../app/api/bonus.api";
import Loader from "../../../components/loader/Loader";
import errImg from "../../../images/error.png";
import { loadBaseUrl } from "../../../app/api/api.config";
import classNames from "classnames";
import { Link } from "react-router-dom";
import CancelBonus from "../cancel-bonus/cancel-bonus";
import { useMediaQuery } from "beautiful-react-hooks";
import { isFreeDepBonus } from "../../../utils/bonus-helpers";
import FreespinGame from "./freespin-game/active-bonus.freespin-game";
import DescriptionBonus from "../description-bonus/description-bonus";
import WagerLoader from "../../../components/waiting-for-wager/waiting-for-wager";

const host = loadBaseUrl().split("/")[0];

export default function Active() {
  const { t } = useTranslation();
  const [pollingInterval, setPollingInterval] = useState(0);
  const {
    data: activeBonus,
    isLoading: fetchingActiveBonus,
    error,
  } = useGetActiveBonusQuery({}, { pollingInterval: pollingInterval });
  const [cancelConfirm, setShowConfirm] = useState();
  const [cancelConfirmDep, setShowConfirmDep] = useState();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isBigDesktop = useMediaQuery("(min-width: 1400px)");
  const isFreeDepBonusCheck = useMemo(
    () => isFreeDepBonus(activeBonus),
    [activeBonus]
  );

  const body = (
    <>
      {activeBonus && !error && (
        <div className={css.wrapper}>
          <div className={css.bonus}>
            <div className={css.bonus__logo}>
              <img
                src={`https://${host}/uploads/${activeBonus.image}`}
                alt=""
              />
              <div className={css.bonus__logoBackground} />
            </div>
            {/* {activeBonus?.active_wager?.status === "in_progress" && ( */}
            {(true &&
              <ProgressBar activeBonus={activeBonus} />
            )}
          </div>
          <div className={css.divider} />
          <div className={css.detail}>
            {activeBonus?.active_wager ? (
              <>
                <div className={css.detailContainer}>
                  {isBigDesktop &&
                    (activeBonus?.bonus_slot_type_id === 5 ? (
                      <div className={css.info_title}>
                        {t("Bonus")}
                        &nbsp;
                        {activeBonus?.bonusAmount
                          ? `${activeBonus?.bonusAmount} RUB`
                          : null}
                      </div>
                    ) : (
                      <div className={css.bonus__title}>
                        {t("Bonus")}
                        {activeBonus?.deposit_bonus_percent ? (
                          <>
                            &nbsp;
                            <span className={css.bonus_title__color}>
                              {activeBonus?.deposit_bonus_percent}%
                            </span>
                            &nbsp;
                            {t("to the deposit")}
                          </>
                        ) : null}
                        {activeBonus?.freespin_amount ? (
                          <>
                            <br />
                            <span className={css.bonus_title__color}>
                              {activeBonus?.deposit_bonus_percent ? "+" : ""}{" "}
                              {activeBonus?.freespin_amount}
                            </span>
                            &nbsp; FreeSpin
                          </>
                        ) : null}
                      </div>
                    ))}
                  <FreespinGame activeBonus={activeBonus} />
                  <DescriptionBonus
                    withTitle={!isBigDesktop}
                    bonus={activeBonus}
                    variant={"active_bonus"}
                  />
                </div>
                {activeBonus ? (
                  <div className={css.cancelBlock}>
                    <div className={css.detail__button}>
                      <Button
                        onClick={() => {
                          setShowConfirm(true);
                        }}
                        variant={"blue"}
                      >
                        {t("Cancel")}
                      </Button>
                    </div>
                    <div className={css.detail__sub_info}>
                      {t(
                        "You can cancel this bonus and choose another when making a deposit."
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              <div className={css.wager_loader}>
                <WagerLoader isDepositBonus={!isFreeDepBonusCheck} />
                <Button
                  onClick={() => {
                    setShowConfirmDep(true);
                  }}
                  variant={"blue"}
                >
                  {t("Cancel")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {fetchingActiveBonus && (
        <div className={css.info_container}>
          <Loader />
        </div>
      )}
      {error && error.status !== 412 && (
        <div className={css.info_container}>
          <img src={errImg} alt="" />
        </div>
      )}
      {error?.status === 412 && (
        <div
          className={classNames(
            css.info_container,
            css.direction_column,
            css.empty
          )}
        >
          <span className={css.no_bonus_text}>
            {t("You don't have an active bonus right now")}.
          </span>
          <Link to={"/wallet"}>
            <Button className={css.no_bonus_button} variant={"violet"}>
              {t("top up")}
            </Button>
          </Link>
        </div>
      )}
      <CancelBonus
        cancelConfirm={cancelConfirm}
        cancelConfirmDep={cancelConfirmDep}
        setShowConfirm={setShowConfirm}
        setShowConfirmDep={setShowConfirmDep}
      />
    </>
  );
  const canPolling = useMemo(
    () =>
      activeBonus && !activeBonus.active_wager && isFreeDepBonus(activeBonus),
    [activeBonus]
  );
  useEffect(() => {
    if (canPolling) {
      setPollingInterval(5000);
    } else {
      setPollingInterval(0);
    }
  }, [activeBonus]);

  if (isMobile) {
    return body;
  }

  return (
    <InnerPane className={style.tab_content} paneClass={css.subpane}>
      {body}
    </InnerPane>
  );
}
