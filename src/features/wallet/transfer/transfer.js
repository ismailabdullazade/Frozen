import img from "../../../images/union.svg";
import garilla from "../../../images/garilla-grey.svg";
import css from "./transfer.module.css";
import {useTranslation} from "react-i18next";
import InnerPane from "../../../components/inner-pane/inner-pane";
import classNames from "classnames";
import React, {useState, useEffect, useMemo} from "react";
import Input from "../../../components/form3/input";
import {useAuth} from "../../../services/auth";
import {useCheckLoginMutation, useFetchExchangeRatesQuery, useSendMoneyMutation} from "../../../app/api/wallet.api";
import Button from "../../../components/button/button";
import {toast} from "react-toastify";
import MaskInput from "../../../components/form2/mask-input-2";
import {useSelector} from "react-redux";
import {useGetActiveBonusQuery} from "../../../app/api/bonus.api";
import CancelBonus from "../../my-bonus/cancel-bonus/cancel-bonus";
import {useMediaQuery} from "beautiful-react-hooks";

export default function Transfer ({setTab, paymentMethod, setPaymentMethod}) {
    const {t} = useTranslation();
    const [amount, setAmount] = useState("");
    const [errorOpened, setErrorOpened] = useState(false);
    const {balance} = useSelector(state => state.user);
    const [login, setLogin] = useState("");
    const auth = useAuth();
    const [checkLogin, {data: loginChecked, reset}] = useCheckLoginMutation();
    const [sendMoney, {data, error}] = useSendMoneyMutation();
    const {data: exchangeRates} = useFetchExchangeRatesQuery();
    const currencyPair = useMemo(() => {
        if (!auth || !exchangeRates) {
            return null;
        } else if (auth.user.currency.code === "EUR") {
            return {exchange: 1};
        } else {
            return exchangeRates.find(
                currency => currency.code_from === auth.user.currency.code && currency.code_to === "EUR"
            );
        }
    }, [auth, exchangeRates]);
    const exchange = currencyPair ? currencyPair.exchange : 1;
    const [inEuro, setInEuro] = useState("");
    const {data: activeBonus, error: errorActiveBonus} = useGetActiveBonusQuery();
    const [acceptedBonus, setAccepted] = useState(activeBonus);
    const [showConfirm, setShowConfirm] = useState();
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        if (activeBonus) {
            setAccepted(activeBonus);
        }
    }, [activeBonus]);

    useEffect(() => {
        if(errorActiveBonus) {
            setAccepted(null);
        }
    }, [errorActiveBonus]);

    useEffect(() => {
        if (data) {
            const notify = () => toast(t("Success"), {
                theme: "dark",
                type: "success"
            });
            notify();
            setLogin("");
            setAmount("");
            setInEuro("");
        }
        // eslint-disable-next-line
    }, [data]);

    useEffect(() => {
        if (errorOpened) {
            const notify = () => toast(t(errorOpened), {
                theme: "dark",
                type: "error",
                onClose: () => setErrorOpened(false)
            });
            notify();
        }
        // eslint-disable-next-line
    }, [errorOpened]);

    useEffect(() => {
        if (error) {
            const notify = () => toast(t("error"), {
                theme: "dark",
                type: "error"
            });
            notify();
        }
        // eslint-disable-next-line
    }, [error]);

    const body = <>
        <div className={css.transfer}>

            <div className={css.transfer__wrapper}>
                <div className={css.transfer__detail}>
                    <div className={css.transfer__detailImg}>
                        {t("Transfer")}
                        <img src={img} alt=""/>
                    </div>
                    <div className={css.transfer__detailDescription}>
                        {t("You can transfer funds from your Garilla Casino account to your Garilla Poker account.")}
                    </div>
                    <div className={css.transfer__detailCurrencies}>
                        <div className={css.amount}>
                            <MaskInput
                                value={amount}
                                onChange={val => {
                                    setAmount((val));
                                    if (val) {
                                        setInEuro((Math.round(val * exchange)));
                                    } else {
                                        setInEuro("");
                                    }
                                }}
                                icon={<span className={css.currency_sign}>{auth.user.currency?.sign}</span>}
                            />
                        </div>
                        <div className={css.transfer__detailCurrencyCovert}>
                            {t("Taking into account the conversion, the Garilla Poker account will receive")}
                        </div>
                        <div className={css.amount}>
                            <MaskInput
                                name={"converted"}
                                onChange={val => {
                                    setInEuro((val));
                                    if (val) {
                                        setAmount((Math.round(val / exchange)));
                                    } else {
                                        setAmount("");
                                    }
                                }}
                                value={inEuro}
                                icon={<span className={css.currency_sign}>€</span>}
                            />
                        </div>
                    </div>
                </div>
                <div className={classNames(css.transfer__alt, css.card_deposit)}>
                    <div className={css.withdrawal_requisites}>
                        <div className={css.title}>
                            {t("GARILLA POKER account nickname")}
                        </div>
                        <Input
                            value={login}
                            onChange={val => {
                                if (loginChecked) {
                                    reset();
                                }
                                setLogin(val);
                            }}
                            onBlur={() => {
                                if (login?.length && !loginChecked) {
                                    checkLogin(login);
                                }
                            }}
                            onKeyDown={e => {
                                if ((e.which === 13 || e.key === 13) && !loginChecked && login?.length) {
                                    checkLogin(login);
                                }
                            }}
                        />
                    </div>

                    <div className={css.transfer__altAvatars}>
                        <div className={classNames(css.transfer__altAvatarsBlock, css.garillaUser)}>

                            <div className={css.transfer__altAvatarsBlockLogin}>
                                {auth.user.nickname}
                            </div>
                        </div>
                        <div className={css.transfer__altAvatarsUnion}>
                            <img src={img} alt=""/>
                        </div>
                        {
                            loginChecked && <div style={{position: "relative"}}>
                                <div className={css.hexagon} style={{backgroundImage: `url(${loginChecked?.avatar})`}}>
                                    <div className={css.face1}></div>
                                    <div className={css.face2}></div>
                                </div>
                                <div className={classNames(css.transfer__altAvatarsBlockLogin, css.checkedLogin)}>
                                    {login}
                                </div>
                            </div>
                        }
                        {!loginChecked && <div
                            className={classNames(css.transfer__altAvatarsBlock, css.pokerUserEmpty)}>
                            <img src={garilla} alt=""/>
                        </div>}
                    </div>

                    <div className={css.submit}>
                        <Button
                            onClick={e => {
                                if (parseFloat(amount) > balance.balance/100) {
                                    setErrorOpened("Insufficient funds for output.")
                                }
                                if (acceptedBonus) {
                                    setShowConfirm(true);
                                } else {
                                    sendMoney({amount, login})
                                }
                            }}
                            disabled={!amount || amount === "0"}
                        >
                            {t("Make transfer")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <CancelBonus
            setShowConfirm={setShowConfirm}
            showConfirm={showConfirm}
            onCancelSuccess={() => {
                sendMoney({amount, login});
            }}
        />
    </>;

    if (isMobile) {
        return body;
    }

    return (
        <InnerPane paneClass={css.inner_pane} className={css.inner_pane}>
            {body}
        </InnerPane>
    )
}