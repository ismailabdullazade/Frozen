import classNames from "classnames";
import styles from "./button.2.module.css";

export default function Button({
                                   disabled = false,
                                   variant = "gold",
                                   children,
                                   referal,
                                   className,
                                   type = "button",
                                   onClick = () => {},
                                   isLoading,
                                   isSmall = false,
                                   childrenClassName = ""
}) {

    const advProps = {};

    if (referal) {
        advProps.ref = referal;
    }

    return (
        <button
            className={classNames(
                styles.button,
                styles[variant],
                {
                    [styles.disabled]: disabled,
                    [styles.loading]: isLoading,
                    [styles.small]: isSmall
                },
                className
            )}
            disabled={disabled}
            type={type}
            onClick={disabled || isLoading ? null : onClick}
            {...advProps}
        >
            <div className={styles.button__hover}/>
            <div className={styles.button__background}/>
            {
                isLoading ?
                    <div className={styles.button__loading}/>
                : <div className={classNames(styles.button__children, childrenClassName)}>
                    {children}
                </div>
            }
        </button>
    );
}