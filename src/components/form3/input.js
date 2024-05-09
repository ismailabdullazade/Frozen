import css from "./style.module.css";
import classNames from "classnames";
import eye from "../../images/items/eye.svg";
import eyeCrossed from "../../images/items/eye-cross.svg";
import React, { useRef, useState } from "react";
import Dropdown from "../dropdown/dropdown";

export default function Input({
  isSearch = false,
  className,
  name,
  label,
  id,
  defaultValue,
  type = "text",
  passwordVisibleFirst = false,
  error,
  onBlur = () => {},
  loading,
  value,
  onFocus = () => {},
  autoComplete = "off",
  onChange = () => {},
  placeholder = "",
  autoFocus = false,
  onKeyDown = () => {},
  maxLength,
  style = {},
  disabled,
  icon,
  nullable = true,
  readOnly = false,
  refLink,
  wrapperClassName,
  datepickerId,
  variant,
}) {
  const conditionally = {};
  const adv = {};
  const [usedType, setType] = useState(
    type === "password" && passwordVisibleFirst ? "text" : type
  );
  const [opened, setOpened] = useState();
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  if (id && type === "date") {
    conditionally.id = id;
  }
  if (defaultValue) {
    conditionally.defaultValue = defaultValue;
  } else {
    conditionally.value = value || "";
  }

  if (refLink) {
    conditionally.ref = refLink;
  }

  return (
    <div
      className={classNames(css.box, className)}
      style={style}
      ref={wrapperRef}
    >
      {label && <label className={css.label}>{label}</label>}
      <div
        className={classNames(
          css.wrapper,
          {
            [css.error]: !!error,
            [css.search]: isSearch,
            [css.focused]: isFocused,
            [css.date]: type === "date",
            [css.loading]: isSearch && loading,
            [css.disabled]: disabled,
          },
          wrapperClassName,
          css[variant]
        )}
        {...adv}
      >
        <input
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          onFocus={() => {
            setIsFocused(true);
            onFocus();
          }}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          type={type === "date" ? "text" : usedType}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur(e);
          }}
          className={css.item}
          onChange={(e) => {
            if (type === "password") {
              e.target.value.length <= 32 && onChange(e.target.value);
            } else {
              onChange(e.target.value);
            }
          }}
          onClick={() => {
            if (type === "date") {
              setOpened(!opened);
            }
          }}
          {...conditionally}
        />
        <div className={css.slice} />
        {type === "date" && value && nullable && (
          <div
            className={classNames(css.clear, css.date_icon)}
            onClick={() => onChange({ date: null })}
          />
        )}
        {type === "date" && (!value || !nullable) && (
          <div
            className={classNames(css.calendar, css.date_icon)}
            onClick={(e) => {
              e.stopPropagation();
              setOpened(!opened);
              if (opened) {
                wrapperRef?.current.querySelector("input").blur();
              } else {
                wrapperRef?.current.querySelector("input").focus();
              }
            }}
          />
        )}
        {icon && <div className={css.icon}>{icon}</div>}
        {type === "password" && (
          <img
            className={css.eye_marker}
            src={usedType === "password" ? eyeCrossed : eye}
            onClick={() =>
              setType(usedType === "password" ? "text" : "password")
            }
            alt=""
          />
        )}
        {type === "date" && (
          <Dropdown
            setExpanded={setOpened}
            expanded={!disabled ? opened : ""}
            className={css.datepicker__container}
          >
            <div id={datepickerId} />
          </Dropdown>
        )}
      </div>
    </div>
  );
}
