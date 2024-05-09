import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  err500: false,
  loginIsOpen: false,
  redirectAfterLogin: null,
  loginCloseCallback: () => {},
  loginTwoFaData: null, //Тут должна содержаться заполненная форма логина. Записывается сюда, если на логин пришло 406. Будет показано окно ввода 2фа кода
  registrationIsOpen: false,
  forgotPasswordIsOpen: false,
  confirmCodeModalIsOpen: false,
  resetPasswordModalIsOpen: false,
  saveRequestCodeData: {},
  type: localStorage.getItem("__respass_type") || "",
  target: localStorage.getItem("__respass_target") || "",
  timer: localStorage.getItem("__respass") || "",
  fullScreen: false,
  openUserInfo: false,
  openNotification: false,
  openSidebar: false,
  notifications: [],
  setSingUpPage: false,
  modalPosition: { top: 0, left: 0 },
  notBonusDep: false,
  openRecaptchaModalV2: false,
  formLoginCaptchaV2: { login: "", password: "", rememberMe: false, email: "" },
  valuesScroll: {},
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setErr500(state, action) {
      state.err500 = action.payload;
    },
    setLoginModalState(state, action) {
      state.loginIsOpen = action.payload;
    },
    setLoginTwoFaModalState(state, action) {
      state.loginTwoFaData = action.payload;
    },
    setRegistrationModalState(state, action) {
      state.registrationIsOpen = action.payload;
    },
    setForgotPasswordModalState(state, action) {
      state.forgotPasswordIsOpen = action.payload;
    },
    setConfirmCodeModalState(state, action) {
      state.confirmCodeModalIsOpen = action.payload;
    },
    setResetPasswordModalState(state, action) {
      state.resetPasswordModalIsOpen = action.payload;
    },
    setSaveRequestCodeData(state, action) {
      state.saveRequestCodeData = action.payload;
    },
    setCode(state, action) {
      state.code = action.payload;
    },
    setType(state, action) {
      state.type = action.payload;
    },
    setTerget(state, action) {
      state.target = action.payload;
    },
    setTimer(state, action) {
      state.timer = action.payload;
    },
    setFullScreen(state, action) {
      state.fullScreen = action.payload;
    },
    setOpenUserInfo(state, action) {
      state.openUserInfo = action.payload;
    },
    setOpenNotification(state, action) {
      state.openNotification = action.payload;
    },
    setOpenSidebar(state, action) {
      state.openSidebar = action.payload;
    },
    setHideSidebarLeft(state, action) {
      state.hideSidebarLeft = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    setSingUpPage(state, action) {
      state.singUpPageOpen = action.payload;
    },
    setModalPosition(state, action) {
      state.modalPosition = action.payload;
    },
    setNotBonusDep(state, action) {
      state.notBonusDep = action.payload;
    },
    setOpenRecaptchaModalV2(state, action) {
      state.openRecaptchaModalV2 = action.payload;
    },
    setFormLoginCaptchaV2(state, action) {
      state.formLoginCaptchaV2 = action.payload;
    },
    setValuesScroll(state, action) {
      state.valuesScroll = action.payload;
    },
    setRedirectAfterLogin(state, action) {
      state.redirectAfterLogin = action.payload
    },
    setLoginCloseCallback(state, action) {
      state.loginCloseCallback = action.payload
    }
  },
});

export const {
  setLoginCloseCallback,
  setRedirectAfterLogin,
  setErr500,
  setLoginModalState,
  setLoginTwoFaModalState,
  setRegistrationModalState,
  setForgotPasswordModalState,
  setConfirmCodeModalState,
  setResetPasswordModalState,
  setSaveRequestCodeData,
  setCode,
  setType,
  setTerget,
  setTimer,
  setFullScreen,
  setOpenNotification,
  setOpenSidebar,
  setHideSidebarLeft,
  setOpenUserInfo,
  setNotifications,
  setSingUpPage,
  setModalPosition,
  setNotBonusDep,
  setOpenRecaptchaModalV2,
  setFormLoginCaptchaV2,
  setValuesScroll,
} = appSlice.actions;
export default appSlice.reducer;
