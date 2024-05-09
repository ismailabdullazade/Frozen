import css from "./gamepad.module.css";
import gamepad from "../../images/gamepad-short.png";
import {useEffect, useRef, useState} from "react";
import Loader from "../loader/Loader";
import classNames from "classnames";

export default function Gamepad({children, className}) {
    const [isLoaded, setIsLoaded] = useState(true);

    return (
        <div className={classNames(css.gamepad, className)}>
            <div className={css.container}>
                {
                    isLoaded ?
                    <>
                        <img src={gamepad} alt="" className={css.background} onLoad={() => setIsLoaded(true)}/>
                        <div className={css.content}>
                            {children}
                        </div>
                    </>
                        : <Loader/>
                }
            </div>
        </div>
    );
}