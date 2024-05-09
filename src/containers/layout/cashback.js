import React, { useEffect, useState} from 'react';
import css from "./layout.module.css";
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import footer_cashback from "./../../images/header/left-menu/footer_cashback.svg";
import Timer from './timer';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import {ReactComponent as Line} from './../../images/header/left-menu/filling_progress_line.svg'
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

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

function getProgressPercentage(elapsedTime, totalDuration) {
  const progress = Math.ceil((elapsedTime * 100) / totalDuration);
  return progress;
}

const Cashback = ({variant}) => {
  const { t } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
  const [progress, setProgress] = useState(0);
  const isMobile = useMediaQuery("(max-width: 960px)");


  useEffect(() => {
    const totalDuration = 7 * 24 * 60 * 60 * 1000;
  
    const updateProgress = () => {
      const elapsedTime =
        timeRemaining.days * 24 * 60 * 60 * 1000 +
        timeRemaining.hours * 60 * 60 * 1000 +
        timeRemaining.minutes * 60 * 1000 +
        timeRemaining.seconds * 1000;
  
      const newProgressPercentage = getProgressPercentage(elapsedTime, totalDuration);
      if (newProgressPercentage !== progress) {
        setProgress(newProgressPercentage);
      }
    };
  
    updateProgress();
  
  }, []);

  return (
    <div className={classNames(css.footer_cashback, css[variant], {[css.background_block]: !isMobile})}>
      <div className={css.footer_block}>
          <span className={css.footer_blok__title}>{t("cashback")}</span>
        <Timer />
      </div>
      <div className={css.footer_progressLine}>
        <div className={css.footer_progressLine__filling} style={{"width": `${progress}%`}} ></div>
        <Line className={css.line} progress={progress} />
      </div>
      <img src={footer_cashback} className={css.footer_cashback__img} alt="" />
    </div>
  );
};

export default Cashback;