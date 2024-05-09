import { useEffect, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import css from "./modal.module.css";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import Scrollbar from "../scrollbar/scrollbar";
import crossIcon from "../../images/cross-white.svg";
import { useMediaQuery } from "beautiful-react-hooks";
import ModalPane from "./modal.multilayer";
import { useDispatch } from "react-redux";
import { setModalPosition } from "../../app/app.slice";

export default function Modal(props) {
  const modal = useRef();
  let {
    children,
    isOpen,
    closeOnRouting = true,
    closeModal: closeModalCallback = () => {},
    modalClassName,
    overlayClassName,
    theme = "gamepad",
    customBody,
    modalTitle = "",
    bannerComponent,
  } = props;
  const isMobile = useMediaQuery("(max-width: 50px)");
  let portal = document.getElementById("modal");
  const dispatch = useDispatch();

  if (theme === "multi" && !isMobile) {
    theme = "gamepad";
  }

  if (!portal) {
    portal = document.createElement("div");
    portal.id = "modal";
    document.body.prepend(portal);
  }
  const closeModal = (e) => {
    e.stopPropagation();
    // if (theme === "log") {
    //     return
    // };
    // const overlay = e.target;
    // overlay?.classList.remove(css.opened);
    // overlay?.classList.add(css.closed);
    // setTimeout(() => {
    //     closeModalCallback();
    // }, 600);
  };

  useLayoutEffect(() => {
    const updateModalPosition = () => {
      if (modal?.current) {
        const rect = modal?.current.getBoundingClientRect();
        dispatch(setModalPosition({ top: rect.top, left: rect.left }));
      }
    };

    window.addEventListener("resize", updateModalPosition);

    setTimeout(updateModalPosition, 700);

    return () => {
      window.removeEventListener("resize", updateModalPosition);
    };
  }, [isOpen]);

  const portalContent = isOpen ? (
    <div
      className={classNames(
        css.overlay,
        {
          [css.opened]: isOpen,
          [css.bonus]: theme === "bonus",
        },
        css[theme],
        overlayClassName
      )}
      onClick={closeModal}
    >
      {customBody ? (
        customBody
      ) : (
        <>
          <div
            className={classNames(css.modal, modalClassName, css[theme])}
            onClick={(event) => event.stopPropagation()}
            ref={modal}
          >
            {theme === "light_flex" ? (
              <div className={css.flex_container}>
                <div className={css.flex_container__header}>
                  <span>{modalTitle}</span>
                  <span
                    onClick={closeModalCallback}
                    style={{ cursor: "pointer" }}
                  >
                    <img className={css.close} src={crossIcon} alt="" />
                  </span>
                </div>
                <div className={css.flex_container__body}>
                  <Scrollbar>
                    <div className={css.flex_container__content}>
                      {children}
                    </div>
                  </Scrollbar>
                </div>
              </div>
            ) : isMobile && theme === "multi" ? (
              <ModalPane>{children}</ModalPane>
            ) : (
              <div className={css.container}>
                <div className={css.content}>{children}</div>
                <div className={css.modal_boder} />
                <div className={css.modal_boder__one} />
              </div>
            )}
          </div>
          {theme === "log" && bannerComponent}
        </>
      )}
    </div>
  ) : null;
  const history = useHistory();

  useEffect(() => {
    // Скрыть модальное окно, если произошел переход на другую страницу
    const unlisten = history.listen(() => {
      if (closeOnRouting) {
        closeModalCallback();
      }
    });

    return () => {
      unlisten();
    };
  }, []);

  return ReactDOM.createPortal(portalContent, portal);
}
