import { configureStore } from '@reduxjs/toolkit'
import {userApi} from "./api/user.api";
import {setupListeners} from "@reduxjs/toolkit/query";
import {gamesApi} from "./api/games.api";
import gameSlice from "../features/games/game.slice";
import appSlice from "./app.slice";
import userSlice from "../features/user/user.slice";
import timerSlice from "../components/timer/timer.slice";
import {walletApi} from "./api/wallet.api";
import {bonusApi} from "./api/bonus.api";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [gamesApi.reducerPath]: gamesApi.reducer,
        [walletApi.reducerPath]: walletApi.reducer,
        [bonusApi.reducerPath]: bonusApi.reducer,
        game: gameSlice,
        app: appSlice,
        user: userSlice,
        timers: timerSlice
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false}).concat(userApi.middleware, gamesApi.middleware, walletApi.middleware, bonusApi.middleware)
})

setupListeners(store.dispatch);