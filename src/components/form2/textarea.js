import css from "./style.module.css";
import classNames from "classnames";


export default function TextArea({className, label, error, value, onChange, placeholder = ""}) {


    return (
        <div className={(classNames(css.box, className))}>
            { label && <label className={css.label}>{label}</label> }
            <div className={classNames(css.wrapper, {[css.error]: !!error})}>
                <textarea
                    placeholder={placeholder}
                    className={classNames(css.item, css.textarea)}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}