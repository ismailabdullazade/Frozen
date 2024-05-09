import classNames from "classnames";
import css from "./../login/login-modal.module.css";
import style from "./../recaptcha-v2/recaptcha-v2.module.css";
import Input from "../../../components/form3/input";
import Button from "../../../components/button/button";
import Select from "../../../components/form3/select";
import { validateEmail, validatePhoneNumbers } from "../../../utils/validation";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  useGetCountriesQuery,
  useGetCurrenciesQuery,
  useGetRegistrationPermissionQuery,
  useSignupMutation,
} from "../../../app/api/user.api";
import {
  setSingUpPage,
  setRegistrationModalState,
  setLoginModalState,
} from "../../../app/app.slice";
import { useDispatch } from "react-redux";
import Modal from "../../../components/modal/modal";
import ProhibitedCountry from "./prohibited-country/prohibited-country";
import ToogleSwitchWithLabel from "../../../components/toggle-switch/toogle-switch-with-label";
import Switch from "../../../components/switch/switch";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import shield from "./../../../images/shield_password.svg";
import { useMediaQuery } from "beautiful-react-hooks";

export default function SingUpComponent({ auth }) {
  const [formReg, setFormReg] = useState({
    confirm: false,
    key1: "",
    email: "",
    key2: "",
    password: "",
  });
  const { data: currenciesList, error: currenciesError } =
    useGetCurrenciesQuery();
  const [formRegPhone, setFormRegPhone] = useState("");
  const [formRegEmail, setFormRegEmail] = useState("");
  const [errorsReg, setErrorReg] = useState({});
  const { t } = useTranslation();
  const [byPhone, setByPhone] = useState(true);
  const [openRecapchaModal, setOpenRecapchaModal] = useState(false);

  const siteKey =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_SITE_KEY_DEV
      : process.env.REACT_APP_SITE_KEY;
  const siteKeyV2 =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_SITE_KEY_DEV
      : process.env.REACT_APP_SITE_KEY_V2;

  const [byEmail, setByEmail] = useState(false);
  const [register, { data }] = useSignupMutation();
  const dispatch = useDispatch();
  const history = useHistory();

  const isMobile = useMediaQuery("(max-width: 960px)");
  const [tokenCaptcha, setTokenCaptcha] = useState(null);

  const password = useRef();
  const ref = useRef();
  const [disallowModal, showDisallowModal] = useState(false);

  const { data: countriesFetched } = useGetCountriesQuery();
  const countries = countriesFetched
    ? countriesFetched.map((country) => ({
        label: `${country.title}`,
        value: country.id,
        selected: country.id === formReg.country?.value,
      }))
    : [];
  const { data: allowRegistration, error: disallowRegistration } =
    useGetRegistrationPermissionQuery();

  const selectedCountry = countriesFetched?.find(
    (country) => country.id === formReg.country?.value
  );
  const phoneRegistration =
    selectedCountry?.allow_phone_registration && byPhone;

  useEffect(() => {
    if (selectedCountry?.allow_phone_registration === false) {
      setByPhone(false);
      setByEmail(true);
    }
  }, [selectedCountry]);

  const selectRussia = selectedCountry?.id === 1 ? true : false;

  useEffect(() => {
    if (
      (currenciesList || currenciesError) &&
      (countriesFetched || countriesFetched) &&
      (allowRegistration || disallowRegistration)
    ) {
      window.closeSplash(100);
      auth.isLoading = false;
      // splashScreen.close(100);
    }
  });

  useEffect(() => {
    if (allowRegistration || disallowRegistration) {
      delete formReg.phone;
      setFormReg({ ...formReg, key1: "", email: "", key2: "", password: " " });
      if (disallowRegistration) {
        showDisallowModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowRegistration, disallowRegistration]);

  useEffect(() => {
    if (
      currenciesList &&
      !formReg.currency &&
      countriesFetched &&
      !formReg.country
    ) {
      const recommendedCurrency = currenciesList.find(
        (item) => item.recommended
      );
      const recommendedCountry = countriesFetched.find(
        (item) => item.recommended
      );
      recommendedCurrency &&
        setFormReg({
          ...formReg,
          currency: {
            value: recommendedCurrency.id,
            label: recommendedCurrency.code,
          },
          country: {
            value: recommendedCountry?.id,
          },
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currenciesList, countries]);

  useEffect(() => {
    if (!auth.user) {
      if (data) {
        dispatch(setSingUpPage(false));
        dispatch(setRegistrationModalState(false));
        auth?.setUser({ ...data, showGreeting: true });
        localStorage.setItem("access_token", data.token.access_token);
        localStorage.setItem("show_greeting", true);
        localStorage.removeItem("stag");
        localStorage.removeItem("gc_ref");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (phoneRegistration) {
      setFormReg((prevFormReg) => {
        const { email, ...updatedFormReg } = prevFormReg;
        return { ...updatedFormReg, key1: formRegPhone };
      });
    } else {
      setFormReg((prevFormReg) => {
        const { phone, ...updatedFormReg } = prevFormReg;
        return { ...updatedFormReg, key1: formRegEmail };
      });
    }
  }, [phoneRegistration]);

  const updateKey1 = () => {
    if (!formReg.key1 && (formRegEmail || formRegPhone)) {
      setFormReg((prevFormReg) => {
        return {
          ...prevFormReg,
          key1: formReg.email ? formRegEmail : formRegPhone,
        };
      });
    }
  };

  const submit = () => {
    if (formReg.confirm === false) {
      toast("Confirm 18+ ", {
        theme: "dark",
        type: "error",
      });
    } else {
      updateKey1();
      const errorsReg = {};
      let _formReg = formReg;

      delete _formReg["g-recaptcha-response"];
      delete _formReg["g-recaptcha-v2-response"];

      const login = formReg?.key1?.replace(/[\n\s\t]+/g, "");
      setErrorReg({});
      if (selectedCountry?.allow_phone_registration) {
        if (!login) {
          errorsReg.key1 = t("required field");
        }
      } else {
        if (!login) {
          errorsReg.email = t("required field");
        }
      }

      if (
        !formReg?.key2?.replace(/[\n\s\t]+/g, "") ||
        formReg?.key2?.replace(/[\n\s\t]+/g, "").length < 8 ||
        formReg?.key2?.replace(/[\n\s\t]+/g, "").length > 32
      ) {
        errorsReg.key2 = t("required field");
      }

      if (!formReg.confirm) {
        errorsReg.confirm = t("required field");
      }

      if (Object.keys(errorsReg).length) {
        setErrorReg(errorsReg);
        ref?.current.scrollIntoView({ behavior: "smooth" });
      } else {
        if (selectedCountry?.allow_phone_registration) {
          if (
            validatePhoneNumbers(login) &&
            login.replace("+", "").replace(/^8/, "7").length === 11
          ) {
            _formReg.phone = parseInt(
              login.replace("+", "").replace(/^8/, "7")
            );
          }
        }
        if (validateEmail(login)) {
          _formReg.email = login;
        }

        _formReg.country = { ...formReg.country, id: formReg.country.value };
        _formReg.currency = { ...formReg.currency, id: formReg.currency.value };
        _formReg.password = formReg.key2.trim();
        _formReg.password_confirmation = formReg.key2.trim();

        if (localStorage.getItem("stag")) {
          _formReg.ext_ref_id = localStorage.getItem("stag");
        }
        if (localStorage.getItem("gc_ref")) {
          _formReg.gc_ref = localStorage.getItem("gc_ref");
        }
        if (_formReg.email === "") {
          delete _formReg.email;
        }
        delete _formReg.key1;
        delete _formReg.key2;

        auth.isLoading = true;
        register(formReg)
        // window?.grecaptcha?.ready(() => {
        //   window.grecaptcha
        //     .execute(siteKey, { action: "signup" })
        //     .then((token) => {
        //       _formReg["g-recaptcha-response"] = token;
        //       auth.isLoading = true;
        //       if (token === null) {
        //         auth.isLoading = false;
        //         setOpenRecapchaModal(true);
        //       } else {
        //         register(_formReg)
        //           .then((result) => {
        //             auth.isLoading = true;
        //             if (result?.error?.status === 418) {
        //               toast(result.error?.message, {
        //                 theme: "dark",
        //                 type: "error",
        //               });
        //             }
        //             if (result?.error?.status === 412) {
        //               toast(t("recaptcha error"), {
        //                 theme: "dark",
        //                 type: "error",
        //               });
        //               auth.isLoading = false;
        //               setOpenRecapchaModal(true);
        //             } else {
        //               toast(result.error?.message, {
        //                 theme: "dark",
        //                 type: "error",
        //               });
        //             }
        //           })
        //           .catch((error) => {
        //             toast("Unexpected error occurred", {
        //               theme: "dark",
        //               type: "error",
        //             });
        //           });
        //       }
        //     });
        // });
      }
    }
  };
  const handleRecaptchaChange = (value) => {
    setTokenCaptcha(value);
  };

  const handleSubmit = (event) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action: "signup" }).then((token) => {
        formReg["g-recaptcha-response"] = token;
        auth.isLoading = true;
        formReg["g-recaptcha-v2-response"] = tokenCaptcha;
        register(formReg).then((result) => {
          if (result?.error?.status === 412) {
            auth.isLoading = false;
            toast(t("recaptcha error"), {
              theme: "dark",
              type: "error",
            });
          } else {
            auth.isLoading = true;
            updateKey1();
            event.preventDefault();
            setOpenRecapchaModal(false);
          }
        });
      });
    });
  };

  const currenciesOptions = currenciesList
    ? currenciesList.map((currency) => ({
        label: `${currency.code}`,
        value: currency.id,
        selected: currency.id === formReg.currency?.value,
      }))
    : [];

  return (
    <>
      <Modal isOpen={disallowModal} closeModal={() => showDisallowModal(false)}>
        <ProhibitedCountry
          onClickOk={() => showDisallowModal(false)}
          message={disallowRegistration?.data?.message}
        />
      </Modal>
      <Modal
        isOpen={openRecapchaModal}
        closeModal={() => {
          setOpenRecapchaModal(false);
        }}
        theme={"recapcha"}
        modalClassName={style.modal}
      >
        <div className={style.wraper}>
          <form action="?" method="POST" onSubmit={handleSubmit}>
            <h1 className={style.wraper_title}>{t("security check")}</h1>
            <img src={shield} alt="" />
            <ReCAPTCHA
              sitekey={siteKeyV2}
              theme="dark"
              size={isMobile ? "compact" : "normal"}
              className={style.recaptcha_style}
              onChange={handleRecaptchaChange}
            />
            <div className={style.wraper_buttonBlock}>
              <Button
                onClick={handleSubmit}
                variant={"gold"}
                isLoading={auth?.isLoading}
              >
                {t("Confirm")}
              </Button>
              <Button
                onClick={() => {
                  updateKey1();
                  setOpenRecapchaModal(false);
                }}
                variant={"blue"}
              >
                {t("Cancel")}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <div className={css.sign_up}>
        <form autoComplete="off">
          <div className={css.sing_block}>
            <Switch
              a={{
                text: t("by phone"),
                onClick: () => {
                  if (selectRussia) {
                    setByPhone(true);
                    setByEmail(false);
                  }
                },
                active: byPhone,
              }}
              b={{
                text: t("by e-mail"),
                onClick: () => {
                  setByEmail(true);
                  setByPhone(false);
                },
                active: byEmail,
              }}
            />
          </div>
          <div className={css.input_label}>
            {phoneRegistration ? t("phone") : t("Email")}
          </div>
          <div
            className={classNames(
              css.input,
              css.input_bg,
              css.input_phoneEmail
            )}
          >
            <div className={css.input_phone}>
              <Input
                className={classNames(css.input_email, {
                  [css.input_email__hidden]: phoneRegistration,
                })}
                error={errorsReg.key1}
                value={formRegEmail}
                placeholder={t("write down your email")}
                name={"key1"}
                onBlur={(e) => {
                  const value = e.target.value.replace(/[\n\s\t]+/g, "");

                  if (value.length) {
                    if (validateEmail(value)) {
                      setErrorReg({ key1: null });
                      // Format input acc to Email
                    } else {
                      setErrorReg({ key1: t("could be Email") });
                    }
                  }

                  if (value.length !== e.target.value.length) {
                    setFormReg({ ...formReg, key1: value });
                  }
                }}
                onChange={(val) => {
                  setFormReg((prevFormReg) => ({ ...prevFormReg, key1: val }));
                  setErrorReg({ key1: null });
                  if (!phoneRegistration) {
                    setFormRegEmail(val);
                  }
                }}
              />
              <Input
                className={classNames(css.input_phone, {
                  [css.input_phone__hidden]: !phoneRegistration,
                })}
                error={errorsReg.key1}
                value={formRegPhone}
                placeholder={t("write down your phone number")}
                name={"key1"}
                onBlur={(e) => {
                  const value = e.target.value.replace(/[\n\s\t]+/g, "");

                  if (value.length) {
                    if (!/^(\+?7|8)[0-9]{10}$/.test(value)) {
                      setErrorReg({ key1: t("Invalid Russian phone number") });
                    } else {
                      setErrorReg({ key1: null });
                    }
                  }
                  if (value.length !== e.target.value.length) {
                    setFormReg({ ...formReg, key1: value });
                  }
                }}
                onChange={(val) => {
                  const cleanedValue = val.replace(/[^0-9+]/g, "");
                  if (cleanedValue.length === 0 || cleanedValue === "+") {
                    setFormRegPhone("+7");
                  } else if (/^\+7/.test(cleanedValue)) {
                    setFormRegPhone(cleanedValue.substring(0, 12));
                  } else {
                    setFormRegPhone("+7" + cleanedValue.substring(0, 11));
                  }
                  if (cleanedValue.length === 10) {
                    setErrorReg({ key1: null });
                  }
                }}
              />
              {selectRussia && byPhone ? (
                ""
              ) : byEmail && !selectRussia ? (
                <div
                  className={classNames(
                    css.phone_description,
                    css.phone_description__hidden
                  )}
                >
                  {t("description email")}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={css.input_label}>{t("Password")}</div>
          <div className={classNames(css.input, css.input_bg)}>
            <Input
              refLink={password}
              value={formReg.key2}
              placeholder={t("Password")}
              type={"password"}
              name={"key2"}
              autoComplete={"new-password"}
              error={errorsReg.key2}
              onChange={(val) => setFormReg({ ...formReg, key2: val })}
            />
          </div>
          <div className={css.splitted} ref={ref}>
            <div className={css.form_group}>
              <div className={css.input_label}>{t("select a country")}</div>
              <Select
                className={classNames(css.input, css.input_bg)}
                options={countries}
                error={errorsReg.country}
                value={formReg.country}
                placeholder={t("country")}
                name={"country"}
                onChange={(val) => {
                  if (val) {
                    setFormReg({ ...formReg, country: val });
                  } else {
                    setFormReg({ ...formReg, country: null });
                  }
                }}
                id={`country-registration`}
                maxHeight={300}
                isSearchable={true}
                selectContainerClass={css.select_container}
              />
            </div>
            <div className={css.form_group}>
              <div className={css.input_label}>{t("сhoose a currency")}</div>
              <Select
                className={classNames(css.input, css.input_bg)}
                options={currenciesOptions}
                id={"currency"}
                onChange={(val) => {
                  if (val) {
                    setFormReg({ ...formReg, currency: val });
                  } else {
                    setFormReg({ ...formReg, currency: null });
                  }
                }}
                value={formReg.currency}
                error={errorsReg.currency}
                placeholder={t("Currency")}
                selectContainerClass={css.select_container}
              />
            </div>
          </div>
          <div className={classNames(css.input, css.input_bg)} hidden={true}>
            <Input
              value={""}
              type={"password"}
              name={"password"}
              onChange={(val) => {}}
              readOnly={true}
            />
          </div>
          <div className={classNames(css.input, css.input_bg)}>
            <div className={css.input_label}>{t("Promo code")}</div>
            <Input
              type={"text"}
              value={formReg.promo}
              placeholder={t("Promo code")}
              name={"promo"}
              error={errorsReg.promo}
              onChange={(val) => setFormReg({ ...formReg, promo: val })}
            />
          </div>
          <div className={css.bottom}>
            <ToogleSwitchWithLabel
              label={
                <>
                  <span>
                    {t("confirm18+")}
                    <Link to={"/terms-conditions"} target={"_blank"}>
                      {t("Terms of Use")}{" "}
                    </Link>
                  </span>
                </>
              }
              error={errorsReg.confirm}
              className={css.bottom_toogleSwitch}
              checked={formReg.confirm}
              setValue={(val) => setFormReg({ ...formReg, confirm: val })}
            />
            <div className={css.btn}>
              <Button
                variant={"gold"}
                onClick={submit}
                isLoading={auth?.isLoading}
              >
                {t("Registration")}
              </Button>
              <div className={css.bottom_choice}>
                {t("Already have an account?")} &nbsp;
                <div
                  onClick={() => {
                    dispatch(setSingUpPage(false));
                    history.push("/");
                    dispatch(setRegistrationModalState(false));
                    dispatch(setLoginModalState(true));
                  }}
                  className={css.bottom_choice__active}
                >
                  {t("Sign in")}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
