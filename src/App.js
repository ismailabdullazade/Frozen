import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useParams,
} from "react-router-dom";
import Layout from "./containers/layout/layout";
import SignUp from "./features/user/signup/signup";
import { useAuth, ProvideAuth } from "./services/auth";
import Profile from "./features/profile/profile";
import Ranks from "./features/ranks/ranks";
import VipClub from "./features/vip-club/vip-club";
import NotFound from "./features/error/not-found";
import Wallet from "./features/wallet/wallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/loader/Loader";
import GamesLayout from "./features/games/games-layout/games-layout";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setErr500, setLoginModalState } from "./app/app.slice";
import Information from "./components/Information/information";
import { PasswordRecoveryContainer } from "./containers/password-recovery/password-recovery.container";
import EngineeringWorks from "./containers/engineering-works/engineering-works";
import MyBonus from "./features/my-bonus/my-bonus";
import PaymentResultHandle from "./features/wallet/payment-result";
import IndexGames from "./features/games/games-pages/games-index";
import useWebSocket from "./services/websocket";
import { setBalance } from "./features/user/user.slice";
import Text from "./features/footer-temp-pages/text";
import Developing from "./features/error/developing";
import Notifications from "./containers/layout/notifications/notifications";
import FreeMoney from "./features/free-money/free-money";
import GamesController from "./features/games/games-controller/games-controller";
import GameController from "./features/games/game/game-controller";

export default function AuthExample() {
  const { t, i18n } = useTranslation();
  const [engineeringWorks, setEngineeringWorks] = useState(false);
  useWebSocket();

  useEffect(() => {
    if (!window.Error) {
      window.Error = (val) => {
        setEngineeringWorks(val);
      };
    }

    return () => (window.Error = null);
  }, []);
  useSelector((state) => state.game);

  return (
    <>
      <Helmet>
        <title>{t("Site title")}</title>
        <meta name="description" content={t("metaDescription")} />
      </Helmet>
      <ToastContainer />
      {engineeringWorks ? (
        <EngineeringWorks />
      ) : (
        <Router>
          <ProvideAuth>
            <ErrorController>
              <Switch>
                <Route path={"/play-:mode/:provider/:id"} exact>
                  <Layout>
                    <GameController/>
                  </Layout>
                </Route>
                <Route
                  path={[
                    "",
                    "/games/:section/:target/:demo",
                    "/games/:section/:target",
                    "/games/:section",
                  ]}
                  end={true}
                  exact={true}
                >
                  <GamesController />
                </Route>
                <Route path={"/information/:id"} exact>
                  <Layout>
                    <Information />
                  </Layout>
                </Route>
                <Route path="/:pathname" exact>
                  <RouteController />
                </Route>

                   <PrivateRoute path={"/my-bonus/promocode"} exact={true}>
                  <Layout>
                    <MyBonus tab={"PromoCode"} />
                  </Layout>
                </PrivateRoute>
                <PrivateRoute path={"/my-bonus/history"} exact={true}>
                  <Layout>
                    <MyBonus tab={"History"} />
                  </Layout>
                </PrivateRoute>
                <PrivateRoute path={"/my-bonus/available"} exact={true}>
                  <Layout>
                    <MyBonus tab={"AvailableBonuses"} />
                  </Layout>
                </PrivateRoute>
                <PrivateRoute path={`/payments/:result`} exact={true}>
                  <PaymentResultHandle />
                </PrivateRoute>
                <PrivateRoute path={"/wallet/withdrawal"} exact={true}>
                  <Layout>
                    <Wallet tab={"Withdrawal"} />
                  </Layout>
                </PrivateRoute>
                <PrivateRoute path={"/wallet/transfer"} exact={true}>
                  <Layout>
                    <Wallet tab={"Transfer"} />
                  </Layout>
                </PrivateRoute>
                <PrivateRoute path={"/wallet/transactions"} exact={true}>
                  <Layout>
                    <Wallet tab={"Transactions"} />
                  </Layout>
                </PrivateRoute>

                <Route path={"/developing"} exact>
                  <Layout>
                    <Developing />
                  </Layout>
                </Route>
                <Route path={"*"}>
                  <Layout>
                    <NotFound />
                  </Layout>
                </Route>
              </Switch>
            </ErrorController>
            <Notifications />
          </ProvideAuth>
        </Router>
      )}
    </>
  );
}

function RouteController() {
  //для одноуровневых роутов
  const auth = useAuth();
  const { pathname } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (window.location.pathname === "/registration") {
    if (isLoading) {
      return <Loader />;
    }
    if (Boolean(auth.user)) {
      return (
        <Route path="*">
          <Layout>
            <NotFound />
          </Layout>
        </Route>
      );
    }
  }
  const pages = {
    "my-bonus": {
      private: true,
      component: (
        <Layout>
          <MyBonus />
        </Layout>
      ),
    },
    profile: {
      private: true,
      component: (
        <Layout>
          <Profile />
        </Layout>
      ),
    },
    wallet: {
      private: true,
      component: (
        <Layout>
          <Wallet />
        </Layout>
      ),
    },
    "access-restore": {
      private: false,
      component: (
        <Layout>
          <PasswordRecoveryContainer />
        </Layout>
      ),
    },
    registration: {
      private: false,
      component: (
        <Layout fullWidth={true}>
          <GamesLayout>
            <IndexGames />
            <SignUp auth={auth} />
          </GamesLayout>
        </Layout>
      ),
    },
    developing: {
      private: false,
      component: (
        <Layout>
          <Developing />
        </Layout>
      ),
    },
    ranks: {
      private: false,
      component: (
        <Layout>
          <Ranks />
        </Layout>
      ),
    },
    vip: {
      private: false,
      component: (
        <Layout>
          <VipClub />
        </Layout>
      ),
    },
    "free-money": {
      private: false,
      component: (
        <Layout>
          <FreeMoney />
        </Layout>
      ),
    },
  };

  if (pages[pathname]) {
    if (pages[pathname].private) {
      return (
        <PrivateRoute path={`/${pathname}`} exact>
          {pages[pathname].component}
        </PrivateRoute>
      );
    } else {
      return (
        <Route path={`/${pathname}`} exact>
          {pages[pathname].component}
        </Route>
      );
    }
  }

  return (
    <Route path="/:slug" exact>
      {window.location.pathname === "/demo" ||
      window.location.pathname === "/play" ? null : (
        <Layout>
          <Text />
        </Layout>
      )}
    </Route>
  );
}

function ErrorController({ children }) {
  const error500 = useSelector((state) => state.app.err500);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const unSubscribe = history.listen((e) => {
      if (error500) {
        dispatch(setErr500(false));
      }
    });

    return () => unSubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error500]);

  return children;
}

// ОБертка для  <Route> который будет редиректить на <Login/>
// Если юзер не авторизован
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  const dispatch = useDispatch();
  const websocket = useWebSocket();

  useEffect(() => {
    if (websocket?.initted && auth && auth.user) {
      window.Echo.private(`user.${auth.user.id}.wallet`).listen(
        `User\\UserBalanceChanged`,
        (data, e) => {
          console.error("Событие UserBalanceChanged:", data, e);
          dispatch(setBalance(data));
        }
      );
    }
  }, [websocket]);

  if (!auth || auth.isLoading) {
    return <Loader />;
  }

  if (auth && !auth.user && !(window.location.pathname === "/registration")) {
    dispatch(setLoginModalState(true));
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth?.user ? (
          children
        ) : (
          <>
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          </>
        )
      }
    />
  );
}
