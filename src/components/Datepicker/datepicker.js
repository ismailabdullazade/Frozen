import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import React, { useEffect, useRef, useMemo } from "react";
import Input from "../form3/input";
import classNames from "classnames";
import css from "./datepicker.module.css";
import "./style.css";
import { useMediaQuery } from "beautiful-react-hooks";
import moment from "moment";
import localeEn from "air-datepicker/locale/en";
import localeRu from "air-datepicker/locale/ru";
import "moment/locale/ru";
import { useTranslation } from "react-i18next";

export default function Datepicker({ config, id, ...props }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { i18n, t } = useTranslation();
  const input = useRef();
  let lang =
    moment.locale(i18n.resolvedLanguage) === "en" ? localeEn : localeRu;
  const date = useMemo(() => {
    if (!props.value) {
      return "";
    }
    if (typeof props.value === "string" /*&& props.value.length*/) {
      return props.value;
    }

    return moment(props.value).format(t("date format"));
    // eslint-disable-next-line
  }, [props?.value]);

  moment.locale(i18n.resolvedLanguage);

  useEffect(() => {
    const datepicker = new AirDatepicker("#" + id, {
      multipleDatesSeparator: config.multipleDatesSeparator
        ? config.multipleDatesSeparator
        : " - ",
      ...config,
      inline: true,
      locale: lang,
      selectedDates: [props.value],
      classes: "garilla-datepicker",
      onSelect: (e) => {
        typeof props.onChange === "function" && props.onChange(e);

        if (config.range && e?.date?.length === 2) {
          input?.current.click();
        } else if (!config.range) {
          input?.current.click();
        }
      },
      isMobile,
      // visible: true
    });

    return () => {
      try {
        datepicker?.destroy();
      } catch (e) {
        console.error(e);
      }
    };
    // eslint-disable-next-line
  }, []);

  if (!id) {
    console.error("ID not set");
    return null;
  }

  return (
    <>
      <Input
        datepickerId={id}
        readOnly
        refLink={input}
        nullable={props.nullable}
        type={"date"}
        label={props.label}
        value={date}
        className={classNames(props.className, css.input)}
        placeholder={props.placeholder}
        onChange={props.onChange}
        disabled={props.disabled}
      />
    </>
  );
}
