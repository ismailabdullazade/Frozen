import css from "./profile.module.css";
import telegram from "./../../images/profile/social-telegram.svg"
import vk from "./../../images/profile/social-vk.svg"
import telegram_linked from "./../../images/profile/telegram_linked.svg"
import vk_linked from "./../../images/profile/vk_linked.svg"
import link_tg_social from "./../../images/profile/social_telegram_new.svg"
import Button from "../../components/button/button";
import { useTranslation } from "react-i18next";
import Modal from "../../components/modal/modal";
import { useEffect, useRef, useState } from "react";
import Input from "../../components/form3/input";
import { useAuth } from "../../services/auth";
import { useGetQRCodeTGLinkedMutation, useLinkedVKIDMutation } from "../../app/api/user.api";
import { Link, NavLink } from "react-router-dom/cjs/react-router-dom";
import copy from "./../../images/items/copy.svg";
import telegram_social_svg from "../../images/footer-icons/telegram_icon_footer.svg";

import {toast} from "react-toastify";

export default function Social() {
    const {t} = useTranslation();
    const auth = useAuth();
    const wrapperRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const { vk_id: VKID, tg_id: TGID } = auth?.user || {};
    const [linkedSocialVK, setLinkSocialVK] = useState(false);
    const [linkedSocialTelegram, setLinkSocialTelegram] = useState(false);
    const [linkedVK, setLinkVK] = useState(Boolean(VKID));
    const [linkedTelegram, setLinkTelegram] = useState(Boolean(TGID));
    const [vkID, setvkID] = useState("");
    const [VKIDError, setVKIDError] = useState(false);
    const [linkedVKID, {data: linkVKID, error: error_VKID}] = useLinkedVKIDMutation();
    const [errorModal, setErrorModal] = useState(false);
    const [getQRCodeTGLinked, { data: data_QRCodeTG, error: error_QRCodeTG }] = useGetQRCodeTGLinkedMutation();
    const verification = auth?.user?.verified

    const handleCopy = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    useEffect(() => {
        if (error_QRCodeTG) {

            if (error_QRCodeTG?.status === 412) {
                setErrorModal(true)
            } else {
                const notify = () => toast(t("Sorry, unknown error... Please try later"), {
                    theme: "dark",
                    type: "error"
                });
                notify();
            }
        }
    }, [error_QRCodeTG])

    useEffect(() => {
        if(data_QRCodeTG){
            setLinkSocialTelegram(true)
        }
    }, [data_QRCodeTG])

    useEffect(() => {
        if (error_VKID) {

            if (error_VKID?.status === 412) {
                setErrorModal(true)
            } else {
                const notify = () => toast(t("Sorry, unknown error... Please try later"), {
                    theme: "dark",
                    type: "error"
                });
                notify();
            }
        }
    }, [error_VKID])

    return (
        <div className={css.social}>
            {/* <div className={css.social_telegram}>
                <img src={linkedTelegram? telegram_linked : telegram} alt="" />
                {
                   linkedTelegram ? <div className={css.telegram_linked}>
                        <div className={css.telegram_id}>{TGID}</div>
                        <div className={css.telegram_link__confirm}>{t("linked")}</div>
                    </div> :
                    <Button 
                        variant="violet"
                        className={css.btn}
                        onClick={getQRCodeTGLinked}
                    >
                        {t("link")}
                    </Button>
                }
            </div> */}
            <div className={css.social_connect_container}>
                    <Link
                      to={{ pathname: "https://t.me/GARILLA_CASINO_OFFICIAL" }}
                      target={"_blank"}
                      >
                      <img src={telegram_social_svg} alt="telegramLink" />
                    </Link>
                    <Button
                    
                      variant={"violet"}
                      onClick={getQRCodeTGLinked}
                    // onClick={() => {verification? setErrorModal(true) : setLinkSocialVK(true)}}
                    >
                      {t("link")}
                    </Button>
                  </div>
            {/* <div className={css.social_vk}>
                <img src={linkedVK? vk_linked : vk} alt="" />
                {
                   linkedVK ? <div className={css.telegram_linked}>
                        <div className={css.telegram_id}>{VKID}</div>
                        <div className={css.telegram_link__confirm}>{t("linked")}</div>
                    </div> :
                    <Button 
                        variant="violet"
                        className={css.btn}
                        onClick={() => {verification? setErrorModal(true) : setLinkSocialVK(true)}}
                    >
                        {t("link")}
                    </Button>
                }
            </div>  */}
            <Modal 
                isOpen={linkedSocialVK || linkedSocialTelegram}
                closeModal={() => {
                    setLinkSocialVK(false);
                    setLinkSocialTelegram(false);
                }}
                theme={"recovery"}
            >
                <div className={css.modal_social}> 

                    {
                        // I CHANGED HERE NIDA ISHARESINI
                       (linkedSocialTelegram && !linkedSocialVK) ? 
                       <div className={css.modal_social__telegram}>
                            <div className={css.modal_title_container}>
                                <img src={link_tg_social} alt="telegram_svg" />
                                <span className={css.body_title}>
                                {/* {t("verification")} */}
                                Привязка Телеграмм
                                </span>
                            </div>
                            <div className={css.social_text}>
                                {t("to link your telegram account, go to")}
                                <NavLink
                                    to={{pathname: "https://t.me/garillacasino_bot"}}
                                    target={"_blank"} 
                                    className={css.social_text__active}>
                                    {t("our telegram bot")}
                                </NavLink>
                                {t("and tell it the code:")}
                            </div>
                            <div className={css.telegram__wrapper__code}>
                                <Input 
                                    value={data_QRCodeTG?.["tg-key"]}
                                    className={css.code_copy}
                                />
                                <div 
                                    className={css.code_copy__img}
                                    onClick={() => handleCopy(data_QRCodeTG?.["tg-key"])}
                                    ref={wrapperRef} 
                                >
                                    <img src={copy} alt="" />
                                </div>
                                <div className={copied? css.code_copied : css.code_hiden}>{t("copied")}</div>
                            </div>
                        </div> :
                        <div className={css.modal_social__vk}>
                            <div className={css.modal_title_container}>
                                <img src={link_tg_social} alt="telegram_svg" />
                                <span className={css.body_title_social}>
                                {t("verification")}
                                </span>
                            </div>
                            <span className={css.social_text}>{t("to link your vk account, enter your id")}</span>
                            <Input
                                value={vkID}
                                className={css.vk_input}
                                placeholder={t("id vk")}
                                onChange={(val) => {
                                    const num = val.replace(/\D/g, "");
                                    if (num.length <= 2 || (num.length > 2 && num.length < 15)) {
                                        setVKIDError(false);
                                        setvkID(num);
                                    } else {
                                        setVKIDError(true);
                                    }
                                }}
                                error={VKIDError}
                            />
                        </div>

                    }
                    <div className={css.social_btn}>
                        {/* {
                            !linkedSocialTelegram && linkedSocialVK && <Button
                                onClick={() => {
                                    linkedVKID(vkID);
                                    setLinkSocialVK(false);
                                    window.location.reload();
                                }}
                                variant="gold"
                            >
                                {t("linked-2")}
                            </Button> 
                        }    */}
                        <Button
                            onClick={() => {
                                linkedSocialVK? setLinkSocialVK(false) :
                                setLinkSocialTelegram(false);
                                window.location.reload();
                            }}
                            variant="violet"
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
                // theme={"withdrawal_small"}
                theme={"recovery"}
            >   
                <div className={css.error_modal}>
                    <div className={css.error_title}>{t("Attention")}</div>
                    <div className={css.error_text}>{t("you must verify your account")}</div>
                    <Button
                        onClick={() => {
                            setErrorModal(false);
                        }}
                        variant="violet"
                    >
                        {t("close")}
                    </Button>
                </div>
            </Modal>
        </div>
    )
};