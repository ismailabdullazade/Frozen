import css from "./footer.module.css";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import FooterMain from "./main/main";
import { useSelector } from "react-redux";
import { useMediaQuery } from "beautiful-react-hooks";

export default function Footer() {
  const { t } = useTranslation();
  const hideSidebarLeft = useSelector((state) => state.app.hideSidebarLeft);
  const isTablet = useMediaQuery("(max-width: 1280px)");

  return (
    <footer
      className={classNames(css.footer, {
        [css.close]: hideSidebarLeft && !isTablet,
      })}
    >
      <FooterMain />
      <div className={classNames(css.copyright_info)}>
        <div className={classNames(css.container, css.copyright_info__text)}>
          {t("copyright_info", { currentYear: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
