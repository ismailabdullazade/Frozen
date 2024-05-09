import css from "./wrapper.module.css";
import ContentPane from "../../../components/content-pane/content-pane";
import React, {useEffect} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "beautiful-react-hooks";

export default function GamesWrapper({
  isUninitialized,
  isFetching,
  children,
}) {
  const { t } = useTranslation();
  const hideSidebarLeft = useSelector((state) => state.app.hideSidebarLeft);
  const isTablet = useMediaQuery("(max-width: 1280px)");

  useEffect(() => {
    if (!isFetching) {
      window.closeSplash()
    }
  }, [isFetching]);

  return (
    <>
      <div
        className={`container-2 ${hideSidebarLeft && !isTablet ? "close" : ""}`}
      >
        {children}
      </div>
      {!isUninitialized && !children && !isFetching && (
        <ContentPane className={css.has_no_items}>
          {t("Unfortunately, there are no matching games.")}
        </ContentPane>
      )}
    </>
  );
}
