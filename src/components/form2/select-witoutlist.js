import classNames from "classnames";
import css from "./select.module.css";
import dropdownTriangle from "../../images/items/select-triangle.svg";
import {useRef} from "react";
import useOnClickOutside from "../../utils/click-outside";

export default function SelectWithoutList ({...properties}) {
    const {
        value,
        className,
        label,
        itemClass,
        placeholder = " ",
        onClick,
        opened
    } = properties;
    const ref = useRef();

    // useOnClickOutside(ref, () => {
    //      if (opened) {
    //          onClick();
    //      }
    // });

    return (
        <div className={(classNames(css.box, className))} ref={ref}>
            { label && <label className={css.label}>{label}</label> }
            <div
                className={classNames(css.wrapper, css.without_list)}
                onClick={onClick}
            >
                <div className={classNames(css.item, itemClass)}>
                    {value ? value.label : placeholder}
                </div>
                <img className={classNames(css.toggler, {[css.opened]: opened})} src={dropdownTriangle} alt=""/>
            </div>
        </div>
    );
}