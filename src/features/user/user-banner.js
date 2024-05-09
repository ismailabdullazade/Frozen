import css from "./user-banner.module.css";
import cash_back from "./../../images/cash_back.png";
import cash_back_tablet from "./../../images/cash_back_tablet.png";
import { useMediaQuery } from "beautiful-react-hooks";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setLoginModalState,
  setRegistrationModalState,
} from "../../app/app.slice";
import close from "./../../images/close_modal.svg";

export default function UserBanner() {
  const isTablet = useMediaQuery("(max-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 960px)");
  const loginModalIsOpen = useSelector((state) => state.app.loginIsOpen);
  const registrationModalIsOpen = useSelector(
    (state) => state.app.registrationIsOpen
  );
  const [openBaner, setOpenBanner] = useState(false);
  const [registrationPageOpen, setRegistrationPageOpen] = useState(false);
  const [positionTop, setPositionTop] = useState("202px");
  const modalPosition = useSelector((state) => state.app.modalPosition);
  const dispatch = useDispatch();
  const onCloseCallback = useSelector((state) => state.app.loginCloseCallback);

  useEffect(() => {
    window.location.pathname === "/registration"
      ? setRegistrationPageOpen(true)
      : setRegistrationPageOpen(false);
    // setPositionTop(isMobile ? "116px" : isTablet ? "172px" : "202px");
  }, [isMobile, isTablet]);

  useEffect(() => {
    setOpenBanner(
      registrationPageOpen || registrationModalIsOpen || loginModalIsOpen
    );
  }, [registrationModalIsOpen, loginModalIsOpen, registrationPageOpen]);

  // const bannerStyles = {
  //   top: `calc(${modalPosition.top}px - ${positionTop})`,
  //   left: `calc(${modalPosition.left}px)`,
  // };
  return (
    <div
      className={classNames(css.banner, { [css.banner_open]: openBaner })}
      // style={bannerStyles}
    >
      {!isTablet && (
        <div
          onClick={() => {
            dispatch(setLoginModalState(false));
            dispatch(setRegistrationModalState(false));
            if (onCloseCallback) {
              onCloseCallback()
            }
          }}
          className={css.close_modal}
        >
          <img src={close} alt="" />
        </div>
      )}
      <div>
        <img
          src={isTablet ? cash_back_tablet : cash_back}
          className={css.cash_back}
          alt=""
        />
      </div>
    </div>
  );
}
