import {GAMES_LIST_OUR_PLAYING} from "../config";
import {setGame} from "../game.slice";
import {setLoginModalState} from "../../../app/app.slice";

export default function actionHandler(type, identifier, provider, currentPage, dispatch, isMobile, auth, history, deviceInfo) {

        if (auth) {
            switch (type) {
                case "demo": {
                    if (isMobile) {
                        if (!GAMES_LIST_OUR_PLAYING.includes(provider)) {
                            localStorage.setItem("pageSection", currentPage);
                        }
                        const scrollContainer = document.querySelector(".scroll-container");
                        if (scrollContainer) {
                            localStorage.setItem("scrollPosition", scrollContainer.scrollTop);
                        }

                    }
                    dispatch(setGame({id: identifier, provider, mode: "demo"}));

                    break;
                }
                case "play": {
                    if (!auth.user) {
                          dispatch(setLoginModalState(true));
                    } else {
                        if (isMobile) {
                            if (!GAMES_LIST_OUR_PLAYING.includes(provider)) {
                                localStorage.setItem("pageSection", currentPage);
                            }
                            const scrollContainer = document.querySelector(".scroll-container");
                            if (scrollContainer) {
                                localStorage.setItem("scrollPosition", scrollContainer.scrollTop);
                            }
                        }
                        dispatch(setGame({id: identifier, provider, mode: "play"}));
                    }

                    break;
                }
                default: {

                }
            }
        }

    }