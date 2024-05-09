import { useTranslation } from "react-i18next";
import css from "./promo-code.module.css";
import style from "./../../wallet/form/bonus-carousel/bonus-carousel.module.css";
import Input from "../../../components/form3/input";
import Button from "../../../components/button/button";
import { useState, useEffect } from "react";
import promoImg from "../../../images/bonuses/withoutpromocode.svg";
import Modal from "../../../components/modal/modal";
import modalBg from "../../../images/bonuses/modal-bg.png";
import cross from "../../../images/cross-white.svg";
import { usePromoCodeMutation } from "../../../app/api/bonus.api";
import { loadBaseUrl } from "../../../app/api/api.config";
import { toast } from "react-toastify";

export default function PromoCode() {
  const { t } = useTranslation();
  const [promoCode, setPromoCode] = useState("");
  const [modal, setModal] = useState(false);
  const host = loadBaseUrl().split("/")[0];

  const bonusImgUrl = (relName) => `https://${host}/uploads/${relName}`;

  const [
    code,
    {
      data: promoCodeData,
      isLoading: fetchingPromoBonus,
      error: errorPromoBonus,
    },
  ] = usePromoCodeMutation();

  const handleKeyDown = (event) => {
    if (event.code === "Enter") {
      code({ value: promoCode });
    }
  };

  useEffect(() => {
    if (errorPromoBonus) {
      const errorMessage = errorPromoBonus.data.message.replace(/`/g, "'");
      toast(errorMessage, {
        theme: "dark",
        type: "error",
      });
    }
  }, [errorPromoBonus]);

  return (
    <div className={css.promo}>
      <Modal
        customBody={
          <div className={style.bonus_modal}>
            <img src={modalBg} className={style.bonus_modal__bg} alt="" />
            <div
              className={style.bonus_modal__close}
              onClick={() => setModal(null)}
            >
              <img src={cross} alt="" />
            </div>
            <div className={style.bonus_modal__img}>
              <img src={bonusImgUrl(promoCodeData?.image)} alt="" />
            </div>
            <div className={style.bonus_modal__body}>
              {promoCodeData?.title}
              <div>{promoCodeData?.description}</div>
            </div>
            <div className={style.bonus_modal__list}>
              {promoCodeData?.details}
            </div>
          </div>
        }
        isOpen={modal}
        overlayClassName={style.overlay}
        closeModal={() => setModal(null)}
      />
      <div className={css.promo_block}>
        <Input
          className={css.block_input}
          placeholder={t("enter promo code")}
          value={promoCode}
          label={t("Promo code")}
          onChange={setPromoCode}
          onKeyDown={handleKeyDown}
          error={errorPromoBonus?.data?.message}
        />
        <Button
          className={css.block_btn}
          onClick={() => code({ value: promoCode })}
          disabled={fetchingPromoBonus || !promoCode.length > 0}
          variant={"gold"}
        >
          {t("Activate")}
        </Button>
        <div className={css.bonus_text}>
          {Boolean(promoCodeData) && (
            <span>{t("now you have a new bonus")}</span>
          )}
          {Boolean(errorPromoBonus) && <span>{t("Incorrect promocode")}</span>}
        </div>
      </div>
      <div className={css.divider} />
      <div className={css.promo_bonus}>
        {Boolean(promoCodeData) ? (
          <img
            src={bonusImgUrl(promoCodeData?.image)}
            className={css.bonus_img}
            alt=""
          />
        ) : (
          <img src={promoImg} alt="" className={css.bonus_img} />
        )}
      </div>
      <div className={css.title}>{t("enter promo code")}</div>
    </div>
  );
}
