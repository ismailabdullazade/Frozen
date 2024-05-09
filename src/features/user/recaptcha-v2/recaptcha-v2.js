import { useTranslation } from "react-i18next";
import css from "./recaptcha-v2.module.css";
import Modal from "../../../components/modal/modal";
import { useDispatch, useSelector } from "react-redux";
import { setOpenRecaptchaModalV2 } from "../../../app/app.slice";
import Button from "../../../components/button/button";
import shield from "./../../../images/shield_password.svg";
import ReCAPTCHA from "react-google-recaptcha";
import { useMediaQuery } from "beautiful-react-hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";

export default function RecaptchaModal({ auth }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const openRecaptchaModalV2 = useSelector(
    (state) => state.app.openRecaptchaModalV2
  );
  const siteKey =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_SITE_KEY_DEV
      : process.env.REACT_APP_SITE_KEY;
  const siteKeyV2 =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_SITE_KEY_DEV
      : process.env.REACT_APP_SITE_KEY_V2;

  const formLogin = useSelector((state) => state.app.formLoginCaptchaV2);
  const formLoginModal = { ...formLogin };

  const isMobile = useMediaQuery("(max-width: 960px)");
  const [tokenCaptcha, setTokenCaptcha] = useState(null);

  const handleRecaptchaChange = (value) => {
    setTokenCaptcha(value);
  };

  const handleSubmit = (event) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action: "login" }).then((token) => {
        formLoginModal["g-recaptcha-response"] = token;
        formLoginModal["g-recaptcha-v2-response"] = tokenCaptcha;
        auth.signin(formLoginModal, (error) => {
          if (error && error.status === 412) {
            toast(t("recaptcha error"), {
              theme: "dark",
              type: "error",
            });
            dispatch(setOpenRecaptchaModalV2(true));
          } else if (error === null || error === undefined) {
            history.replace(from);
            dispatch(setOpenRecaptchaModalV2(false));
          } else {
            console.error("Unexpected error during sign-in:", error);
            toast("Unexpected error occurred", {
              theme: "dark",
              type: "error",
            });
          }
        });
      });
    });
  };

  return (
    <Modal
      isOpen={openRecaptchaModalV2}
      closeModal={() => {
        dispatch(setOpenRecaptchaModalV2(false));
      }}
      theme={"recapcha"}
      modalClassName={css.modal}
    >
      <div className={css.wraper}>
        <form action="?" method="POST" onSubmit={handleSubmit}>
          <h1 className={css.wraper_title}>{t("security check")}</h1>
          <img src={shield} alt="" />
          <ReCAPTCHA
            sitekey={siteKeyV2}
            theme="dark"
            size={isMobile ? "compact" : "normal"}
            className={css.recaptcha_style}
            onChange={handleRecaptchaChange}
          />
          <div className={css.wraper_buttonBlock}>
            <Button onClick={handleSubmit} variant={"gold"}>
              {t("Confirm")}
            </Button>
            <Button
              onClick={() => {
                dispatch(setOpenRecaptchaModalV2(false));
              }}
              variant={"blue"}
            >
              {t("Cancel")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
