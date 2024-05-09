import css from "./gamepad-stretchable.module.css";
import top from "../../images/gamepad/gamepad-top.png";
import bottom from "../../images/gamepad/gamepad-bottom-short.png";
import classNames from "classnames";

export default function GamepadStretchable({children, className = ""}) {


    return (
        <div className={classNames(css.gamepad, className)}>

            <div className={css.container}>
                <div className={css.top}>
                    <img src={top}/>
                </div>
                <div className={css.content}>
                    {children}
                </div>
                <div className={css.bottom}>
                    <img src={bottom}/>
                </div>
            </div>
        </div>
    );
}