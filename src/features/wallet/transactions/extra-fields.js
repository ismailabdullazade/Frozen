import classNames from "classnames";
import css from "./transactions.module.css";
import walletGreen from "../../../images/bonuses/wallet_green.svg";
import walletYellow from "../../../images/bonuses/wallet_yellow.svg";
import walletRed from "../../../images/bonuses/wallet_red.svg";
import transfer from "../../../images/bonuses/transfer.svg";
import React from "react";
import {useTranslation} from "react-i18next";
import {useMediaQuery} from "beautiful-react-hooks";

export default function ExtraFields ({item}) {
    const {t} = useTranslation();
    let type;
    const isMobile = useMediaQuery("(max-width: 960px)");

    if (item.type === "replenishment") {
        type = "deposit";
        const status = item.state_id;
        const statusName = (status == 2 || status == 1)
            ? "process"
            : (
                status == 3
                    ? "Success"
                    : (
                        status == 4 ? "reject" : ""
                    )
            );

        return <>
            <div
                className={css.source}
            >
                <div>
                    {
                        item.card ?
                            "CARD" : ""
                    }
                </div>
                <div>
                    {
                        item.card ?
                            item.card : <>&mdash;</>
                    }
                </div>
            </div>
            <div
                className={
                    classNames(css.status, css[type])
                }
            >
                <div className={css.icon_name}>
                    {
                        status == 3 && <img src={walletGreen} alt=""/>
                    }
                    {
                        (status == 2 || status == 1) && <img src={walletYellow} alt=""/>
                    }
                    {
                        status == 4 && <img src={walletRed} alt=""/>
                    }
                    <div>{t("Deposit")}</div>
                </div>
                <div className={css.status_text}>
                    <div className={css[statusName]}>{t(statusName)}</div>
                </div>
            </div>
            {isMobile && <div className={css.divider}/>}
        </>;
    } else if (item.type === "payout") {
        type = "withdarawal";

        const status = item.state_id;
        const statusName = (status == 2 || status == 1)
            ? "process"
            : (
                status == 3
                    ? "Success"
                    : (
                        status == 4 ? "reject" : ""
                    )
            );

        return <>
            <div
                className={css.source}
            >
                <div>
                    {
                        item.card ?
                        "CARD" : ""
                    }
                </div>
                <div>
                    {
                        item.card ?
                            item.card : <>&mdash;</>
                    }
                </div>
            </div>
            <div
                className={
                    classNames(css.status, css[type])
                }
            >
                <div className={css.icon_name}>
                    {
                        status == 3 && <img src={walletGreen} alt=""/>
                    }
                    {
                        (status == 2 || status == 1) && <img src={walletYellow} alt=""/>
                    }
                    {
                        status == 4 && <img src={walletRed} alt=""/>
                    }
                    <div>{t("Withdrawal")}</div>
                </div>
                <div className={css.status_text}>
                    <div className={css[statusName]}>{t(statusName)}</div>
                </div>
            </div>
            {isMobile && <div className={css.divider}/>}
        </>;
    } else if (item.type === "payout_request") {
        type = "withdarawal";

        const status = item.state_id;

        return <>
            <div
                className={css.source}
            >
                <div>
                    {
                        item.card ?
                        "CARD" : ""
                    }
                </div>
                <div>
                    {
                        item.card ?
                            item.card : <>&mdash;</>
                    }
                </div>
            </div>
            <div
                className={
                    classNames(css.status, css[type])
                }
            >
                <div className={css.icon_name}>
                    {
                        (status === "approved" || status === "paid") && <img src={walletGreen} alt=""/>
                    }
                    {
                        (status === "wait" || status === "verification_needed") && <img src={walletYellow} alt=""/>
                    }
                    {
                        (status === "declined" || status === "canceled" || status === "failed") && <img src={walletRed} alt=""/>
                    }
                    <div>{t("Withdrawal")}</div>
                </div>
                <div>
                    <div className={css[status]}>{t(status)}</div>
                </div>
            </div>
            {isMobile && <div className={css.divider}/>}
        </>;
    } else if (item.type === "transfer") {

        const isIncome = item.type_transfer === "in";

        return <>
                <div
                    className={css.source}
                >
                    <div>
                        {
                            isIncome ?
                                "POKER TO CASINO" : "CASINO TO POKER"
                        }
                    </div>
                    <div>
                        {
                            item.login_in_poker
                        }
                    </div>
                </div>
                <div
                    className={
                        classNames(css.status, {[css.sc_deposits]: isIncome})
                    }
                >
                    <img src={transfer} alt=""/>
                    <div>
                        <div>{t("Transfer")}</div>
                        <div className={css.Success}>{t("Success")}</div>
                    </div>
                </div>
            {isMobile && <div className={css.divider}/>}
                
            </>

    } else {
        return <>
            <div
                className={css.source}
            >
                <div>
                    {
                       item.source?.title
                    }
                </div>
                <div>
                    {
                        " "
                    }
                </div>
            </div>
            <div
                className={
                    classNames(css.status)
                }
            >
                <div>
                    <div> </div>
                    <div>{item.status}</div>
                </div>
            </div>
            {isMobile && <div className={css.divider}/>}
        </>
    }
}