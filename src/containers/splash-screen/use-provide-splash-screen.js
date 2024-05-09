import {createContext, useContext, useState} from "react";

const splashContext = createContext();

export function useSplashScreen () {
    return useContext(splashContext);
}

export function ProvideSplashScreen ({children}) {
    const splashScreen = useProvideSplashScreen();

    return <splashContext.Provider value={splashScreen}>
        {children}
    </splashContext.Provider>
}

function useProvideSplashScreen () {
    const [shown, setShown] = useState(true);

    const openSplash = (delay) => {
        // window.stop();
        const intDelay = parseInt(delay);

        setShown(true);

        if (delay && !isNaN(intDelay)) {
            setTimeout(() => {
                setShown(false);
            }, intDelay);
        }
    }
    const reOpen = () => {
      close();
      setTimeout(() => {
          openSplash();
      }, 1000);
    };
    const close = delay => {
        if (shown) {
            const intDelay = parseInt(delay);

            if (delay && !isNaN(intDelay)) {
                setTimeout(() => {
                    setShown(false);
                }, intDelay);
            } else {
                setShown(false);
            }
        }
    };


    return {
        shown,
        reOpen,
        openSplash,
        close
    }
}