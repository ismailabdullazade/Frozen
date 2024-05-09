import css from "./toogle-switch.module.css";
import classNames from "classnames";
import {useEffect, useRef, useState} from "react";

export default function ToogleSwitch({checked, error, setValue, disabled}) {
    const ref = useRef()
    /*const [lastX, setLastX] = useState();
    const touchmove = (e, lastX) => {
        let currentX;
        let direction;

        currentX = e.touches ? e.touches[0].clientX : e.clientX;

        if (currentX > lastX) {
            direction = 1;
        } else if (currentX < lastX) {
            direction = -1;
        }
        setLastX(currentX + 2)

        lastX && console.log(currentX, lastX, direction)
        if (lastX) {
            if (direction > 0) {
                setValue(true)
            } else {
                setValue(false)
            }
        }
    }

    useEffect(() => {
        const moveHandler = e => touchmove(e, lastX)
        const startListener = function (e) {
            setLastX(null)
            ref.current.addEventListener('mousemove', moveHandler)
            ref.current.addEventListener('touchmove', moveHandler)
        }
        const endListener = function (e) {
            ref.current.removeEventListener('mousemove', moveHandler)
            ref.current.removeEventListener('touchmove', moveHandler)
        }
        if (ref.current){
            ref.current.addEventListener('mousedown', startListener)
            ref.current.addEventListener('touchstart', startListener)

            ref.current.addEventListener('mouseup', endListener)
            ref.current.addEventListener('touchend', endListener)
        }
    }, [ref])*/

    return <div
        className={css.wrapper}
        onClick={disabled ? null : () => setValue(!checked)}
        ref={ref}
    >
        <div className={classNames(css.wrapperInner, {[css.error]: error})}>
            <div className={classNames(css.switcherContainer, {[css.active]: checked, [css.disabled]: disabled})}>
                <div className={classNames(css.switcher, css.default, {[css.active]: !checked})}></div>
                <div className={classNames(css.switcher, css.checked, {[css.active]: checked})}></div>
            </div>
        </div>
    </div>;
}