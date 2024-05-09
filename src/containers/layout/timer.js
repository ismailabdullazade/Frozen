import css from "./layout.module.css";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


function getTimeRemaining() {
    const now = new Date();
    const nextSunday = getNextSunday(now);
    const timeUntilNextSunday = nextSunday - now;
    const days = Math.floor(timeUntilNextSunday / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilNextSunday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilNextSunday % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilNextSunday % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
}
  
function getNextSunday(now) {
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7) + 1);
    nextSunday.setHours(0, 0, 0, 0);
    return nextSunday;
}

const Timer = () => {
    const { t } = useTranslation();
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

    useEffect(() => {
        const timer = setInterval(() => {
          setTimeRemaining(getTimeRemaining());
        }, 1000);
    
        return () => {
          clearInterval(timer);
        };
      }, []);

      const formatNumberWithLeadingZero = (number) => {
        return number < 10 ? `0${number}` : `${number}`;
    };

    const days = timeRemaining.days;
    const hours = timeRemaining.hours;
    const minutes = formatNumberWithLeadingZero(timeRemaining.minutes);
    const seconds = formatNumberWithLeadingZero(timeRemaining.seconds);
    const allTime = `${days}${t("d")}  ${hours}:${minutes}:${seconds}`;

    return (
        <span className={css.footer_block__time}>{allTime}</span>
    )
}

export default Timer;