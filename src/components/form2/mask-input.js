import { useIMask } from "react-imask";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import css from "./style.module.css";

export default function MaskInput({
  label,
  className,
  style,
  error,
  disabled,
  wrapperClassName,
  readOnly,
  autoFocus,
  onFocus = () => {},
  name,
  defaultValue = "",
  autoComplete = "off",
  placeholder,
  onBlur = () => {},
  icon,
  scale = 2,
  value,
  onChange = () => {},
}) {
  const [opts, setOpts] = useState({
    mask: Number,
    scale,
    thousandsSeparator: " ",
    radix: ".",
    value:
      typeof defaultValue === "string" ? defaultValue : defaultValue.toString(),
  });

  const {
    ref,
    maskRef,
    value: val,
    setValue,
    unmaskedValue,
    setUnmaskedValue,
    typedValue,
    setTypedValue,
  } = useIMask(opts, {
    /*onAccept, onComplete */
  });

  useEffect(() => {
    onChange(unmaskedValue);
  }, [val]);

  useEffect(() => {
    if (ref.current && ref.current.value != defaultValue) {
      ref.current.value = defaultValue;
    }

    if (ref.current && unmaskedValue != defaultValue) {
      // setValue(defaultValue);
      // ref.current.value = defaultValue;
    }

    if (defaultValue !== unmaskedValue && ref.current) {
    }
  }, [defaultValue]);

  return (
    <div className={classNames(css.box, className)} style={style}>
      {label && <label className={css.label}>{label}</label>}
      <div
        className={classNames(
          css.wrapper,
          {
            [css.error]: !!error,
            [css.disabled]: disabled,
          },
          wrapperClassName
        )}
      >
        <input
          ref={ref}
          readOnly={readOnly}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={onFocus}
          name={name}
          defaultValue={val}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onBlur={onBlur}
          className={css.item}
        />
        <div className={css.slice} />
        {icon && <div className={css.icon}>{icon}</div>}
      </div>
    </div>
  );
}
