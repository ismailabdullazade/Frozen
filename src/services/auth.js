import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useGetUserQuery,
  useLoginMutation,
  useUserMarkMutation,
} from "../app/api/user.api";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import Welcome from "../components/welcome/welcome";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../components/modal/modal";
import {
  setLoginModalState,
  setLoginTwoFaModalState,
  setRegistrationModalState,
  setOpenRecaptchaModalV2,
} from "../app/app.slice";
import LoginModal from "../features/user/login/login-modal";
import { loadBaseUrl } from "../app/api/api.config";
import css from "./login-modal.module.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ForgotPasswordModal } from "../features/user/password-recovery/forgot-password-modal";
import { ConfirmCodeModal } from "../features/user/password-recovery/confirm-code-modal";
import { ResetPasswordModal } from "../features/user/password-recovery/reset-password-modal";
import UserBanner from "../features/user/user-banner";
import LoginTwofaOtp from "../features/user/login-twofa-otp/login-twofa-otp";
import RecaptchaModal from "../features/user/recaptcha-v2/recaptcha-v2";
import moment from "moment";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useGetActiveBonusQuery } from "../app/api/bonus.api";

const authContext = createContext();

export function useAuth() {
  return useContext(authContext);
}

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  let location = useLocation();
  const loginModalIsOpen = useSelector((state) => state.app.loginIsOpen);
  const registrationModalIsOpen = useSelector(
    (state) => state.app.registrationIsOpen
  );
  const dispatch = useDispatch();
  const [userMark, { data, error }] = useUserMarkMutation();
  const [paramsMark, setParamsMark] = useState({});
  const history = useHistory();
  const [activeWager, setActiveWager] = useState();

  useEffect(() => {
    if (window.location.hash === "#reg") {
      dispatch(setRegistrationModalState(true));
    }
  }, [location.hash]);

  useEffect(() => {
    if (window.location.search !== "") {
      const urlParams = new URLSearchParams(window.location.search);
      const newParams = {};

      for (const [key, value] of urlParams) {
        newParams[key] = value;
      }

      const requiredKeys = [
        "gc_content",
        "gc_datestart",
        "gc_dateend",
        "gc_channel",
        "gc_bonus",
        "gc_message_id",
      ];

      const hasRequiredKeys = requiredKeys.every((key) =>
        newParams.hasOwnProperty(key)
      );

      if (hasRequiredKeys) {
        if (newParams !== paramsMark) {
          setParamsMark({
            bonus_id: newParams.gc_bonus,
            channel: newParams.gc_channel,
            content: newParams.gc_content,
            dateend: newParams.gc_dateend,
            datestart: newParams.gc_datestart,
            gc_id: newParams.gc_message_id,
          });
        }
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (Object.keys(paramsMark).length > 0 && auth?.user?.id) {
      const marksURL = { ...paramsMark, user_id: auth.user.id };
      userMark(marksURL);
    }
  }, [paramsMark, auth?.user?.id]);

  useEffect(() => {
    if (data) {
      setParamsMark({});
      history.push(location.pathname);
    }
  }, [data]);

  const { data: activeBonus } = useGetActiveBonusQuery();
  useEffect(() => {
    if (activeBonus?.active_wager?.active) {
      setActiveWager(true);
    } else {
      setActiveWager(false);
    }
  }, [activeBonus?.active_wager?.active]);

  useEffect(() => {
    if (activeWager && location.pathname === "/games/live_games") {
      history.push("/");
    }
  }, [location.pathname, activeWager]);

  return (
    <>
      <Welcome auth={auth} />
      <Modal
        isOpen={loginModalIsOpen || registrationModalIsOpen}
        closeModal={() => {
          dispatch(setLoginModalState(false));
          dispatch(setRegistrationModalState(false));
        }}
        closeOnRouting={false}
        overlayClassName={css.login__overlay}
        theme={"log"}
        modalClassName={classNames(css.login__modal, css.modal_margin)}
        key="modalKey"
        bannerComponent={<UserBanner />}
      >
        <LoginModal auth={auth} />
      </Modal>
      <RecaptchaModal auth={auth} />
      <LoginTwofaOtp auth={auth} />
      <ForgotPasswordModal />
      <ConfirmCodeModal />
      <ResetPasswordModal />
      <authContext.Provider value={auth}>{children}</authContext.Provider>
    </>
  );
}

function useProvideAuth() {
  const accessToken = localStorage.getItem("access_token");
  const showGreeting = localStorage.getItem("show_greeting");
  const [user, setUser] = useState(null);
  const [callback, setCallback] = useState(null);
  const [login, { data, isLoading, error, reset }] = useLoginMutation();
  const { data: fetchedUser, isLoading: userFetching } = useGetUserQuery(null, {
    skip: !accessToken || !!user || !!data,
  });
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [tempLoginData, setTempLoginData] = useState(null);

  useEffect(() => {
    const syncLogoutAcrossTabs = (event) => {
      if (event.key === "logout_event") {
        performLogoutActions();
      }
    };

    window.addEventListener("storage", syncLogoutAcrossTabs);

    return () => {
      window.removeEventListener("storage", syncLogoutAcrossTabs);
    };
  }, []);

  const performLogoutActions = () => {
    reset();
    setUser(null);
    localStorage.setItem("logout_event", "logout" + Date.now());
    localStorage.removeItem("access_token");
    localStorage.removeItem("show_greeting");
    localStorage.removeItem("refresh_time");
    window.location.reload();
  };

  useEffect(() => {
    if (data && data?.token) {
      const expires_at = data?.token?.expires_at;
      const expiresMoment = moment(expires_at)
        .subtract({ hours: 1 })
        .utc()
        .toISOString();
      localStorage.setItem("refresh_time", expiresMoment);
    }
  }, [data?.token]);

  useEffect(() => {
    if (error) {
      console.log("error auth", error);

      if (error.status === 418) {
        toast(error.data.message, {
          theme: "dark",
          type: "error",
        });
      } else if (error.status === 412) {
        dispatch(setOpenRecaptchaModalV2(true));
      } else if (error.status === 406) {
        dispatch(setLoginTwoFaModalState(tempLoginData));
        dispatch(setLoginModalState(false));
      } else if (error.status === 403 || error.status === 401) {
        toast(error.data.message, {
          theme: "dark",
          type: "error",
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  useEffect(() => {
    if (data) {
      setUser(data);
      localStorage.setItem("access_token", data.token.access_token);
      if (callback) {
        callback();
        setCallback(null);
      }
      setTempLoginData(null);
      dispatch(setLoginModalState(false));
      dispatch(setLoginTwoFaModalState(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const signin = (data, cb) => {
    // if (validatePhoneNumbers(data.login) && data.login.length > 9 && data.login.length < 14) {
    //     data.phone = data.login;
    // } else if (validateEmail(data.login)) {
    //     data.email = data.login;
    // }
    setTempLoginData(data);
    login(data);
    setCallback(cb);
  };

  const signout = (cb) => {
    /*
     * TODO: /user/logout
     * */

    const token = localStorage.getItem("access_token");

    return fetch(`https://${loadBaseUrl()}/user/logout`, {
      headers: {
        "X-User-Locale": i18n.resolvedLanguage,
        Authorization: `Bearer ${token}`,
      },
    }).then((e) => {
      performLogoutActions();
      cb();
    });
  };

  return {
    user: user
      ? { ...user, showGreeting: JSON.parse(showGreeting) }
      : null /* || userStab*/,
    setUser,
    isLoading:
      isLoading ||
      userFetching ||
      (!user && !!data) ||
      (!user && !!fetchedUser && accessToken),
    signin,
    signout,
  };
}
