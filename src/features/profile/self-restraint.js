import css from "./safety.module.css";
import self_restraint from "./../../images/profile/sos_security.svg";
import email from "./../../images/profile/mail_envelope_img.svg";

import bottom_line from "../../images/profile/bottom_line.svg";

import { useTranslation } from "react-i18next";
import Select from "../../components/form3/select";
import Button from "../../components/button/button";
import { useEffect, useState } from "react";
import { useSelfBlockMutation } from "../../app/api/user.api";
import { toast } from "react-toastify";
import classNames from "classnames";
import Modal from "../../components/modal/modal";
import { useAuth } from "../../services/auth";
import { useHistory } from "react-router-dom";
import Ricib from "../../components/ricib/ricib";

export default function SelfRestraint() {
  const { t } = useTranslation();
  const auth = useAuth();
  const history = useHistory();
  const listTimer = [1, 3, 7];
  const [selectedItem, setSelectedItem] = useState("never");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selfBlock, { data, isLoading, error }] = useSelfBlockMutation();

  useEffect(() => {
    if (data) {
      const notify = () =>
        toast(t("self-restraint success"), {
          theme: "dark",
          type: "success",
        });
      notify();
      setShowConfirm(false);

      setTimeout(() => {
        auth.signout(() => {
          history.push("/");
        });
      }, 2000);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const notify = () =>
        toast(error.data.message, {
          theme: "dark",
          type: "error",
        });
      notify();
      setShowConfirm(false);
    }
  }, [error]);

  const handleChange = (item) => {
    setSelectedItem(item);
  };

  const onSubmit = async () => {
    selfBlock({ days: selectedItem.value });
  };

  return (
    <div className={css.self_restraint}>
      <div className={css.container_for_mobile}>
        <img className={css.self_restraint_img_mobile} src={self_restraint} alt="self_restraint_img" />
        <h2>{t("self-restraint")}</h2>
      </div>
      <div className={css.self_restraint_container}>
        <div className={css.self_restraint_container_img_title}>
          <img className={css.self_restraint_img} src={self_restraint} alt="self_restraint_img" />
          <div className={css.select_title_container_restraint}>
            <p>Выберите дату</p>
            <Select
              options={listTimer.map((day, index) => ({
                value: day,
                key: `option-${day}-${index}`,
                label: t("limit day", {
                  count: day,
                }),
              }))}
              className={css.self_restraint__select}
              value={selectedItem}
              onChange={handleChange}
            />
            <p>{t("self-restraint text")}</p>

          </div>

        </div>
        <Button className={css.submit_btn_restraint} onClick={() => setShowConfirm(true)} isLoading={isLoading}>
          {t("to plug")}
        </Button>

      </div>
      {/* <img src={self_restraint} alt="" />
      <span className={css.self_restraint__title}>{t("self-restraint")}</span>
      <span className={css.self_restraint__text}>
        {t("self-restraint text")}
      </span> */}

      {showConfirm && (
        <Modal
          isOpen={showConfirm}
          closeModal={() => setShowConfirm(false)}
          className={css.modal}
          theme={"recovery"}
        >
          <div className={css.body}>
            <div className={css.modal_title_container}>
              <img src={email} alt="enveloper_svg" />
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
              <Button className={css.modal_btn_confirm} onClick={onSubmit}>{t("Confirm")}</Button>
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
      )}
    </div>
  );
}
