import {useRef, useState} from "react";
import useOnClickOutside from "../../utils/click-outside";
import classNames from "classnames";
import css from "./tooltip.module.css";

export default function Tooltip({children, tooltipIsOpen, setIsOpen, opener, className, tooltipClassName}) {
    const ref = useRef();

    useOnClickOutside(ref, () => setIsOpen(false));

    return <div ref={ref} className={className}>
        {opener}
        <div
            className={
                classNames(css.tooltip, {
                    [css.visible]: tooltipIsOpen,
                    [css.invisible]: !tooltipIsOpen
                }, tooltipClassName)
            }
        >
            {children}
        </div>
    </div>;
}