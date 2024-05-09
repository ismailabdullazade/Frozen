import css from "./../login/login-modal.module.css";
import style from "./../../../../src/services/login-modal.module.css"
import React, { useEffect } from "react";
import SingUpComponent from "./singup-component";
import { useTranslation } from "react-i18next";
import {  useHistory } from "react-router-dom";
import Modal from "../../../components/modal/modal";
import { setSingUpPage } from "../../../app/app.slice";
import { useDispatch, useSelector } from "react-redux";
import close from "./../../../images/close_modal.svg"
import close_isTouch from "./../../../images/close_modal_touch.svg"
import UserBanner from "../user-banner";
import { useMediaQuery } from "beautiful-react-hooks";

export default function SignUp({auth}) {
    const {t} = useTranslation();
    const singUpPageOpen = useSelector(state => state.app.singUpPageOpen);
    const dispatch = useDispatch();
    const history = useHistory();
    const isTablet = useMediaQuery("(max-width: 1280px)");

    useEffect(() => {
        if (Boolean(auth?.user)) {
            if (window.location.pathname === '/registration') {
                history.push('/');
            }
        } else {            
            if (window.location.pathname === '/registration') {
                dispatch(setSingUpPage(true));
            }
        }
        // eslint-disable-next-line
    }, [auth, history]);

    // if (window.location.pathname === '/registration' && Boolean(auth?.user)) {
    //     return null;
    // }

    const closeModal = () => {
        history.push('/');
        window.openSplash();
        dispatch(setSingUpPage(false));
    };

    return (
            <Modal
                isOpen={singUpPageOpen}
                closeModal={closeModal}
                overlayClassName={style.login__overlay}
                theme={"log"}
                bannerComponent={<UserBanner />}
            >
                    <div className={css.singup}>
                        <div className={css.signin_reg}>
                            <div className={css.login_title}>{t("Registration")}</div>
                        </div>
                        <div 
                            onClick={closeModal}
                            className={css.close_modal}>
                            <img src={isTablet? close_isTouch : close} alt="" />
                        </div>
                        <div className={css.form_reg}>
                            <SingUpComponent auth={auth} />
                        </div>
                    </div>
            </Modal>
    );
}