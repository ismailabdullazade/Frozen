import Modal from "../modal/modal";
import React from "react";
import css from "./welcome.module.css";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Button from "../button/button";
import { useHistory } from "react-router-dom";

export default function Welcome({ auth }) {
  const { t } = useTranslation();
  const history = useHistory();
  const close = () => {
    if (auth.user?.showGreeting) {
      auth.setUser({ ...auth.user, showGreeting: true });
      localStorage.removeItem("show_greeting");
      history.push("/wallet");
      window.location.reload();
    }
  };

  return (
    <Modal
      isOpen={auth.user?.showGreeting}
      closeModal={close}
      modalClassName={css.modal}
      theme={auth.user?.email ? "welcome" : "cancel_bonus"}
    >
      <div className={css.container}>
        <div className={css.title}> {t("Successfully signup")}</div>
        {auth.user?.email ? (
          <div className={classNames(css.center, css.text)}>
            <p>
              <span>
                {t("We will send a message with PDF files containing our")}{" "}
              </span>
              <a href={"/terms-of-use"}>{t("Terms of use (with)")}</a>
              <span>
                {t("and policies to the email address you registered.")}
              </span>
            </p>
            <p>{t("If you do not receive...")}</p>
          </div>
        ) : (
          <div className={classNames(css.center, css.text)}>
            <p>{t("Phone welcome")}</p>
          </div>
        )}
        <div className={classNames(css.center, css.bottom)}>
          <Button
            onClick={close}
            className={classNames(css.btn, { [css.phone]: auth.user?.phone })}
          >
            {t("start the game")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
