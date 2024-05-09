import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { setLoginModalState } from "../../../app/app.slice";
import { usePasswordRestoreMutation } from "../../../app/api/user.api";
import { setResetPasswordModalState } from "../../../app/app.slice";

import Input from "../../../components/form3/input";
import Button from "../../../components/button/button";
import { useHistory } from "react-router-dom";
import Modal from "../../../components/modal/modal";

import css from "./style.module.css";

export function ResetPasswordModal() {
  const target = useSelector((state) => state.app.target);
  const typeFogot = useSelector((state) => state.app.type);
  const [form, setForm] = useState({});
  const [error, setError] = useState({});
  const { t } = useTranslation();
  const [restore, { data, isLoading, error: queryError }] =
    usePasswordRestoreMutation();
  const dispatch = useDispatch();
  const history = useHistory();

  const resetPasswordModalIsOpen = useSelector(
    (state) => state.app.resetPasswordModalIsOpen
  );
  const code = useSelector((state) => state.app.code);
  // const type = useSelector(state => state.app.type);

  useEffect(() => {
    if (data) {
      const notify = () =>
        toast(t("Password saved successfully"), {
          theme: "dark",
          type: "success",
        });
      notify();
      history.push("/");
      dispatch(setResetPasswordModalState(false));
      dispatch(setLoginModalState(true));

      setForm({});
    } else if (queryError) {
      const message = queryError.data?.message || t("Something went wrong :-(");
      // const notify = () => toast(message, {
      //     theme: "dark",
      //     type: "error"
      // });
      // notify();
    }
    // eslint-disable-next-line
  }, [data, queryError]);

  return (
    <Modal
      isOpen={resetPasswordModalIsOpen}
      closeModal={() => {
        dispatch(setResetPasswordModalState(false));
      }}
      modalClassName={css.modal}
      theme="password_modal"
    >
      <div className={classNames(css.body, css.reset_password)}>
        <div className={css.title}>{t("password recovery")}</div>
        <div className={css.form_reset}>
          <Input
            placeholder={t("New password")}
            autoComplete={"off"}
            onChange={(e) => {
              setForm({ ...form, key1: e });
              setError({});
            }}
            className={css.input}
            value={form.key1}
            name={"key1"}
            error={error.key1}
            type={"password"}
          />
          <Input
            type={"password"}
            placeholder={t("Repeat password")}
            autoComplete={"off"}
            onChange={(e) => {
              setForm({ ...form, key2: e });
              setError({});
            }}
            className={classNames(css.input, css.repeat_password)}
            value={form.key2}
            name={"key2"}
            error={error.key2}
          />
        </div>
        <div className={css.btn_reset}>
          <Button
            onClick={() => {
              if (
                form.key1 === form.key2 &&
                form.key1.length >= 8 &&
                form.key1.length <= 32
              ) {
                restore({
                  [typeFogot]: target,
                  code,
                  password: form.key1,
                  password_confirm: form.key2,
                });
              } else {
                setError({
                  key1: "Passwords do not match",
                  key2: "Passwords do not match",
                });
              }
            }}
            disabled={isLoading || !form.key1 || !form.key2}
            isLoading={isLoading}
            variant="gold"
          >
            {t("Confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
