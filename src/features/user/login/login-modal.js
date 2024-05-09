import { useHistory, useLocation } from "react-router-dom";
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import css from "./login-modal.module.css";
import Input from "../../../components/form3/input";
import Button from "../../../components/button/button";
import {
  checkLogin,
  validateEmail,
  validatePhoneNumbers,
} from "../../../utils/validation";
import {
  setLoginModalState,
  setRegistrationModalState,
  setForgotPasswordModalState,
  setFormLoginCaptchaV2,
  setOpenRecaptchaModalV2, setRedirectAfterLogin, setLoginCloseCallback,
} from "../../../app/app.slice";
import SingUpComponent from "../signup/singup-component";
import close_isTouch from "./../../../images/close_modal_touch.svg";
import { useMediaQuery } from "beautiful-react-hooks";

export default function LoginModal({ auth }) {
  const history = useHistory();
  let location = useLocation();
  const [formLogin, setFormLogin] = useState({
    login: "",
    password: "",
    rememberMe: false,
  });
  const [errorsLogin, setErrorLogin] = useState({});
  const redirectAfterLogin = useSelector((state) => state.app.redirectAfterLogin);
  const onCloseCallback = useSelector((state) => state.app.loginCloseCallback);
  let { from } = location.state || redirectAfterLogin || { from: { pathname: "/" } };
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isTablet = useMediaQuery("(max-width: 1280px)");

  const siteKey =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_SITE_KEY_DEV
      : process.env.REACT_APP_SITE_KEY;

  const loginForm = useSelector((state) => state.app.loginIsOpen);
  const registrationForm = useSelector((state) => state.app.registrationIsOpen);

  const handleKeyDown = (event) => {
    if (event.code === "Enter") {
      login();
    }
  };

  const isValid = () => {
    setErrorLogin({});
    let errorsLogin = {};
    if (!formLogin.login || formLogin.login.length === 0) {
      errorsLogin.login = t("Required field");
    }
    if (!formLogin.password || formLogin.password.length === 0) {
      errorsLogin.password = t("Required field");
    }

    if (checkLogin(formLogin.login).login) {
      errorsLogin.login = t("Required field");
    }

    setErrorLogin(errorsLogin);

    return Object.keys(errorsLogin).length === 0;
  };

  const login = () => {
    if (isValid() && !errorsLogin.login && !errorsLogin.password) {
      if (
        validatePhoneNumbers(formLogin.login.replace(/[\n\s\t]+/g, "")) &&
        formLogin.login.replace(/[\n\s\t]+/g, "").replace("+", "").length > 7 &&
        formLogin.login.replace(/[\n\s\t]+/g, "").replace("+", "").length < 14
      ) {
        formLogin.phone = formLogin.login;
      } else if (validateEmail(formLogin.login)) {
        formLogin.email = formLogin.login;
      }

      auth.signin(formLogin);
      history.replace(from);
      dispatch(setRedirectAfterLogin(null));

      // window.grecaptcha.ready(() => {
      //   window.grecaptcha
      //     .execute(siteKey, { action: "login" })
      //     .then((token) => {
      //       const formLoginForModal = { ...formLogin };
      //       dispatch(setFormLoginCaptchaV2(formLoginForModal));
      //       formLogin["g-recaptcha-response"] = token;
      //       if (token === null) {
      //         dispatch(setOpenRecaptchaModalV2(true));
      //       } else {
      //         auth.signin(formLogin);
      //         history.replace(from);
      //       }
      //     });
      // });
    }
  };

  useLayoutEffect(() => {
    // splash.close(1000);
    window.closeSplash(100);
  }, []);

  return (
    <>
      <div aria-controls={css.wraper_log}>
        <div className={css.login}>
          {registrationForm ? (
            <div className={css.login_title}>{t("Registration")}</div>
          ) : (
            <div className={css.login_title}>{t("entrance")}</div>
          )}
          {isTablet && (
            <div
              onClick={() => {
                dispatch(setLoginModalState(false));
                dispatch(setRegistrationModalState(false));
                if (onCloseCallback) {
                  onCloseCallback()
                  dispatch(setLoginCloseCallback(null))
                }
              }}
              className={css.close_modal}
            >
              <img src={close_isTouch} alt="" />
            </div>
          )}
          <div className={css.wraper_form}>
            <div
              className={classNames(
                loginForm ? css.form_login : css.form_login__none
              )}
            >
              <div className={css.wraper_form__title}>{t("phone/Email")}</div>
              <Input
                placeholder={t("enter phone/Email")}
                onBlur={(e) => {
                  const value = e.target.value;
                  const validationResult = checkLogin(value);
                  const errors = {};

                  for (let key in validationResult) {
                    if (validationResult[key]) {
                      errors[key] = validationResult[key];
                    }
                  }

                  setErrorLogin(errors);
                }}
                autoComplete={"username"}
                onChange={(val) => {
                  const sanitizedValue = val.replace(/\s+/g, "");
                  const onlyNum = sanitizedValue.replace(/\+/g, "");
                  const isNumeric = /^\d+$/.test(onlyNum);
                  const plus = /^\+/.test(sanitizedValue);

                  if (isNumeric && sanitizedValue.length > 11) {
                    if (plus) {
                      val = sanitizedValue.slice(0, 12);
                    } else {
                      val = sanitizedValue.slice(0, 11);
                    }
                  } else {
                    val = sanitizedValue;
                  }

                  setFormLogin({ ...formLogin, login: val });
                }}
                className={classNames(css.input, css.input_bg)}
                value={formLogin.login}
                name={"username"}
                error={errorsLogin.login}
              />
              <div className={css.wraper_form__title}>{t("Password")}</div>
              <Input
                placeholder={t("Password")}
                className={classNames(css.input, css.input_bg)}
                type="password"
                value={formLogin.password}
                // autoComplete={"new-password"}
                error={errorsLogin.password}
                onChange={(val) =>
                  setFormLogin({ ...formLogin, password: val })
                }
                onKeyDown={handleKeyDown}
              />
              <div className={css.bottom}>
                <div
                  className={css.forgot_pass}
                  onClick={() => {
                    dispatch(setLoginModalState(false));
                    dispatch(setForgotPasswordModalState(true));
                  }}
                >
                  {t("Forgot password?")}
                </div>
                <Button
                  onClick={login}
                  variant={"violet"}
                  className={classNames(
                    css.login_button,
                    css.login_button__border
                  )}
                  isLoading={auth?.isLoading}
                  data-sitekey="reCAPTCHA_site_key"
                  data-callback="onSubmit"
                  data-action="submit"
                >
                  {auth?.isLoading ? t("Log in") : t("Sign in")}
                </Button>
                <div className={css.bottom_choice}>
                  {t("phone &&")} &nbsp;
                  <div
                    onClick={() => {
                      dispatch(setLoginModalState(false));
                      dispatch(setRegistrationModalState(true));
                    }}
                    className={css.bottom_choice__active}
                  >
                    {t("register")}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                registrationForm ? css.form_reg : css.form_reg__none
              )}
            >
              <SingUpComponent auth={auth} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
