import { useState } from "react";

import Pusher from "pusher-js";
import Echo from "laravel-echo";

export default function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const token = localStorage.getItem("access_token");
  const key = process.env.REACT_APP_BC_KEY;
  const secret = process.env.REACT_APP_BC_SECRET;
  const wsHost =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_BC_WS_HOST
      : window.location.host;
  const port = process.env.REACT_APP_BC_WS_PORT || "443";
  const cluster = process.env.REACT_APP_BC_CLUSTER || "mt1";

  if (!key || !secret) {
    return null;
  }

  if (token && !connected) {
    window.Pusher = Pusher;

    window.Echo = new Echo({
      broadcaster: "pusher",
      key,
      wsHost: wsHost,
      wsPort: port,
      wssport: port,
      secret,
      cluster,
      transports: ["websocket"],
      enabledTransports: ["ws", "wss"],
      forceTLS: false,
      disableStats: true,
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            fetch(`https://${wsHost}/broadcasting/auth`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                callback(false, data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
    });

    window.Echo.connector.pusher.connection.bind("connected", () =>
      setConnected(true),
    );
  }

  return {
    initted: connected,
  };
}
