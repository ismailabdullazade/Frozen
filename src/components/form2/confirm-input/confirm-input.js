import css from "./confirm-input.module.css";
import imageConfirm from "../../../images/items/button-confirm.svg";
import imageConfirmDisable from "../../../images/items/button-confirm-disable.svg";
import imageConfirmed from "../../../images/items/button-confirmed.svg";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useRef, useState} from "react";

export default function ConfirmInput ({label, onlyNum, maxLength, placeholder, className, isDisabled = false, onClick, onConfirm, min_length = 1}) {
    const {t} = useTranslation();
    const dragger = useRef();
    const container = useRef();
    const containerWidth = useMemo(() => container.current?.clientWidth);
    const active = useRef();
    const inactive = useRef();
    const [confirmed, setConfirmed] = useState();
    const listener = function(e) {
        e.stopPropagation();
       e = e || window.event;
        var start = 0, diff = 0;
        let source = e.changedTouches ? e.changedTouches[e.changedTouches.length - 1] : e;
        if( source.pageX) start = source.pageX;
        else if( source.clientX) start = source.clientX;

        // dragger.current.style.position = 'relative';
        document.onmousemove = document.ontouchmove = function(e) {
            e = e || window.event;
            let end = 0;
            let source = e.changedTouches ? e.changedTouches[e.changedTouches.length - 1] : e;
            if( source.pageX) end = source.pageX;
            else if( source.clientX) end = source.clientX;

            diff = end-start;
            if (
                diff <= container.current?.clientWidth - dragger.current.clientWidth
                && diff >= 0
            ) {
                inactive.current.style.width = container.current?.clientWidth - diff +"px";
                inactive.current.firstChild.style.left = "-" + diff+"px";
                dragger.current.style.left = diff + "px";
                active.current.style.width = diff + 10 + "px";
                dragger.current.classList.remove(css.automovement);
                active.current.classList.remove(css.automovement);
                inactive.current.classList.remove(css.automovement);
                inactive.current.firstChild.classList.remove(css.automovement);
            }
        };
        /*dragger.current.onmouseleave = */document.onmouseup = document.ontouchend = function() {
            dragger.current.classList.add(css.automovement);
            active.current.classList.add(css.automovement);
            inactive.current.classList.add(css.automovement);
            inactive.current.firstChild.classList.add(css.automovement);

            if ( diff > (container.current?.clientWidth / 1.7 - dragger.current?.clientWidth / 2)) {
                /*
                * Если юзер перетащил больше половины, то действие автоматически завершается
                * */
                setTimeout(() => {
                    //Таймаут для того, чтобы успела отработать CSS анимация перед удалением класса
                    setConfirmed(true);
                }, 300);

                dragger.current.firstChild.classList.remove(css.visible);
                dragger.current.firstChild.classList.add(css.hidden);
                dragger.current.lastChild.classList.remove(css.hidden);
                dragger.current.lastChild.classList.add(css.visible);

                inactive.current.style.width = 0 + "px";
                inactive.current.firstChild.style.left = container.current?.clientWidth + "px";
                dragger.current.style.left = container.current?.clientWidth - dragger.current.clientWidth + "px";
                active.current.style.width = container.current?.clientWidth + "px";
                // setConfirmed(true);
            } else {
                /*
                Если юзер не дотащил до середины, то действие отменяется
                * */
                setConfirmed(false);

                dragger.current.firstChild.classList.add(css.visible);
                dragger.current.firstChild.classList.remove(css.hidden);
                dragger.current.lastChild.classList.add(css.hidden);
                dragger.current.lastChild.classList.remove(css.visible);

                inactive.current.style.width = container.current?.clientWidth + "px";
                inactive.current.firstChild.style.left = 0 + "px";
                dragger.current.style.left = 0 + "px";
                active.current.style.width = 0 + "px";
            }
            document.onmousemove = document.onmouseup /*= dragger.current.onmouseleave */= document.ontouchend = document.ontouchmove = null;
        };
    }
    const [value, setValue] = useState("");

    useEffect(() => {
        if (confirmed && onConfirm) {
            onConfirm();
        }
    }, [confirmed]);

    useEffect(() => {
        if (dragger.current && container.current && !isDisabled && !confirmed) {
            dragger.current.onmousedown = dragger.current.ontouchstart = listener;
        }

        if (dragger.current && (confirmed || isDisabled)) {
            dragger.current.onmousedown = dragger.current.ontouchstart = null;
        }

        return () => {
            if (dragger.current) {
                dragger.current.onmousedown = dragger.current.ontouchstart = null;
            }
        }
    }, [containerWidth, isDisabled, confirmed]);

    return <div className={classNames(css.wrapper, className)}>
        {label && <label className={css.label}>{label}</label>}
        {/*<img src={cells} style={{position: "absolute", bottom: "0px", zIndex: 9999}}/>*/}
        <div className={css.container} ref={container}>
            <div className={css.inactive} style={{width: container.current?.clientWidth}} ref={inactive}>
                <div className={css.title} style={{width: container.current?.clientWidth}}>{t("Confirm")}</div>
            </div>
            <div className={css.active} ref={active}>
                <input
                    type="text"
                    placeholder={placeholder}
                    style={{width: container.current?.clientWidth}}
                    value={value}
                    onChange={e => {
                        if (maxLength && e.target.value.length > maxLength) {
                            return null;
                        }
                        if (onlyNum) {
                            if (!/[0-9]/.test(e.target.value) && e.target.value !== "")
                                return  null;
                        }

                        setValue(e.target.value)
                    }}
                />
            </div>
            <div
                ref={dragger}
                className={classNames(css.button, {[css.is_disabled]: isDisabled, [css.confirmed]: confirmed})}
                onClick={
                    () => {
                        if (confirmed && !isDisabled && onClick && value.length >= min_length) {
                            onClick(value);
                        }
                    }
                }
            >
                {
                    isDisabled ?
                        <img draggable={false} src={imageConfirmDisable} className={css.visible} alt=""/>
                        : <img draggable={false} src={imageConfirm} className={css.visible} alt=""/>
                }
                <img draggable={false} src={imageConfirmed} className={css.hidden} alt=""/>
            </div>
        </div>
    </div>;
}