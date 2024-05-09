import ChangePass from "./change-pass";
import css from "./safety.module.css";
import SelfRestraint from "./self-restraint";
import TwoFactorAuthentication from "./two_factor_authentication.js";

export default function Safety() {
    return (
        <div className={css.wraper}>
            <div className={css.corner_shape_left}></div>
            <div className={css.corner_shape_right}></div>
            <div className={css.wraper_container}>
                <ChangePass />
                <TwoFactorAuthentication />
                <SelfRestraint />

            </div>
        </div>
    )
};