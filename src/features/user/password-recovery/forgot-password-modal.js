import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  setForgotPasswordModalState,
  setConfirmCodeModalState,
  setSaveRequestCodeData,
  setTimer,
  setType,
  setTerget,
} from "../../../app/app.slice";
import {
  validateEmail,
  validatePhoneNumbers,
  validatePhoneNumbersLength,
} from "../../../utils/validation";

import Input from "../../../components/form3/input";
import Button from "../../../components/button/button";
import { useRequestCodeRestoreMutation } from "../../../app/api/user.api";
import Modal from "../../../components/modal/modal";
import icon_email from "../../../images/email_modal_recovery.png";

import css from "./style.module.css";
import classNames from "classnames";

export function ForgotPasswordModal() {
  const [type, setTypeModal] = useState();
  const [login, setLoginModal] = useState();
  const [error, setError] = useState();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [requestCode, { data, isLoading, error: queryError }] =
    useRequestCodeRestoreMutation();

  const forgotModalPasswordIsOpen = useSelector(
    (state) => state.app.forgotPasswordIsOpen
  );

  useEffect(() => {
    if (data) {
      const timestamp = new Date().getTime();
      localStorage.setItem("__respass", timestamp);
      localStorage.setItem("__respass_type", type);
      localStorage.setItem("__respass_target", login);
      dispatch(setTimer(timestamp));
      dispatch(setType(type));
      dispatch(setTerget(login));
      dispatch(setSaveRequestCodeData(data));
      dispatch(setForgotPasswordModalState(false));
      dispatch(setConfirmCodeModalState(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (queryError && queryError.status === 404) {
      toast(queryError.data.message, {
        theme: "dark",
        type: "error",
      });
    }
    if (queryError && queryError.status === 403) {
      toast(queryError.data.message, {
        theme: "dark",
        type: "error",
      });
    }
  }, [queryError]);

  const isValid = (value) => {
    if (validateEmail(value)) {
      setTypeModal("email");
      return true;
    }

    if (validatePhoneNumbers(value) && validatePhoneNumbersLength(value)) {
      setTypeModal("phone");
      return true;
    }
    return false;
  };

  return (
    <Modal
      isOpen={forgotModalPasswordIsOpen}
      closeModal={() => {
        dispatch(setForgotPasswordModalState(false));
      }}
      modalClassName={css.modal}
      theme="fogot"
    >
      <div className={classNames(css.body, css.fogot)}>
        <div className={css.block_title}>
          <img src={icon_email} alt="" />
          <div className={css.title}>{t("password recovery")}</div>
        </div>
        <div className={css.form}>
          <div className={css.text}>{t("enter phone & mail")}</div>
          <Input
            placeholder={t("Phone or email")}
            onBlur={(e) => setError(!isValid(e.target.value))}
            autoComplete={"username"}
            onChange={(val) => {
              setError(null);
              setLoginModal(val);
              const isEmail = validateEmail(val);
              const isPhone = validatePhoneNumbers(val);
              const newType = isEmail ? "email" : isPhone ? "phone" : null;
              setTypeModal(newType);
            }}
            className={css.input}
            value={login}
            name={"login"}
            error={error}
          />
        </div>
        <div className={css.btn}>
          <Button
            onClick={() => {
              if (isValid(login)) {
                requestCode({ [type]: login });
              } else {
                if (!isValid(login)) {
                  setError(true);
                }
              }
            }}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {t("Confirm")}
          </Button>
          <Button
            onClick={() => {
              dispatch(setForgotPasswordModalState(false));
            }}
            variant="violet"
          >
            {t("Cancel")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
