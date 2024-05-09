import css from "./twofa-otp.module.css"
import classNames from "classnames";
import shield_2fa from "../../images/profile/shield-2fa.svg";
import Input from "../form3/input";
import Button from "../button/button";
import Modal from "../modal/modal";
import {useTranslation} from "react-i18next";
import {useState} from "react";

export default function TwofaOtp({action: actionCallback, close: closeCallback, isOpen, isLoading, title}) {
  const {t} = useTranslation()
  const [otp, setOtp] = useState("")
  const close = e => {
    setOtp("")
    closeCallback(e)
  }
  const action = otp => {
    actionCallback(otp)
    setOtp("")
  }

  return <Modal
    closeModal={close}
    isOpen={isOpen}
    theme={"safety"}
  >
    <div className={classNames(css.modal_twofa, /*{[css.modal_twofa__verification]: openModalVerification}*/)}>
      <img src={shield_2fa} alt="" />
      <span className={css.modal_twofa__title}>{title}</span>
      <span className={css.modal_twofa__text}>{t("authentication text")}</span>
      <Input
        value={otp}
        onChange={setOtp}
        onKeyDown={event => {
          if (event.code === "Enter") {
            action(otp)
          }
        }}
        variant="profile"
        placeholder={t("enter a code")}
      />
      <div className={css.modal_twofa__btn}>
        <Button
          onClick={() => action(otp)}
          variant="gold"
          isLoading={isLoading}
          disabled={otp?.length !== 6 || isLoading}
        >
          {t("Confirm")}
        </Button>
        <Button
          onClick={close}
          variant="blue"
        >
          {t("Cancel")}
        </Button>
      </div>
    </div>
  </Modal>
}