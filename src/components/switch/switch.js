import classNames from "classnames";
import css from "./switch.module.css"
import React from "react";

export default function Switch({a = () => {}, b = () => {}, className}) {

    return <div className={classNames(css.wrapper, className)}>
        <div className={css.container}>
            <div
                className={classNames(css.control, {[css.active]: a.active})}
                onClick={a.onClick}
            >
                <div className={css.background}/>
                <span>{a.text}</span>
            </div>
            <div
                className={classNames(css.control,{[css.active]: b.active})}
                onClick={b.onClick}
            >
                <div className={css.background}/>
                <span>{b.text}</span>
            </div>
        </div>
    </div>
}