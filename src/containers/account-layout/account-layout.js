import {useAuth} from "../../services/auth";
import {NavLink, useHistory, useLocation} from "react-router-dom";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import React, {useEffect} from "react";
import classNames from "classnames";
import css from "./style.module.css";
// import myBonus from "../../images/my-bonus.png";
// import betsHistory from "../../images/bets-history.png";
// import logout from "../../images/logout.png";
import {useTranslation} from "react-i18next";

export default function AccountLayout({children}) {
    const auth = useAuth();
    const history = useHistory();
    const isMobile = useMediaQuery('(max-width: 919px)');
    const location = useLocation();
    const links = ["/profile", "/wallet", "/bonus"];
    const {t} = useTranslation();

    useEffect(() => {
        if (isMobile && links.includes(location.pathname)) {
            document.querySelector(`[class*="${css.acive}"]`).scrollIntoView({inline: "center"});
        }
        // eslint-disable-next-line
    }, [location]);


    return (
        <>
            <div className={classNames(css.profile_menu, {[css.mobile]: isMobile})}>
                <NavLink
                    to={"/profile"}
                    className={classNames(css.profile, css.link_item)}
                    activeclassname={css.acive}
                >
                    {t("profile")}
                </NavLink>
                <NavLink
                    to={"/wallet"}
                    activeclassname={css.acive}
                    className={css.link_item}
                >
                    {t("wallet")}
                </NavLink>
                <NavLink
                    to={"/my-bonus"}
                    className={css.link_item}
                    activeclassname={css.acive}
                >
                    {t("bonus")}
                </NavLink>
                {/*<NavLink*/}
                {/*    to={"/bets-history"}*/}
                {/*    className={css.link_item}*/}
                {/*    activeclassname={css.acive}*/}
                {/*>*/}
                {/*    <img src={betsHistory} alt=""/>*/}
                {/*</NavLink>*/}
                <div onClick={() =>  {
                    window.openSplash();
                    auth.signout(() => {
                        window.closeSplash(100);
                        history.push("/");
                    });
                }} className={classNames(css.logout, css.link_item)}>
                    <svg width="133" height="52" viewBox="0 0 133 52" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <rect width="133" height="52" fill="url(#pattern0)"/>
                        <defs>
                            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <use xlinkHref="#image0_1187_35" transform="translate(-0.0195122 -0.0375) scale(0.00487805 0.0125)"/>
                            </pattern>
                            <image id="image0_1187_35" width="209" height="88" xlinkHref="data:image/png;base64,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"/>
                        </defs>
                    </svg>
                    <div>{t("Logout")}</div>
                </div>
            </div>
            {children}
        </>
    );
}