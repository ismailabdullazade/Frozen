import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./toastify.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { extendNumber } from "./utils/numerals";
import "./search-params";
import * as Sentry from "@sentry/react";

extendNumber();

const root = ReactDOM.createRoot(document.getElementById("root"));
const enableSentry =
  process.env.REACT_APP_SENTRY_ENABLED?.toLowerCase() === "true";
(process.env.NODE_ENV === "development" ||
  window.location.host === "gc202201.com") &&
  console.log(store);

enableSentry && Sentry.init({
  dsn: "https://73ace614504c30c7bee9b8473b12d3aa@o4504463634923520.ingest.sentry.io/4505821829332992",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", "https:yourserver.io/api/"],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  release: "1.0",
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  enabled: enableSentry,
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
