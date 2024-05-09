import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  setConfirmCodeModalState,
  setResetPasswordModalState,
  setTimer,
  setTerget,
  setType,
  setForgotPasswordModalState,
} from "../../../app/app.slice";

import Button from "../../../components/button/button";
import Ricib from "../../../components/ricib/ricib";
import { setCode } from "../../../app/app.slice";
import email from "../../../images/contact_email.svg";
import phone from "../../../images/contact_tg.svg";
import {
  useCheckPasswordRestoreMutation,
  useRequestCodeRestoreMutation,
} from "../../../app/api/user.api";
import Modal from "../../../components/modal/modal";

import css from "./style.module.css";
import classNames from "classnames";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

import phone_recovery from "./../../../images/phone_modal_recovery.svg";
import email_recovery from "./../../../images/email_modal_recovery.svg";
import { useMediaQuery } from "beautiful-react-hooks";

const TIMER = 180;
const images = {
  email,
  phone,
};

export function ConfirmCodeModal() {
  const timerFogotModal = useSelector((state) => state.app.timer);
  const [timer, setTimerConfirm] = useState();
  const target = useSelector((state) => state.app.target);
  const type = useSelector((state) => state.app.type);
  const code = useSelector((state) => state.app.code);
  const isMobile = useMediaQuery("(max-width: 960px)");
  const saveRequestCodeData = useSelector(
    (state) => state.app.saveRequestCodeData
  );
  const { t } = useTranslation();
  const [
    requestCode,
    {
      data: requestCodeData,
      isLoading: requestCodeSending,
      error: requestCodeError,
    },
  ] = useRequestCodeRestoreMutation();
  const clearStorage = () => {
    localStorage.removeItem(`__respass`);
    localStorage.removeItem(`__respass_type`);
    localStorage.removeItem(`__respass_target`);
    dispatch(setTimer(null));
    dispatch(setType(""));
    dispatch(setTerget(""));
  };
  const returnBackward = () => {
    clearStorage();
    dispatch(setConfirmCodeModalState(false));
    dispatch(setForgotPasswordModalState(true));
  };
  const dispatch = useDispatch();
  const [checkCode, { data, isLoading: isChecking, error }] =
    useCheckPasswordRestoreMutation();

  const confirmCodeModalIsOpen = useSelector(
    (state) => state.app.confirmCodeModalIsOpen
  );

  useEffect(() => {
    setTimerConfirm(timerFogotModal);
  }, [timerFogotModal]);

  useEffect(() => {
    if (error && error.status === 404) {
      const notify = () =>
        toast(error.data.message, {
          theme: "dark",
          type: "error",
        });
      notify();
    } else if (data?.success) {
      dispatch(setConfirmCodeModalState(false));
      dispatch(setResetPasswordModalState(true));
    }
  }, [error, data]);

  // useEffect(() => {
  //   if (error && error.status === 422) {
  //     const notify = () =>
  //       toast(error.data.message, {
  //         theme: "dark",
  //         type: "error",
  //       });
  //     notify();
  //   }
  // }, [error]);

  useEffect(() => {
    if (data) {
      localStorage.removeItem(`__respass`);
      dispatch(setTimer(null));
    }
  }, [data]);

  useEffect(() => {
    if (requestCodeData) {
      setTimerConfirm(TIMER);
      dispatch(setTimer(new Date().getTime()));
    }
  }, [requestCodeData, saveRequestCodeData]);

  useEffect(() => {
    if (requestCodeError) {
      returnBackward();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestCodeError]);

  useEffect(() => {
    if (timer) {
      let delay;
      if (timer > 0) {
        delay = setTimeout(() => {
          setTimerConfirm(timer - 1);
        }, 1000);
      } else {
        setTimerConfirm(null);
        dispatch(setTimer(null));
      }

      return () => clearTimeout(delay);
    }
  }, [timer]);

  useEffect(() => {
    const savedTimer = timerFogotModal;

    if (savedTimer) {
      const now = new Date().getTime();

      if (now - savedTimer > TIMER * 1000) {
        returnBackward();
      } else {
        setTimerConfirm(
          (prevTimer) => TIMER - Math.ceil((now - prevTimer) / 1000)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerFogotModal]);

  function DescriptionPhone() {
    return (
      <>
        <span>{t("confirm description phone")}</span>
        <NavLink
          className={css.confirm_description_link}
          to={{ pathname: "https://t.me/gc_recovery_bot" }}
          target={"_blank"}
        >
          {t("tg bot")}
        </NavLink>
      </>
    );
  }

  return (
    <Modal
      isOpen={confirmCodeModalIsOpen}
      closeModal={() => {
        dispatch(setConfirmCodeModalState(false));
      }}
      modalClassName={css.modal}
      theme={type === "phone" ? "recovery_phone" : "recovery"}
    >
      <div className={classNames(css.body, { [css.phone]: type === "phone" })}>
        <div className={css.block_title}>
          <img
            src={type === "phone" ? phone_recovery : email_recovery}
            alt=""
          />
          <div className={css.title}>
            {isMobile ? t("verification") : t("change Password")}
          </div>
        </div>
        <div
          className={classNames(
            css.confirm_code,
            type === "phone" ? css.confirm_code__phone : css.confirm_code__email
          )}
        >
          <div className={css.title_confirm}>
            {type === "phone" ? "" : t("Check your mail")}
          </div>
          <div
            className={classNames(css.confirm_description, {
              [css.confirm_description__top]: type === "phone",
            })}
          >
            {type === "phone" ? <DescriptionPhone /> : t("confirm description")}
          </div>
          <div className={css.wraper_code}>
            <Ricib
              length={type === "phone" ? 4 : 6}
              onComplete={(e) => dispatch(setCode(e))}
              advInputClass={css.ricib}
            />
            <span
              onClick={(e) => {
                if (!timer && target && type && !requestCodeSending) {
                  requestCode({ [type]: target });
                }
              }}
              className={css.forgot_pass}
            >
              {timer ? (
                <>
                  {type === "email"
                    ? `${t("Resend again in ")} ${timer} ${t("sec")}`
                    : ""}
                </>
              ) : (
                <>{type === "email" ? t("Send again") : ""}</>
              )}
            </span>
          </div>
        </div>
        <div className={css.btn_confirm}>
          <Button
            onClick={() => {
              checkCode({ code, [type]: target });
            }}
            isLoading={isChecking}
            disabled={isChecking}
          >
            {t("Confirm")}
          </Button>
          <Button
            onClick={() => {
              dispatch(setConfirmCodeModalState(false));
            }}
            variant="blue"
          >
            {t("Cancel-2")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
