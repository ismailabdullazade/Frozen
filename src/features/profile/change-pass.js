import css from "./safety.module.css";
import { useTranslation } from "react-i18next";
import Input from "../../components/form3/input";
import Button from "../../components/button/button";
import security from "../../images/profile/security.svg";
import React, { useEffect, useState } from "react";
import {
  useChangePasswordMutation,
  useRequestCodeMutation,
} from "../../app/api/user.api";
import { useAuth } from "../../services/auth";
import { toast } from "react-toastify";
import Modal from "../../components/modal/modal";
import classNames from "classnames";
import Ricib from "../../components/ricib/ricib";
import phone from "./../../images/profile/phone_call_img.svg";
import email from "./../../images/profile/mail_envelope_img.svg";


import bottom_line from "../../images/profile/bottom_line.svg";
// import Timer from "../../components/timer/timer";
// import {resetTimerByID, setTime, setTimer} from "../../components/timer/timer.slice";
// import {useDispatch} from "react-redux";

import key_change_svg from "../../images/profile/key_pwd_safety.svg"

export default function ChangePass() {
  const { t } = useTranslation();
  const [newPass, setNewPass] = useState("");
  const [checkNewPass, setCheckNewPass] = useState("");
  const [changePass, { data, isLoading: passwordIsSaving, error }] =
    useChangePasswordMutation();
  const [
    requestCode,
    { data: requestCodeData, isLoading: isRequesting, error: requestCodeError },
  ] = useRequestCodeMutation();
  const auth = useAuth();
  const [requestCodeIsSent, setRequestCodeIsSent] = useState();
  const [code, setCode] = useState();
  const [timer, setTimer] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [mailDevice, setMailDevice] = useState(true);

  useEffect(() => {
    const savedTimer = localStorage.getItem(`__chpass_${auth?.user?.id}`);

    if (savedTimer) {
      const now = new Date().getTime();

      if (now - savedTimer > 180000) {
        localStorage.removeItem(`__chpass_${auth?.user?.id}`);
      } else {
        setTimer(180 - Math.ceil((now - savedTimer) / 1000));
      }
    }
    // eslint-disable-next-line
  }, [localStorage]);

  useEffect(() => {
    if (timer) {
      let delay;
      if (timer > 0) {
        delay = setTimeout(() => {
          setTimer(timer - 1);
        }, 1000);
      } else {
        setTimer(null);
        localStorage.removeItem(`__chpass_${auth?.user?.id}`);
      }

      return () => clearTimeout(delay);
    }
    // eslint-disable-next-line
  }, [timer]);

  const onSubmit = () => {
    if (!timer) {
      localStorage.setItem(`__chpass_${auth?.user?.id}`, new Date().getTime());
      setTimer(180);
      requestCode();
    } else if (requestCodeData) {
      setRequestCodeIsSent(requestCodeData);
    }
  };

  useEffect(() => {
    if (requestCodeData) {
      setRequestCodeIsSent(requestCodeData);
    }
    if (requestCodeError) {
      //   const notify = () =>
      //     toast(t("Something went wrong :-("), {
      //       theme: "dark",
      //       type: "error",
      //     });
      //   notify();
      setRequestCodeIsSent(null);
    }
    // eslint-disable-next-line
  }, [requestCodeData, requestCodeError]);

  useEffect(() => {
    if (data) {
      localStorage.setItem("access_token", data.token.access_token);
      auth.setUser(data);
      const notify = () =>
        toast(t("successfully saved"), {
          theme: "dark",
          type: "success",
        });
      notify();
      setRequestCodeIsSent(null);

      setCode(null);
      setNewPass("");
    } else if (error) {
      //   const notify = () =>
      //     toast(t("Something went wrong :-("), {
      //       theme: "dark",
      //       type: "error",
      //     });
      //   notify();
    }
    // eslint-disable-next-line
  }, [data, error]);

  useEffect(() => {
    requestCodeIsSent && requestCodeIsSent.type === "email"
      ? setMailDevice(true)
      : setMailDevice(false);
  }, [requestCodeIsSent]);

  useEffect(() => {
    if (data) {
      setCheckNewPass("");
    }
  }, [data]);

  return (
    <div className={css.change}>
      <div className={css.container_for_mobile}>
        <img className={css.key_change_pwd_img_mobile} src={key_change_svg} alt="change_password_key"/>
        <h2>{t("New password")}</h2>
      </div>
      <div className={css.change_container}>
        
        <div className={css.change_pwd_container}>
          <img className={css.key_change_pwd_img} src={key_change_svg} alt="change_password_key"/>
          <div className={css.new_pwd_inputs}>
            <p>{t("New password")}</p>
            <Input
                className={classNames(css.input, css.input_bg)}
                value={newPass}
                placeholder="Введите пароль"
                type={"password"}
                onChange={setNewPass}
                passwordVisibleFirst={true}
                // label={t("New password")}
              />
              {/* <Input
                placeholder={t("Password")}
                className={classNames(css.input, css.input_bg)}
                type="password"
                label={t("New password")}
                variant={"profile"}
                // autoComplete={"new-password"}

              /> */}
              <p>{t("repeat new password")}</p>
              <Input
                className={classNames(css.input, css.input_bg)}
                value={checkNewPass}
                placeholder="Введите пароль"
                type={"password"}
                onChange={setCheckNewPass}
                passwordVisibleFirst={true}
                // label={t("repeat new password")}
                onBlur={() => {
                  if (newPass !== checkNewPass) {
                    setPasswordMatch(false);
                  } else {
                    setPasswordMatch(true);
                  }
                }}
                error={!passwordMatch}
              />
          </div>

        </div>
        <Button
          className={css.submit_btn_change}
          onClick={onSubmit}
          isLoading={isRequesting && !requestCodeIsSent}
          disabled={
            newPass.length < 8 ||
            newPass.length > 32 ||
            !passwordMatch ||
            (timer && !requestCodeData)
          }
          variant={"gold"}
        >
          {t("Confirm")}
          {timer && !requestCodeData ? ` (${timer})` : ""}
        </Button>
      </div>
      <div>
        <img className={css.bottom_line_security} src={bottom_line} alt="bottom_line" />
      </div>
      {/*Окно ввода кода*/}
      <Modal
        isOpen={requestCodeIsSent}
        closeModal={() => setRequestCodeIsSent(null)}
        theme={"recovery"}
      >
        <div className={classNames(css.body, { [css.phone]: !mailDevice })}>
          <div className={css.modal_title_container}>
            <img src={mailDevice ? email : phone} alt="" />
            <span className={css.body_title}>
              {t("change password (modal title)")}
            </span>

          </div>
          <div className={css.body_device}>
            {t(mailDevice ? "check your mail" : "Waiting for a call")}
          </div>
          {
            <div className={css.body_text}>
              {t(
                mailDevice
                  ? "To confirm the operation, enter the code sent to your e-mail. Please enter a code."
                  : "To the number you specified\nphone will receive a call. Answer to\nit is not needed. To confirm the operation, enter the last 4 digits of the incoming number."
              )}
            </div>
          }
          <div className={css.body_confirm}>
            <Ricib
              length={mailDevice ? 6 : 4}
              onComplete={(e) => setCode(e)}
              advInputClass={css.ricib}
            />
            <span className={css.timer}>
              {timer ? (
                <>
                  {mailDevice
                    ? t("Resend again in ")
                    : t("Recall available in ")}
                  {timer} {t("sec")}
                </>
              ) : (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    requestCode();
                    localStorage.setItem(
                      `__chpass_${auth?.user?.id}`,
                      new Date().getTime()
                    );
                    setTimer(180);
                  }}
                >
                  {mailDevice ? t("Send again") : t("Call available")}
                </span>
              )}
            </span>
          </div>
          <div className={css.btn_container}>
            <Button
              className={css.modal_btn_confirm}
              onClick={() => {
                changePass({
                  password: newPass,
                  code,
                  password_confirmation: newPass,
                });
              }}
              isLoading={passwordIsSaving}
            >
              {t("Confirm")}
            </Button>
            <Button
              className={css.modal_btn_cancel}
              onClick={() => setRequestCodeIsSent(null)}
              variant={"violet"}
              disabled={passwordIsSaving}
            >
              {t("Cancel-2")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
