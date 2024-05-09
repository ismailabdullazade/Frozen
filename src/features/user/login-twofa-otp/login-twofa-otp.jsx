import {useDispatch, useSelector} from "react-redux";
import {setLoginTwoFaModalState} from "../../../app/app.slice";
import {useTranslation} from "react-i18next";
import TwofaOtp from "../../../components/twofa-otp/twofa-otp";
export default function LoginTwofaOtp({auth}) {
  const loginTwoFaData = useSelector(state => state.app.loginTwoFaData);
  const dispatch = useDispatch();
  const close = () => {
    dispatch(setLoginTwoFaModalState(null))
  }
  const login = (otp) => auth.signin({...loginTwoFaData, one_time_password: otp})
  const {t} = useTranslation()

  return <TwofaOtp
    action={login}
    close={close}
    isOpen={loginTwoFaData}
    isLoading={auth.isLoading}
    title={t("authentication")}
  />
}