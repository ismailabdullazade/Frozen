import {useSplashScreen} from "./use-provide-splash-screen";
import css from "./splash-screen.module.css";
import logo from "../../images/logo.png";
import classNames from "classnames";
import {useHistory, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

export default function SplashScreen({children}) {
    const splashScreen = useSplashScreen();
    const history = useHistory();
    const [inited, setInited] = useState(false);
    const  loc = useLocation()

    const unSubscribe = history.listen(e => {

        splashScreen.openSplash();
        // setInited(true)
    });
    useEffect(() => {


        return () => unSubscribe();
    }, []);

    return (
        <>
            {/*<div className={classNames(css.splash, {[css.visible]: splashScreen.shown})}>*/}
            <div className={classNames(css.splash)}>
                <img src={"../../src/images/cashback_background.png"} alt="" />
                <div className={css.wrapper}>
                    <div className={css.container}>
                        <img src={logo} className={css.logo}/>
                    </div>
                </div>
            </div>
            {  children }
        </>
    )
}