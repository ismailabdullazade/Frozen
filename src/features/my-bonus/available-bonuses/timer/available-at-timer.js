import React, { useState, useEffect } from "react";
import moment from "moment";
import css from "./available-at-timer.module.css";
import { useTranslation } from "react-i18next";

const TimerComponent = ({ dateString }) => {
  const [dateTimeDifference, setDateTimeDifference] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutese] = useState(0);
  let timeoutId;
  const { t } = useTranslation();

  useEffect(() => {
    const updateDateTimeDifference = () => {
      const currentDate = moment();
      const targetDate = moment.utc(dateString).local();
      const duration = moment.duration(targetDate.diff(currentDate));

      const days = duration.days();
      const hours = duration.hours();
      const minutes = duration.minutes();

      const differenceString = `${days}:${hours}:${minutes}`;
      setDateTimeDifference(formatTimer(differenceString));

      const secondsUntilNextMinute = 60 - moment().seconds(); // Вычисляем количество секунд до следующей минуты
      timeoutId = setTimeout(
        updateDateTimeDifference,
        secondsUntilNextMinute * 1000
      ); // Обновляем разницу в начале следующей минуты
    };

    const formatTimer = (dateTimeDifference) => {
      const [hours, minutes, seconds] = dateTimeDifference.split(":");
      const formattedHours = hours ? hours.padStart(2, "0") : "00";
      const formattedMinutes = minutes ? minutes.padStart(2, "0") : "00";
      const formattedSeconds = seconds ? seconds.padStart(2, "0") : "00";
      return (
        setDays(formattedHours),
        setHours(formattedMinutes),
        setMinutese(formattedSeconds)
      );
    };

    updateDateTimeDifference(); // Вызываем функцию сразу для первоначального значения

    return () => {
      clearTimeout(timeoutId); // Очищаем таймер при размонтировании компонента
    };
  }, [dateString]);
  // return <></>
  return (
    <>
      <div className={css.text}>{t(`Will be available at`)}</div>
      <div className={css.container}>
        <div className={css.container_dataTime}>
          <span>{days}</span>
          <span>{hours}</span>
          <span>{minutes}</span>
        </div>
        <div className={css.container_day}>
          <span>{t("day timer")}</span>
          <span>{t("hour timer")}</span>
          <span>{t("minutes timer")}</span>
        </div>
      </div>
    </>
  );
};

export default TimerComponent;
