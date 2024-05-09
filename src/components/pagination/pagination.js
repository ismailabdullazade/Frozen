import css from "./pagination.module.css";
import classNames from "classnames";
import { searchParams } from "../../utils/search-params";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as Left } from "./.././../images/items/arrow_left_pagination.svg";
import { ReactComponent as Right } from "./.././../images/items/arrow_right_pagination.svg";

export default function Pagination({
  lastPage,
  setPage,
  className,
  page,
  variant,
}) {
  const { t } = useTranslation();
  const Dots = () => <div className={classNames(css.page, css.dots)}>...</div>;
  const isMobile = useMediaQuery("(max-width: 620px)");
  const location = useLocation();
  const searchParameters = searchParams(location.search);
  const currentPage = parseInt(
    searchParameters.page ? searchParameters.page : 1
  );
  const history = useHistory();
  const goTo = (targetPage) => {
    history.push({
      pathname: location.pathname,
      search: "?page=" + targetPage,
    });
    setPage(targetPage);
  };
  function Pages({ count, startFrom = 0 }) {
    return new Array(count).fill("").map((i, idx) => (
      <div
        onClick={() => {
          goTo(startFrom + idx + 1);
        }}
        key={`page-${startFrom + idx}`}
        className={classNames(css.page, {
          [css.current]: startFrom + idx + 1 === currentPage,
        })}
      >
        {startFrom + idx + 1}
      </div>
    ));
  }

  useEffect(() => {
    if (parseInt(page) !== currentPage) {
      goTo(page);
    }
  }, [page]);

  return (
    <div
      className={classNames(css.pagination, className, {
        [css.wallet]: variant === "wallet",
      })}
    >
      <div className={css.pages}>
        {currentPage > 1 && (
          <div
            className={classNames(css.navigate_button, css.prev)}
            onClick={() => {
              goTo(currentPage - 1);
            }}
          >
            <Left />
          </div>
        )}
        {lastPage && (
          <div className={css.numeric_pages}>
            {lastPage < (isMobile ? 5 : 8) ? (
              <Pages count={lastPage} />
            ) : (
              <>
                {currentPage <= 3 ? (
                  <>
                    <Pages count={4} />
                    <Dots />
                    <Pages startFrom={lastPage - 1} count={1} />
                  </>
                ) : currentPage >= lastPage - 2 ? (
                  <>
                    <Pages count={1} />
                    <Dots />
                    <Pages startFrom={lastPage - 4} count={4} />
                  </>
                ) : (
                  <>
                    {!isMobile && <Pages count={1} />}
                    <Dots />
                    <Pages count={3} startFrom={currentPage - 2} />
                    <Dots />
                    {!isMobile && <Pages startFrom={lastPage - 1} count={1} />}
                  </>
                )}
              </>
            )}
          </div>
        )}
        {(!lastPage || currentPage < lastPage) && (
          <div
            className={classNames(css.navigate_button, css.next)}
            onClick={() => {
              goTo(currentPage + 1);
            }}
          >
            <Right />
          </div>
        )}
      </div>
    </div>
  );
}
