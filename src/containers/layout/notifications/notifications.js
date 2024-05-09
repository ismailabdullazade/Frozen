import { useEffect, useMemo, useRef, useState } from "react";
import css from "./notifications.module.css";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import NotificationCard from "./notification-card";
import useOnClickOutside from "../../../utils/click-outside";
import { useDispatch, useSelector } from "react-redux";
import { setOpenNotification } from "../../../app/app.slice";
import Scrollbar from "../../../components/scrollbar/scrollbar";
import { useAuth } from "../../../services/auth";
import useWebSocket from "../../../services/websocket";
import {
  useGetUserNotificationQuery,
  useReadUserNotificationMutation,
} from "../../../app/api/user.api";
import moment from "moment";

export const NOTIFICATION_STATUSES = {
  0: "new",
  1: "shown",
};

function mapNotification(notification) {
  if (notification.mapped) {
    return notification;
  }
  if (notification) {
    const date = moment(notification.pivot.created_at);
    const isToday = date.isSame(new Date(), "day");

    return {
      id: notification.id,
      be_delivered: date.format(isToday ? "HH:mm" : "DD.MM.YYYY HH:mm"),
      be_delivered_unix: date.unix(),
      title: notification.body?.title,
      message: notification.body?.message,
      status: notification.pivot
        ? NOTIFICATION_STATUSES[notification.pivot.is_read]
        : null,
      mapped: true,
    };
  }

  return {
    id: undefined,
    be_delivered: "",
    be_delivered_unix: 0,
    title: "",
    message: "",
    status: "",
    mapped: true,
  };
}

export default function Notifications() {
  const websocket = useWebSocket();
  let auth = useAuth();
  const { t } = useTranslation();
  const list = useRef();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const openNotification = useSelector((state) => state.app.openNotification);
  const { data } = useGetUserNotificationQuery(auth?.user?.id, {
    skip: !auth?.user,
  });
  const [readNotification, { data: readNotiData }] =
    useReadUserNotificationMutation();
  const deleteCallback = (notification) => {
    setNotifications(notifications.filter((n) => n.id !== notification.id));
  };
  const readCallback = (notification) => {
    readNotification({
      user_id: auth.user.id,
      notification_id: notification.id,
    });
    setNotifications([
      ...notifications.map((n) => {
        if (n.id === notification.id) {
          n.status = NOTIFICATION_STATUSES[1];
        }

        return n;
      }),
    ]);
  };
  const newNotifications = useMemo(
    () => notifications.filter((n) => n.status === NOTIFICATION_STATUSES[0]),
    [notifications],
  );
  const readAll = () => newNotifications.forEach((n) => readCallback(n));

  useEffect(() => {
    if (readNotiData) {
      // console.log(readNotiData);
      //{"message":"ok"}
      // ДОбавить сюда инвалидацию запроса списка?
    }
  }, [readNotiData]);

  useEffect(() => {
    if (data?.data) {
      setNotifications([
        ...notifications,
        ...data.data
          .filter(
            (notification) =>
              !notifications.find((n) => n.id === notification.id),
          )
          .map(mapNotification),
      ]);
    }
  }, [data]);

  useEffect(() => {
    if (websocket?.initted && auth && auth.user) {
      window.Echo.private(`user.${auth.user.id}.notification`).listen(
        `.user.notification`,
        (data, e) => {
          console.log("Событие из канала user.notification:", data, e);
          setNotifications([mapNotification(data), ...notifications]);
        },
      );
    }
  }, [websocket, auth]);

  useOnClickOutside(list, (event) => {
    if (event.target.getAttribute("data-custom-attribute") === "notification") {
      return;
    }
    if (openNotification) {
      dispatch(setOpenNotification(false));
    }
  });

  useEffect(() => {
    const button = document.querySelector(
      "[data-custom-attribute='notification'] > *",
    );
    if (button) {
      if (newNotifications.length) {
        button.classList.add("notif_ring");
      } else {
        button.classList.remove("notif_ring");
      }
    }
  }, [notifications, openNotification]);

  return (
    <div className={css.menu} ref={list}>
      <div className={css.sub_container}>
        <div
          className={classNames(css.sub, css.sub_overflow__x, {
            [css.sub_hiden]: !openNotification,
          })}
        >
          <div className={css.sub_read} onClick={readAll}>
            {t("mark all read")}
          </div>
          <div className={css.sub_scroll__wrapper}>
            {/*{openNotification && (*/}
            <Scrollbar className={css.sub_scroll}>
              {notifications.length ? (
                <div className={css.sub__list}>
                  {notifications
                    // .sort((a, b) => {
                    //   if (a.be_delivered_unix < b.be_delivered_unix) return -1;
                    //   if (a.be_delivered_unix > b.be_delivered_unix) return 1;
                    //   return 0;
                    // })
                    .map((card) => (
                      <NotificationCard
                        listIsOpened={openNotification}
                        key={`notification-${card.id}`}
                        notification={card}
                        deleteCallback={deleteCallback}
                        readCallback={readCallback}
                      />
                    ))}
                </div>
              ) : (
                <div className={css.sub_read}>{t("no notifications")}</div>
              )}
            </Scrollbar>
            {/*)}*/}
          </div>
        </div>
      </div>
    </div>
  );
}
