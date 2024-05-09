import useOnClickOutside from "../../utils/click-outside";
import styles from "./dropdown.module.css";
import classNames from "classnames";
import {useRef} from "react";

export default function Dropdown({children, className, expanded, setExpanded = () => {}, closeBtn, title}) {
    const ref = useRef();
    useOnClickOutside(ref, () => setExpanded(false));

    return (
        <div
            className={classNames(styles.months_list,  {[styles.hidden]: !expanded}, className)}
            onClick={e => e.stopPropagation()}
            ref={ref}
        >
            {
                closeBtn && <span onClick={() => setExpanded(false)}><b>X</b></span>
            }
            {
                title && <div className={styles.title}>{title}</div>
            }
            {
                children
            }
        </div>
    );
}