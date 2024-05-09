import css from "./notifications.module.css";
import cross from "../../../images/cross-lightgrey-7x7.svg";
import classNames from "classnames";
import { useDeleteUserNotificationMutation } from "../../../app/api/user.api";
import { useAuth } from "../../../services/auth";
import { useEffect, useRef, useState } from "react";
import { NOTIFICATION_STATUSES } from "./notifications";

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export default function NotificationCard(props) {
  const {
    notification: card,
    onClick = () => {},
    deleteCallback = () => {},
    readCallback = () => {},
    listIsOpened,
  } = props;
  const [destroyNotification, { data }] = useDeleteUserNotificationMutation();
  const auth = useAuth();
  const cardRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutRead, setTimeoutRead] = useState();
  const [io, setIO] = useState();

  // useEffect(() => {
  //   if (data) {
  //     deleteCallback(card);
  //   }
  // }, [data]);

  useEffect(() => {
    if (cardRef?.current && listIsOpened) {
      setIO(
        new IntersectionObserver(
          (entries) => {
            setIsVisible(entries[0].isIntersecting);
          },
          {
            threshold: 1,
          },
        ),
      );
    } else {
      if (io && cardRef?.current) {
        io.unobserve(cardRef?.current);
        setIsVisible(false);
        setIO(null);
      }
    }
  }, [cardRef?.current, listIsOpened]);

  useEffect(() => {
    if (io) {
      io.observe(cardRef?.current);
    }
  }, [io]);

  useEffect(() => {
    if (isVisible && card.status === NOTIFICATION_STATUSES[0]) {
      setTimeoutRead(
        setTimeout(() => {
          readCallback(card);
          setTimeoutRead(null);
        }, [2000]),
      );
    }
    if (!isVisible && timeoutRead) {
      clearTimeout(timeoutRead);
    }

    return () => timeoutRead && clearTimeout(timeoutRead);
  }, [isVisible, listIsOpened]);

  useEffect(() => {
    if (card.status === NOTIFICATION_STATUSES[1] && timeoutRead) {
      clearTimeout(timeoutRead);
    }
  }, [card?.status]);

  useEffect(() => {
    if (!listIsOpened && timeoutRead) {
      setIsVisible(false);
      clearTimeout(timeoutRead);
    }
  }, [listIsOpened]);

  if (!card) {
    return <></>;
  }

  return (
    <div
      className={classNames(css.sub_post, {
        [css.new]: card.status === NOTIFICATION_STATUSES[0],
      })}
      onClick={onClick}
      ref={cardRef}
    >
      <div className={css.sub_post__wrapper}>
        <div className={css.sub_post__container}>
          <div
            className={css.sub_post__destroy}
            onClick={() => {
              deleteCallback(card);
              destroyNotification({
                user_id: auth.user.id,
                notification_id: card.id,
              });
            }}
          >
            <img src={cross} alt="" />
          </div>
          {card.be_delivered && (
            <div className={css.sub_post__date}>{card.be_delivered}</div>
          )}
          <div style={{display: "none"}}>{card.id}</div>
          {card.title && (
            <div className={css.sub_post__title}>{card.title}</div>
          )}
          {card.message && (
            <div className={css.sub_post__message} dangerouslySetInnerHTML={{__html: card.message}}/>
          )}
        </div>
      </div>
    </div>
  );
}
