import css from "./cancel-bonus.module.css";
import Button from "../../../components/button/button";
import Modal from "../../../components/modal/modal";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useCancelBonusMutation,
  useGetActiveBonusQuery,
} from "../../../app/api/bonus.api";

export default function CancelBonus({
  showConfirm,
  setShowConfirm,
  cancelConfirm,
  setShowConfirmDep,
  cancelConfirmDep,
  withdrawalCancel,
  onCancelSuccess = () => {},
  onCancelError = () => {},
}) {
  const { t } = useTranslation();
  const { data: acceptedBonus } = useGetActiveBonusQuery();
  const [cancelBonus, { data: cancelData, error: cancelError }] =
    useCancelBonusMutation();

  useEffect(() => {
    if (cancelData) {
      onCancelSuccess(cancelData);
    }
  }, [cancelData]);

  useEffect(() => {
    if (cancelError) {
      onCancelError(cancelError);
    }
    // eslint-disable-next-line
  }, [cancelError]);

  return (
    <Modal
      isOpen={
        showConfirm || cancelConfirm || withdrawalCancel || cancelConfirmDep
      }
      closeModal={() => setShowConfirm(false)}
      theme="cancel_bonus"
    >
      <div className={css.error}>
        <div className={css.error_header}>
          <div className={css.error_title}>{t("Bonus")}</div>
        </div>
        {showConfirm && (
          <div className={css.error_text}>
            <span>{t("You already have an active bonus")}</span>
          </div>
        )}
        {cancelConfirm && (
          <div className={css.error_text}>
            <span>{t("Are you sure you want to cancel an active bonus")}?</span>
          </div>
        )}
        {withdrawalCancel && (
          <div className={css.error_text}>
            <span>
              {t(
                "Withdrawal of funds will result in the end of the active bonus"
              )}
              : <b className={css.gold}>{acceptedBonus?.title}</b>
              <br />
              {t("Still want to withdraw funds")}?
            </span>
          </div>
        )}
        {cancelConfirmDep && (
          <div className={css.error_text}>
            <span>{t("the bonus is awaiting deposit")}</span>
          </div>
        )}
        <div className={css.btn_container}>
          <Button
            onClick={() => {
              cancelBonus();
              cancelConfirmDep
                ? setShowConfirmDep(false)
                : setShowConfirm(false);
            }}
          >
            {t("Apply")}
          </Button>
          <Button
            onClick={() =>
              cancelConfirmDep
                ? setShowConfirmDep(false)
                : setShowConfirm(false)
            }
            variant="violet"
            className={css.btn_container__margin}
          >
            {t("Cancel-2")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
