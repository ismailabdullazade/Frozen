import React, { useEffect, useRef, useState } from "react";
import css from "./scrollbar.module.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setValuesScroll } from "../../app/app.slice";

const scrollContainerClassName = "scroll-container";

export function returnScrollPosition() {
  const scrollPos = localStorage.getItem("scrollPosition");
  const scrollContainer = document.querySelector(
    `.${scrollContainerClassName}`
  );

  if (scrollContainer && scrollPos) {
    scrollContainer.scrollTop = scrollPos;
    localStorage.removeItem("scrollPosition");
  }
}

export default function Scrollbar({
  children,
  onScroll = () => {},
  className,
  style,
  autoHide = true,
  id,
  classNameTrack,
  refLink,
}) {
  const scrollbar = useRef();
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(history?.location?.pathname);
  const dispatch = useDispatch();

  function renderThumb({ style, ...props }) {
    return <div style={{ ...style }} {...props} className={css.thumb} />;
  }

  function renderTrack({ style, ...props }) {
    return (
      <div
        style={{ ...style }}
        {...props}
        className={classNames(css.track, classNameTrack)}
      />
    );
  }

  function renderView({ style, ...props }) {
    return (
      <div
        style={{ ...style }}
        {...props}
        className={scrollContainerClassName}
      />
    );
  }

  useEffect(() => {
    if (history?.location?.pathname !== currentPage) {
      setCurrentPage(history?.location?.pathname);
    }
  }, [history?.location?.pathname]);

  return (
    <Scrollbars
      onScroll={onScroll}
      style={style}
      ref={refLink ? refLink : scrollbar}
      className={className}
      renderView={renderView}
      renderTrackHorizontal={renderTrack}
      renderTrackVertical={renderTrack}
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      autoHide={autoHide}
      id={id}
      onScrollFrame={(values) => {
        dispatch(setValuesScroll(values));
      }}
    >
      {children}
    </Scrollbars>
  );
}
