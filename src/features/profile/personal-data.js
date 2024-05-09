import css from "./profile.module.css";
import Input from "../../components/form3/input";
import Button from "../../components/button/button";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "../../components/form3/select";
import { useAuth } from "../../services/auth";
import {
  useGetCountriesQuery,
  useGetQRCodePhoneLinkedMutation,
  usePersonalDataMutation,
  useVerificationEmailMutation,
  useVerificationPhoneMutation,
} from "../../app/api/user.api";
import { toast } from "react-toastify";
import moment from "moment";
import classNames from "classnames";
import "moment/dist/locale/ru";
import Datepicker from "../../components/Datepicker/datepicker";
import {
  validateEmail,
  validatePhoneNumbers,
  validatePhoneNumbersLength,
} from "../../utils/validation";
import Verification from "./verification";
import Social from "./social";
import { useMediaQuery } from "beautiful-react-hooks";
// import verified from "../../images/profile/good_verification.svg";
import verified from "../../images/profile/succeed_verification.png";
import Modal from "../../components/modal/modal";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import copy from "./../../images/items/copy.svg";

moment.locale("ru");

export default function PersonalData() {
  const { t } = useTranslation();
  moment.locale("ru");
  const auth = useAuth();
  const wrapperRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 960px");
  const genderOptions = [
    { value: "m", label: t("male") },
    { value: "f", label: t("female") },
  ];
  const [
    getQRCodePhoneLinked,
    { data: data_QRCodePhone, error: error_QRCodePhone },
  ] = useGetQRCodePhoneLinkedMutation();
  const [copied, setCopied] = useState(false);
  const [linkedSocialPhone, setLinkSocialPhone] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const getGenderFromUser = () => {
    if (auth?.user) {
      const gender = genderOptions.find((o) => o.value === auth.user?.gender);

      return gender ? gender : genderOptions[0];
    } else {
      return genderOptions[0];
    }
  };
  const [form, setForm] = useState(
    auth.user ? { ...auth.user, gender: getGenderFromUser() } : {}
  );
  const [error, setError] = useState({});
  const [birthday, setBirthday] = useState(auth.user?.birthday);
  const phoneNumber = auth?.user?.phone;
  const linkedPhone = auth?.user?.phone_verified_at;
  const verificated = auth?.user?.verified;

  const handleCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const submit = () => {
    const errors = {};
    setError({});

    if (!form.nickname) {
      errors.nickname = t("nickname") + ", " + t("required field");
    }
    if (!form.firstname) {
      errors.firstname = t("FirstName") + ", " + t("required field");
    }
    if (!form.lastname) {
      errors.lastname = t("lastName") + ", " + t("required field");
    }
    if (!form.gender) {
      errors.gender = t("Required field");
    }
    if (form.email?.length && !validateEmail(form.email)) {
      errors.email = t("Required field");
    }
    if (!birthday) {
      errors.birthday = t("Required field");
    }
    if (!form.country) {
      errors.country = t("Required field");
    }

    if (Object.keys(errors).length) {
      setError(errors);
      Object.keys(errors).forEach((errKey) => {
        toast(errors[errKey], {
          theme: "dark",
          type: "error",
        });
      });
      ref?.current.scrollIntoView({ behavior: "smooth" });
    } else if (error.nickname === t("Unacceptable symbols")) {
      toast(error.nickname, {
        theme: "dark",
        type: "error",
      });
    } else {
      form.birthday = birthday;
      saveUser({ ...form, gender: form.gender.value });
    }
  };

  const ref = useRef();
  const { data: countries } = useGetCountriesQuery();
  const countriesOptions = countries
    ? countries.map((country) => ({
        label: country.title,
        value: country.id,
      }))
    : [];
  const [saveUser, { data, isLoading }] = usePersonalDataMutation();
  const clearError = (key) => {
    if (error[key]) {
      const temp = Object.assign({}, error);
      delete temp[key];
      setError(temp);
    }
  };
  // const [sendCode] = useSendVerificationCodeMutation();
  // eslint-disable-next-line
  const [verifyEmail, { data: verifyEmailSuccess }] =
    useVerificationEmailMutation();
  // eslint-disable-next-line
  const [verifyPhone, { data: verifyPhoneSuccess }] =
    useVerificationPhoneMutation();
  // eslint-disable-next-line
  const [emailDisable, setEmailDisable] = useState(false);
  // eslint-disable-next-line
  const [phoneDisable, setPhoneDisable] = useState(false);
  // const [tooltipIsOpen2, setIsOpen2] = useState(false);
  const currentDate = () => new Date();

  useEffect(() => {
    if (verifyEmailSuccess) {
      auth.setUser({ ...auth.user, email_verified_at: true });
      setEmailDisable(false);
    }
    // eslint-disable-next-line
  }, [verifyEmailSuccess]);

  useEffect(() => {
    if (verifyPhoneSuccess) {
      auth.setUser({ ...auth.user, phone_verified_at: true });
      setPhoneDisable(false);
    }
    // eslint-disable-next-line
  }, [verifyPhoneSuccess]);

  useEffect(() => {
    setForm({ ...auth.user, gender: getGenderFromUser() });
    // eslint-disable-next-line
  }, [auth]);

  useEffect(() => {
    if (data) {
      const notify = () =>
        toast(t("successfully saved"), {
          theme: "dark",
          type: "success",
        });
      notify();

      auth.setUser(data);
    }
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    if (error_QRCodePhone) {
      if (error_QRCodePhone?.status === 412) {
        setErrorModal(true);
      } else {
        const notify = () =>
          toast(t("Sorry, unknown error... Please try later"), {
            theme: "dark",
            type: "error",
          });
        notify();
      }
    }
  }, [error_QRCodePhone]);

  useEffect(() => {
    if (data_QRCodePhone) {
      setLinkSocialPhone(true);
    }
  }, [data_QRCodePhone]);

  const status = useMemo(() => {
    if (linkedPhone === null && phoneNumber === null) {
      return "no phone number";
    }
    if (linkedPhone === null && phoneNumber !== null) {
      return "phone not linked";
    }
    if (linkedPhone !== null && phoneNumber !== null) {
      return "passed";
    }
  }, [linkedPhone, phoneNumber]);

  const statusElements = {
    "phone not linked": (
      <Button onClick={() => getQRCodePhoneLinked()} variant="gold_revert">
        {t("confirm")}
      </Button>
    ),
    passed: <img src={verified} alt="" />,
    "no phone number": "",
  };
  const elementToDisplay = statusElements[status];

  return (
    <>
    <div className={css.header_personal_data}>
      <h2>
        {t("personal data")}
      </h2>
    </div>
     <div className={css.form} ref={ref}>
        <div className={css.form_contact}>
          <div className={css.item_nikname}>
            <Input
              className={css.item}
              // className={classNames(css.input, css.input_bg)}
              label={t("nickname")}
              value={form.nickname}
              onChange={(val) => {
                const allowedSymbols = /^[-_\sA-Za-z0-9]+$/i.test(val);
                const errors = Object.assign({}, error);

                if (val === "" || (allowedSymbols && val.length <= 16)) {
                  errors.nickname = null;
                } else {
                  errors.nickname = t("Unacceptable symbols");
                }
                setForm({ ...form, nickname: val });
                setError(errors);
              }}
              onBlur={() => {
                const val = form.nickname;
                const enoughChars = /[A-Za-z]{4}/.test(val);
                const errors = Object.assign({}, error);

                if (enoughChars) {
                  errors.nickname = null;
                } else {
                  errors.nickname = t("Unacceptable symbols");
                }
                setError(errors);
              }}
              error={error.nickname}
              variant="profile"
            />
            <div
              className={classNames(
                css.nickname_description,
                css.nickname_description__hiden
              )}
            >
              {t("description nickname")}
            </div>
          </div>
          <Input
            onBlur={(e) => {
              const value = e.target.value;

              if (value.length) {
                if (!validateEmail(value)) {
                  setError({ ...error, email: t("could be Email") });
                } else {
                  clearError("email");
                }
              } else {
                clearError("email");
              }
            }}
            className={css.item}
            label={t("electron mail")}
            value={form.email}
            disabled={!!auth.user.email}
            onChange={(val) => setForm({ ...form, email: val })}
            error={error.email}
            variant="profile"
          />
          <div className={css.phone_block}>

            <Input
              className={css.item}
              label={t("phone")}
              value={form.phone}
              onBlur={(e) => {
                const value = e.target.value;

                if (value.length) {
                  if (!validatePhoneNumbersLength(value.replace("+", ""))) {
                    setError({ ...error, phone: t("could be Phone Number") });
                  } else {
                    clearError("phone");
                  }
                } else {
                  clearError("phone");
                }
              }}
              disabled={!!auth.user.phone}
              onChange={(val) => {
                if (
                  validatePhoneNumbers(val) &&
                  (val.replace("+", "").length < 14 || val.length === 0)
                ) {
                  setForm({ ...form, phone: val });
                }
              }}
              error={error.phone}
              variant="profile"
            />
            <div className={css.linked_status}>{elementToDisplay}</div>
            <Modal
              isOpen={linkedSocialPhone}
              closeModal={() => {
                setLinkSocialPhone(false);
              }}
              theme={"social"}
            >
              <div className={css.modal_social}>
                <div className={css.modal_social__telegram}>
                  <div className={css.social_text}>
                    {t("to verify your phone, go to")}
                    <NavLink
                      to={{
                        pathname: "https://t.me/gc_phone_verification_bot",
                      }}
                      target={"_blank"}
                      className={css.social_text__active}
                    >
                      {t("our telegram bot")}
                    </NavLink>
                    {t("and tell it the code:")}
                  </div>
                  <div className={css.telegram__wrapper__code}>
                    <Input
                      value={data_QRCodePhone?.["phone-link-key"]}
                      className={css.code_copy}
                    />
                    <div
                      className={css.code_copy__img}
                      onClick={() =>
                        handleCopy(data_QRCodePhone?.["phone-link-key"])
                      }
                      ref={wrapperRef}
                    >
                      <img src={copy} alt="" />
                    </div>
                    <div className={copied ? css.code_copied : css.code_hiden}>
                      {t("copied")}
                    </div>
                  </div>
                </div>
                <div className={css.social_btn}>
                  <Button
                    onClick={() => {
                      setLinkSocialPhone(false);
                      window.location.reload();
                    }}
                    variant="blue"
                  >
                    {t("close")}
                  </Button>
                </div>
              </div>
            </Modal>
            <Modal
              isOpen={errorModal}
              closeModal={() => {
                setErrorModal(false);
              }}
              theme={"withdrawal_small"}
            >
              <div className={css.error_modal}>
                <div className={css.error_title}>{t("Attention")}</div>
                <div className={css.error_text}>
                  {t("you must verify your account")}
                </div>
                <Button
                  onClick={() => {
                    setErrorModal(false);
                  }}
                  variant="blue"
                >
                  {t("close")}
                </Button>
              </div>
            </Modal>
          </div>
          <Verification />
        </div>
        <div className={css.header_personal_info}> 
                <h2>
                  {t("personal information")}
                </h2>
        </div>
        {/* {isMobile && <Social />} */}
        <div className={css.form_contact}>

          <div className={css.fomr_input_container_personal}>
            <Input
              className={css.item}
              label={t("FirstName")}
              value={form.firstname}
              onChange={(val) => {
                const allowedSymbols = /^[a-zA-Zа-яА-Я\s\t-]+$/;
                const errors = { ...error };
                if (
                  val === "" ||
                  (allowedSymbols.test(val) && val.length <= 20)
                ) {
                  errors.firstname = null;
                  setForm({ ...form, firstname: val });
                } else {
                  errors.firstname = t("Unacceptable symbols");
                  setError(errors);
                }
              }}
              error={error.firstname}
              variant="profile"
            />
            <Input
              className={css.item}
              label={t("lastName")}
              value={form.lastname}
              onChange={(val) => {
                const allowedSymbols = /^[a-zA-Zа-яА-Я\s\t-]+$/;
                const errors = { ...error };
                if (
                  val === "" ||
                  (allowedSymbols.test(val) && val.length <= 20)
                ) {
                  errors.lastname = null;
                  setForm({ ...form, lastname: val });
                } else {
                  errors.lastname = t("Unacceptable symbols");
                  setError(errors);
                }
              }}
              error={error.lastname}
              variant="profile"
            />

          </div>
          <div className={css.fomr_input_container_personal}>
            <div className={css.item}>
              <Datepicker
                label={t("date of birth")}
                id={"birthday"}
                placeholder={t("date of birth")}
                className={css.datepicker}
                config={{
                  range: false,
                  minDate: currentDate().setFullYear(
                    currentDate().getFullYear() - 100
                  ),
                  maxDate: currentDate().setFullYear(
                    currentDate().getFullYear() - 18
                  ),
                }}
                nullable={false}
                disabled={verificated}
                value={new Date(birthday)}
                onChange={(val) => {
                  val.date && setBirthday(moment(val.date).format("YYYY-MM-DD"));
                }}
              />
            </div>
            <Select
              onChange={(val) => setForm({ ...form, gender: val })}
              error={error.gender}
              value={form.gender}
              label={t("gender")}
              placeholder={t("choose")}
              className={classNames(css.item, css.gender)}
              options={genderOptions}
              variant="profile"
            />

          </div>
          <div className={css.fomr_input_container_personal}>
            <Select
              className={css.item}
              onChange={(val) =>
                setForm({ ...form, country: { ...val, id: val.value } })
              }
              error={error.country}
              value={
                form.country?.value
                  ? form.country
                  : { value: form.country?.id, label: form.country?.title }
              }
              label={t("country")}
              isSearchable={true}
              placeholder={t("choose")}
              options={countriesOptions}
              maxHeight={224}
              variant="profile"
            />
            <Input
              className={css.item}
              label={t("city")}
              value={form.city}
              style={{ zIndex: 50 }}
              onChange={(val) => {
                const allowedCharactersRegex = /^[a-zA-Zа-яА-Я\s\t-]+$/;
                if (val === "" || allowedCharactersRegex.test(val)) {
                  setForm({ ...form, city: val });
                }
              }}
              error={error.city}
              variant="profile"
            />
          </div>
          <div 
          className={classNames(css.button, css.save_personal_info_btn)}
          >
              <Button isLoading={isLoading} onClick={submit} variant={"gold"}>
                {t("save")}
              </Button>
            </div> 
        </div>
      </div>

    </>
  );
}
