import css from "./safety.module.css";
import { useTranslation } from "react-i18next";
import Button from "../../components/button/button";
import {useEffect, useState} from "react";
import classNames from "classnames";
import Input from "../../components/form3/input";
import ToogleSwitchWithLabel from "../../components/toggle-switch/toogle-switch-with-label";
import tow_fa_img from "./../../images/profile/tow_fa.svg"
import twofa_lock_img from "../../images/profile/lock_security.svg"
import bottom_line from "../../images/profile/bottom_line.svg";
import lock_auth from "../../images/profile/lock_auth_img.svg"
import copy_btn from "../../images/profile/copy_btn_svg.svg";

import { useAuth } from "../../services/auth";
import { useSwitch2FaWithdrawMutation, useGetQRMutation, useSwitch2FaMutation } from "../../app/api/user.api";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import Ricib from "../../components/ricib/ricib";
import Modal from "../../components/modal/modal";

export default function TwoFactorAuthentication() {
  const { t } = useTranslation();
  const [openQRCodeBlock, setOpenQRCodeBlock] = useState(false);
  const auth = useAuth();
  const [otp, setOtp] = useState("")
  const google2fa_enable = auth?.user.google2fa_enable;
  const google2fa_enable_withdraw = auth?.user.google2fa_enable_withdraw;
  const [getQR, {data: qr, isLoading: qrFething, error: qrError, reset}] = useGetQRMutation()
  const [switch2fa, {data: twoFa, isLoading, error}] = useSwitch2FaMutation()
  const [switch2faWithDraw, {data: twoFaWithdraw, isLoading: isLoadingWithdraw, error2}] = useSwitch2FaWithdrawMutation()
  const dispatch = useDispatch()

  const [showConfirm, setShowConfirm] = useState(false);

  const [showText, setShowText] = useState(true);




  useEffect(() => {
    if (!google2fa_enable && openQRCodeBlock && !qr) {
      getQR()
    }
  }, [google2fa_enable, openQRCodeBlock]);

  useEffect(() => {
    if (twoFa) {
      auth.setUser(twoFa)
      if (!twoFa.google2fa_enable) {
        console.log("forced cache drop");
        dispatch({
          type: "UserApi/invalidateTags",
          payload: ["QR"],
        })
        reset()
        setOtp("")
        setOpenQRCodeBlock(false)
      }
    }
  }, [twoFa]);

  useEffect(() => {
    if (twoFaWithdraw) {
      auth.setUser(twoFaWithdraw)
    }
  }, [twoFaWithdraw]);

  useEffect(() => {
    if (error || error2 || qrError) {
      let text = t("Sorry, unknown error... Please try later")

      if (error?.status === 403) {
        text = t("Invalide code")
      }
      const notify = () => toast(text, {
        theme: "dark",
        type: "error"
      });
      notify();
    }
  }, [error, error2, qrError])

  return (
    <div className={css.twofa}>
      <div className={css.container_for_mobile}>
        <img src={twofa_lock_img} className={css.twoda_img_mobile} alt="twofa_img" />
        <h2>{t("connect 2fa")}</h2>
      </div>

      <div className={css.container_2fa_security}>

        <div className={css.container_2fa_img_title}>
          <img src={twofa_lock_img} className={css.twoda_img} alt="" />
          {
          showText && (
            <div className={classNames(css.twofa_connect, {[css.hidden]: qr || google2fa_enable})}>
              <p>Как подключить 2FA?</p>
              <p className={css.twofa_connect__text}>{t("2fa connect text")}</p>
            </div>

          )
        }
          <div className={classNames(css.twofa_qrblock, {[css.hidden]: !qr || google2fa_enable})}>
            {/* <span className={css.twofa_qrblock__text}>{t("scan qr the code 2fa")}</span> */}
            {
              qr && <div className={css.qrcode_generation}>
                <div className={css.qr_code_svg} dangerouslySetInnerHTML={{__html: qr.qr}}/>
                <div className={css.qrcode_generation__block}>
                  <p className={css.qrcode_generation__text}>{t("or paste the code into the application:")}</p>
                  <div className={css.qr_code_input_copy}>
                    <Input
                    style={{color:"#FA00FF !important"}}
                    disabled={true}
                    className={css.qrcode_generation__code}
                    value={qr.code??t("coming soon")}
                    />
                    <img className={css.copy_btn} src={copy_btn} alt="copy_btn"/>
                  </div>
                  {/* <span
                    onClick={() => {
                      // if (qr.code) {
                      //   navigator.clipboard.writeText(qr.code).then(function() {
                      //     alert('Async: Copying to clipboard was successful!');
                      //   }, function(err) {
                      //     alert('Async: Could not copy text: ');
                      //   });
                      // }
                    }}
                    className={css.qrcode_generation__code}
                  >
                    {qr.code??t("coming soon")}
                  </span> */}
                  <p>{t("enter code")}</p>
                  <Input
                    onKeyDown={event => {
                      if (event.code === "Enter") {
                        switch2fa({one_time_password: otp})//Подключаем 2фа
                      }
                    }}
                    className={css.item}
                    value={otp}
                    onChange={value => setOtp(value)}
                    variant="profile"
                  />
                </div>
              </div>
            }
        </div>

        </div>

        <Button
          className={css.submit_btn_2fa}
          onClick={() => {
            setShowText(false)
            if (google2fa_enable) {
              //отправляя запрос /user/2fa автоматом отрубается запрос на вывод
              switch2fa()
            } else {
              if (openQRCodeBlock) {
                //если google2fa отключена, можно отправить запрос на подключение
                switch2fa({one_time_password: otp})//Подключаем 2фа
              } else {
                //если google2fa отключена и юзер еще не сформировал код
                setOpenQRCodeBlock(true)
              }
            }
          }}
          variant={google2fa_enable ? "blue" : "gold"}
          isLoading={isLoading || qrFething || isLoadingWithdraw}
          disabled={!google2fa_enable && !otp && openQRCodeBlock}
        >
          {t(google2fa_enable ? "disable" : (openQRCodeBlock ? "Confirm" : "Connect"))}
        </Button>
        {/* <Button className={css.submit_btn_restraint} onClick={() => setShowConfirm(true)} isLoading={isLoading}>
          {t("to plug")}
        </Button> */}
      </div>
      
      <div>
        <img className={css.bottom_line_security} src={bottom_line} alt="bottom_line" />
      </div>

      {/* {showConfirm && (
        <Modal
          isOpen={showConfirm}
          closeModal={() => setShowConfirm(false)}
          className={css.modal}
          theme={"recovery"}
        >
          <div className={css.body}>
            <div className={css.modal_title_container}>
              <img src={lock_auth} alt="two_factor_svg" />
              <span className={css.body_title}>
              {t("verification")}
            </span>
            </div>

            <div className={css.body_text}>
              <span>{t("authentication text")}</span>
            </div>

            <Ricib
              length="6"
              advInputClass={css.ricib}
            />
            <div
              className={classNames(
                css.btn_container,
                css.btn_container__width,
              )}
            >
              <Button className={css.modal_btn_confirm}>{t("Confirm")}</Button>
              <Button
              className={css.modal_btn_cancel}
              variant={"violet"}
                onClick={() => {
                  setShowConfirm(false);
                }}
              >
                {t("Cancel")}
              </Button>
            </div>
          </div>
        </Modal>
      )} */}
      {/* START: Состояние 1*/}
      {/* QR не сгенерирован, 2FA не подключено */}

      {/* END: Состояние 1*/}

      {/* START: Состояние 2*/}
      {/* QR сгенерирован, 2FA не подключено */}


      {/* START: Состояние 3*/}

      {/* START: Состояние 3*/}
      {/* QR сгенерирован, но уже не отображается, 2FA подключено */}

      {/* <div className={classNames(css.towfa_done, {[css.hidden]: !google2fa_enable })}>
        <span className={css.twofa_done___text}>{t("connected")}</span>
        <div className={css.towfa_done__blcok}>
          <span className={css.done__blcok__text}>{t("account login protection")}</span>
          <ToogleSwitchWithLabel checked={true} disabled/>
        </div>
        <div className={css.towfa_done__blcok}>
          <span className={css.done__blcok__text}>{t("withdrawal protection")}</span>
          <ToogleSwitchWithLabel
            disabled={isLoadingWithdraw}
            checked={google2fa_enable_withdraw}
            setValue={(value) => switch2faWithDraw()}
          />
        </div>
      </div> */}
      {/* END: Состояние 3*/}

    </div>
  )
}