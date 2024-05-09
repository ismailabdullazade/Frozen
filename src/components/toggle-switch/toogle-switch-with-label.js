import css from "./toogle-switch.module.css";
import classNames from "classnames";
import ToogleSwitch from "./toogle-switch";

export default function ToogleSwitchWithLabel({label, checked, error, setValue, className, disabled}) {

    return <div className={classNames(css.toggleSwitch, className)}>
        <ToogleSwitch checked={checked} setValue={setValue} disabled={disabled}/>
        <label>{label}</label>
    </div>;
}