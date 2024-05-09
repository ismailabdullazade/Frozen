import ContentPane from "../../components/content-pane/content-pane";
import {useTranslation} from "react-i18next";
import css from "./ranks.module.css";
import {useAuth} from "../../services/auth";
import {useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import {useGetRanksQuery} from "../../app/api/user.api"
import arrowNext from "./../../images/ranks/arrow-next-rank.svg"
import cash from "./../../images/ranks/cash.svg"
import playerCard from "./../../images/ranks/cards ranks/playerCard.svg";
import knightCard from "./../../images/ranks/cards ranks/knightCard.svg";
import baronCard from "./../../images/ranks/cards ranks/baronCard.svg";
import viscountCard from "./../../images/ranks/cards ranks/viscountCard.svg";
import earlCard from "./../../images/ranks/cards ranks/earlCard.svg";
import marquisCard from "./../../images/ranks/cards ranks/marquisCard.svg";
import dukeCard from "./../../images/ranks/cards ranks/dukeCard.svg";
import kingCard from "./../../images/ranks/cards ranks/kingCard.svg";
import godCard from "./../../images/ranks/cards ranks/godCard.svg";
import knightCardLock from "./../../images/ranks/cards ranks/lock/knightCard_lock.svg";
import baronCardLock from "./../../images/ranks/cards ranks/lock/baronCard_lock.svg";
import viscountCardLock from "./../../images/ranks/cards ranks/lock/viscountCard_lock.svg";
import earlCardLock from "./../../images/ranks/cards ranks/lock/earlCard_lock.svg";
import marquisCardLock from "./../../images/ranks/cards ranks/lock/marquisCard_lock.svg";
import dukeCardLock from "./../../images/ranks/cards ranks/lock/dukeCard_lock.svg";
import kingCardLock from "./../../images/ranks/cards ranks/lock/kingCard_lock.svg";
import godCardLock from "./../../images/ranks/cards ranks/lock/godCard_lock.svg";
import banerRanks from "./../../images/ranks/wellcome-pack-ranks-baner.png";
import maskLineDeposit from "./../../images/ranks/musk-line-deposit.svg";
import arrowRight from "./../../images/bonuses/arrow-right.svg"
import arrowLeft from "./../../images/bonuses/arrow-left.svg"
import { NavLink } from "react-router-dom";

export default function Ranks() {
    const {t} = useTranslation();
    const auth = useAuth();
    const {
        data: ranksFetched,
    } = useGetRanksQuery();
    const ranks = ranksFetched ? ranksFetched.map(rank => ({
        label: `${rank.title}`,
        value: rank.id,
        cashback_percent: rank.cashback_percent,
        deposit_amount: rank.deposit_amount
    })) : [];

    const numberCard = (auth.user.rank === null ? -1 : auth.user.rank_id - 2 );

    const rankCashbackPercent = [
        ranks?.[0]?.cashback_percent,
        ranks?.[2]?.cashback_percent,
        ranks?.[1]?.cashback_percent,
        ranks?.[3]?.cashback_percent,
        ranks?.[4]?.cashback_percent,
        ranks?.[5]?.cashback_percent,
        ranks?.[6]?.cashback_percent,
        ranks?.[7]?.cashback_percent,
        ranks?.[8]?.cashback_percent
    ]
    const rankDepositAmount = [
        ranks?.[0]?.deposit_amount,
        ranks?.[1]?.deposit_amount,
        ranks?.[2]?.deposit_amount,
        ranks?.[3]?.deposit_amount,
        ranks?.[4]?.deposit_amount,
        ranks?.[5]?.deposit_amount,
        ranks?.[6]?.deposit_amount,
        ranks?.[7]?.deposit_amount,
        ranks?.[8]?.deposit_amount
    ]

    function getRank () {
        if (auth.user.rank === null) {
            return "";
        }
        if (auth.user.rank_id === 1 ) {
            return [playerCard, knightCard, "Player", "Knight"];
        }
        if (auth.user.rank_id === 2 ) {
            return [knightCard, baronCard, "Knight", "Baron"];
        }
        if (auth.user.rank_id === 3 ) {
            return [baronCard, viscountCard, "Baron", "Viscount"];
        }
        if (auth.user.rank_id === 4 ) {
            return [viscountCard, earlCard, "Viscount", "Earl (VIP CLUB)"];
        }
        if (auth.user.rank_id === 5 ) {
            return [earlCard, marquisCard, "Earl (VIP CLUB)", "Marquis (VIP CLUB)"];
        }
        if (auth.user.rank_id === 6 ) {
            return [marquisCard, dukeCard, "Marquis (VIP CLUB)", "Duke (VIP CLUB)"];
        }
        if (auth.user.rank_id === 7 ) {
            return [dukeCard, kingCard, "Duke (VIP CLUB)", "King (VIP CLUB)"];
        }
        if (auth.user.rank_id === 8 ) {
            return [kingCard, godCard, "King (VIP CLUB)", "God (VIP CLUB)"];
        }
        if (auth.user.rank_id === 9 ) {
            return [godCard, "", "God (VIP CLUB)", ""];
        }
    };
    const now = (auth.user.rank === null) || (auth.user.rank === undefined) ? "" : auth.user.rank.cashback_percent;
    const next = (auth.user.rank === null) || (auth.user.rank === undefined) ? "" : auth.user.rank.next_rank.cashback_percent;

    // eslint-disable-next-line
    const [rankCard, nextRankCard, rankTitle, nextRankTitle] = useMemo(() => getRank(), []);
    const birthdayGift = auth.user.rank === null ? "" : (new Intl.NumberFormat('ru-RU').format(auth.user.rank.present_amount/100));
    const depositSumCalc = (auth.user.dep_sum === null) || (auth.user.dep_sum === undefined ? 0 : auth.user.dep_sum/100);
    const depositAmount = auth.user.rank === null ? "" : (new Intl.NumberFormat('ru-RU').format(auth.user.rank.deposit_amount === null ? "0" : auth.user.rank.deposit_amount/100));
    const depositAmountCalc = auth.user.rank === null ? "" : (auth.user.rank.next_rank.deposit_amount === null ? "0" : auth.user.rank.next_rank.deposit_amount/100);
    const depositAmountLine = auth.user.rank === null ? "" : (new Intl.NumberFormat('de-DE').format(auth.user.rank.next_rank.deposit_amount=== null ? "0" : auth.user.rank.next_rank.deposit_amount/100));
    const payoutMaxDaily = auth.user.rank === null ? "" : (new Intl.NumberFormat('ru-RU').format((auth.user.rank.payout_max_daily)/100));
    const presentWager =  auth.user.rank === null ? "" : auth.user.rank.present_wager;
    const depositLine = (depositSumCalc * 100) / depositAmountCalc;

    const slider = [
        <div className={css.slider}>
            <img src={playerCard} alt="playerCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("Player")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                {/*    <span className={css.carusel_slider__cashback}>{rankCashbackPercent[0]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                {/*    <span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[0]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                    <span className={css.carusel_slider__player}>{t("Player")}</span>
                </div>
            </div>
        </div> ,
        <div className={css.slider}>
            <img src={auth.user.rank === null? knightCard : (auth.user.rank_id === 2 || auth.user.rank_id > 2 ? knightCard : knightCardLock)} alt="knightCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("Knight")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                    <span className={css.carusel_slider__player}>{t("Knight")}</span>
                    {/*<span className={css.carusel_slider__cashback}>{rankCashbackPercent[1]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                    {/*<span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[1]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                </div>
            </div>
        </div>,
        <div className={css.slider}>
            <img src={auth.user.rank === null? baronCard : (auth.user.rank_id === 3 || auth.user.rank_id > 3 ? baronCard : baronCardLock)} alt="baronCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("Baron")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                    <span className={css.carusel_slider__player}>{t("Baron")}</span>
                    {/*<span className={css.carusel_slider__cashback}>{rankCashbackPercent[2]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                    {/*<span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[2]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                </div>
            </div>
        </div>,
        <div className={css.slider}>
            <img src={auth.user.rank === null? viscountCard : (auth.user.rank_id === 4 || auth.user.rank_id > 4 ? viscountCard : viscountCardLock)} alt="viscountCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("Viscount")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                    <span className={css.carusel_slider__player}>{t("Viscount")}</span>
                    {/*<span className={css.carusel_slider__cashback}>{rankCashbackPercent[3]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                    {/*<span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[3]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                </div>
            </div>
        </div>,
        <div className={css.slider}>
            <img src={auth.user.rank === null? earlCard : (auth.user.rank_id === 5 || auth.user.rank_id > 5 ? earlCard : earlCardLock)} alt="earlCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("Earl")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                    <span className={css.carusel_slider__player}>{t("Earl")}</span>
                    {/*<span className={css.carusel_slider__cashback}>{rankCashbackPercent[4]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                    {/*<span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[4]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                </div>
            </div>
        </div>,
        <div className={css.slider}>
            <img src={auth.user.rank === null? marquisCard : (auth.user.rank_id === 6 || auth.user.rank_id > 6 ? marquisCard : marquisCardLock)} alt="marquisCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("Marquis")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                    <span className={css.carusel_slider__player}>{t("Marquis")}</span>
                    {/*<span className={css.carusel_slider__cashback}>{rankCashbackPercent[5]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                    {/*<span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[5]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                </div>
            </div>
        </div>,
        <div className={css.slider}>
            <img src={auth.user.rank === null? dukeCard : (auth.user.rank_id === 7 || auth.user.rank_id > 7 ? dukeCard : dukeCardLock)} alt="dukeCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("Duke")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                    <span className={css.carusel_slider__player}>{t("Duke")}</span>
                    {/*<span className={css.carusel_slider__cashback}>{rankCashbackPercent[6]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                    {/*<span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[6]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                </div>
            </div>
        </div>,
        <div className={css.slider}>
            <img src={auth.user.rank === null? kingCard : (auth.user.rank_id === 8 || auth.user.rank_id > 8 ? kingCard: kingCardLock)} alt="dukeCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("King")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                    <span className={css.carusel_slider__player}>{t("King")}</span>
                    {/*<span className={css.carusel_slider__cashback}>{rankCashbackPercent[7]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                    {/*<span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[7]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                </div>
            </div>
        </div>,
        <div className={css.slider}>
            <img src={auth.user.rank === null? godCard : (auth.user.rank_id === 9 || auth.user.rank_id > 9 ? godCard : godCardLock)} alt="godCard" />
            <div className={css.slider_card}>
                <div className={css.slider_card__block}>
                    {/*<span className={css.carusel_slider__rank}>{t("rank")}</span>*/}
                    {/*<span className={css.carusel_slider__player}>{t("God")}</span>*/}
                </div>
                <div className={css.slider_card__blockBootom}>
                    <span className={css.carusel_slider__player}>{t("God")}</span>
                    {/*<span className={css.carusel_slider__cashback}>{rankCashbackPercent[8]} % <span className={css.carusel_slider__description}>{"Cashback"}</span></span>*/}
                    {/*<span className={css.carusel_slider__deposit}>{(new Intl.NumberFormat('ru-RU').format(rankDepositAmount[8]/100))} {auth.user.currency?.sign} <span className={css.carusel_slider__number}>{t("Deposit rank")}</span></span>*/}
                </div>
            </div>
        </div>
    ]
    
    useEffect(() => {
            setActiveIndex((current) => {
                const res = current === slider.length - 1 ? 0 : current + 1
                return res
            })
    }, []);

    const prevCard = () => {
        setActiveIndex(activeIndex < 1 ? activeIndex : activeIndex - 1)
    };
    const nextCard = () => {
        setActiveIndex(activeIndex > 7 ? activeIndex :activeIndex + 1)
    };
    const [activeIndex, setActiveIndex] = useState(numberCard);
    const firstImgIndex = activeIndex ? (activeIndex === 1 ? slider.length - 1 : activeIndex - 2) : slider.length - 2;
    const prevImgIndex = activeIndex ? activeIndex - 1 : slider.length - 1;
    const nextImgIndex = activeIndex === slider.length - 1 ? 0 : activeIndex + 1;
    const lastImgIndex = activeIndex === slider.length - 1 ? 1 : (activeIndex === slider.length - 2 ? 0 : activeIndex + 2);
    
    return (
        <div className={css.ranks_background}>
            {/*<span className={css.ranks_background__title}>PLAYER RANKS</span>*/}
            {/*<span className={css.ranks_background__title}></span>*/}
            <ContentPane className={css.ranks_wraper}>
                <div className={css.ranks_wraper__container}>
                    <div className={css.ranks_border}></div>
                    <div className={css.ranks_cards}>
                        <div className={css.cards_carusel}>
                            <div 
                                onClick={prevCard}
                                className={css.cards_carusel__arrowPrev} 
                            >
                                <img src={arrowLeft} alt="" />
                            </div>
                            <div className={css.carusel_slider}>
                                <div className={classNames(css.carusel_slider__img, css.carusel_slider__imgFirst)}
                                        key={firstImgIndex}>
                                    {slider[firstImgIndex]}
                                </div>
                                <div className={classNames(css.carusel_slider__img, css.carusel_slider__imgPrev)}
                                        key={prevImgIndex}>
                                    {slider[prevImgIndex]}
                                </div>
                                <div className={css.carusel_slider__img}
                                        key={activeIndex}>
                                    {slider[activeIndex]}
                                </div>
                                <div className={classNames(css.carusel_slider__img, css.carusel_slider__imgNext)}
                                        key={nextImgIndex}>
                                    {slider[nextImgIndex]}
                                </div>
                                <div className={classNames(css.carusel_slider__img, css.carusel_slider__imgLast)}
                                        key={lastImgIndex}>
                                    {slider[lastImgIndex]}
                                </div>
                            </div>
                            <div 
                                onClick={nextCard}
                                className={css.cards_carusel__arrowNext} 
                            >
                                <img src={arrowRight} alt="" />
                            </div>
                        </div>
                        {/*<div className={css.cards_specification}>*/}
                        {/*    <img src={rankCard} className={css.cards_specification__card} alt="" />*/}
                        {/*    <div className={css.specification_block__wraper}>*/}
                        {/*        <span className={css.specification_title}>{t("Your rank")} <span className={css.specification_title__name}>{t(rankTitle)}</span></span>*/}
                        {/*        <div className={css.specification_block}>*/}
                        {/*            <div className={css.block_description}>*/}
                        {/*                <span>{t("cashback")}: </span>*/}
                        {/*                <div>*/}
                        {/*                    <span>{t(now)}%</span> */}
                        {/*                    { now === 0 ? "" : <span> ({t("wager")} x {presentWager})</span> } */}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div className={css.block_description}>*/}
                        {/*                {*/}
                        {/*                    birthdayGift === ( "" || "0" ) ? "" : <>*/}
                        {/*                        <span>{t("birthday gift")}: </span>*/}
                        {/*                        <span>{birthdayGift} {auth.user.currency?.code} ({t("wager")} x {presentWager})</span>*/}
                        {/*                    </>*/}
                        {/*                }*/}
                        {/*            </div>*/}
                        {/*            <div className={css.block_description}>*/}
                        {/*                <span>{t("payout_max_daily")} </span>*/}
                        {/*                <span>{payoutMaxDaily} RUB / {t("day")}</span>*/}
                        {/*            </div>*/}
                        {/*            <div className={css.block_description}>*/}
                        {/*                {*/}
                        {/*                    depositAmount === "0" ? "" : <>*/}
                        {/*                        <span>{t("deposits amount")} </span>*/}
                        {/*                        <span>{depositAmount} {auth.user.currency?.code} / {t("day")}</span>*/}
                        {/*                    </>*/}
                        {/*                }*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className={css.ranks_progress}>
                        {/*<div className={css.ranks_progress__cards}>*/}
                        {/*    <div className={css.progress_now}>*/}
                        {/*        <span className={css.progress_now__title}>{t("current")}</span>*/}
                        {/*        <div className={css.progress_now__block}>*/}
                        {/*            <img src={rankCard} className={css.block_img} alt="" />*/}
                        {/*            <div className={css.block_info}>*/}
                        {/*                <span className={css.info_title}>{t(rankTitle)}</span>*/}
                        {/*                <div className={css.info_percent}>*/}
                        {/*                    <img src={cash} className={css.percent_cash} alt="" />*/}
                        {/*                    <span className={css.persent_text}>{t(now)}%</span>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    {*/}
                        {/*        rankTitle === "God" ? "" :*/}
                        {/*            <>*/}
                        {/*                <img src={arrowNext} className={css.progress_img} alt="" />*/}
                        {/*                <div className={css.progress_next}>*/}
                        {/*                    <span className={css.progress_now__title}>{t("next-rank")}</span>*/}
                        {/*                    <div className={css.progress_now__block}>*/}
                        {/*                        <img src={nextRankCard} className={css.block_img} alt="" />*/}
                        {/*                        <div className={css.block_info}>*/}
                        {/*                            <span className={css.info_title}>{t(nextRankTitle)}</span>*/}
                        {/*                            <div className={css.info_percent}>*/}
                        {/*                                <img src={cash} className={css.percent_cash} alt="" />*/}
                        {/*                                <span className={css.persent_text}>{t(next)}%</span>*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            </>*/}
                        {/*    }*/}
                        {/*</div>*/}
                        {/*<div className={css.progress_line}>*/}
                        {/*    <span className={css.progress_line__title}>{t("number of deposits")}</span>*/}
                        {/*    <div className={css.progress_line__container}>*/}
                        {/*        <div className={css.deposit__line__wrapper}>*/}
                        {/*            <div className={css.deposit_line__progressLabels}>*/}
                        {/*                <span className={css.deposit_line__progressLabelsPoint}/>*/}
                        {/*                <span className={css.deposit_line__progressLabelsPoint}/>*/}
                        {/*            </div>*/}
                        {/*            <div className={css.deposit_line}>*/}
                        {/*                <img src={maskLineDeposit} className={css.deposit_line__mask} alt="" />*/}
                        {/*                <div className={css.deposit_line__active} style={{width: `${depositLine}%`}}></div>*/}
                        {/*            </div>*/}
                        {/*            <div className={css.deposit_line__activeLight} style={{left: depositLine ? `calc(${depositLine}% - 12px)` : "2px"}}/>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className={css.deposit_line__progressCaption}>*/}
                        {/*        <span>0</span>*/}
                        {/*        <span>{depositAmountLine}</span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<NavLink */}
                        {/*    to={"/my-bonus"} */}
                        {/*    className={css.progrss_baner}*/}
                        {/*>*/}
                        {/*    <img src={banerRanks} className={css.baner_img} alt="" />*/}
                        {/*    <div className={css.baner_block}>*/}
                        {/*        <span className={css.baner_text}>{t('welcome pack')}</span>*/}
                        {/*        <span className={css.baner_bonus}>{t('100 dep 200 fs')}</span>*/}
                        {/*    </div>*/}
                        {/*</NavLink>*/}

                        <div className={css.rank_name_title}>
                            <div className={css.rank_name_block}>
                                {
                                    (activeIndex === 0 && <div className={css.rank_name}>{t("Player")}</div>)
                                    || (activeIndex === 1 && <div className={css.rank_name}>{t("Knight")}</div>)
                                    || (activeIndex === 2 && <div className={css.rank_name}>{t("Baron")}</div>)
                                    || (activeIndex === 3 && <div className={css.rank_name}>{t("Viscount")}</div>)
                                    || (activeIndex === 4 && <div className={css.rank_name}>{t("Earl")}</div>)
                                    || (activeIndex === 5 && <div className={css.rank_name}>{t("Marquis")}</div>)
                                    || (activeIndex === 6 && <div className={css.rank_name}>{t("Duke")}</div>)
                                    || (activeIndex === 7 && <div className={css.rank_name}>{t("King")}</div>)
                                    || (activeIndex === 8 && <div className={css.rank_name}>{t("God")}</div>)
                                }
                                {
                                    activeIndex >= 4 ?
                                        <div className={classNames(css.rank_name_vip_club, css.rank_name_vip_club_show)}>{t('vip club')}</div> :
                                        <div className={css.rank_name_vip_club}>{t('vip club')}</div>
                                }
                            </div>
                            <div className={css.rank_name_description}>{t('Condition')}: {t('deposits amount')}&nbsp;
                                {
                                    (activeIndex === 0 && <>0 RUB.</>)
                                    || (activeIndex === 1 && <>20 000 RUB.</>)
                                    || (activeIndex === 2 && <>50 000 RUB.</>)
                                    || (activeIndex === 3 && <>150 000 RUB.</>)
                                    || (activeIndex === 4 && <>500 000 RUB.</>)
                                    || (activeIndex === 5 && <>1 000 000 RUB.</>)
                                    || (activeIndex === 6 && <>1 500 000 RUB.</>)
                                    || (activeIndex === 7 && <>3 000 000 RUB.</>)
                                    || (activeIndex === 8 && <>5 000 000 RUB.</>)
                                }
                            </div>
                        </div>
                        <div className={css.rank_block_info}>
                            <div className={css.rank_block_info_title}>{t("Advantages")}</div>
                            <div className={css.rank_block_items}>
                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("cashback")}</div>
                                    {
                                        (activeIndex === 0 && <div className={css.rank_block_item_val}>0%</div>)
                                        || (activeIndex === 1 && <div className={css.rank_block_item_val}>2%</div>)
                                        || (activeIndex === 2 && <div className={css.rank_block_item_val}>3%</div>)
                                        || (activeIndex === 3 && <div className={css.rank_block_item_val}>5%</div>)
                                        || (activeIndex === 4 && <div className={css.rank_block_item_val}>6%</div>)
                                        || (activeIndex === 5 && <div className={css.rank_block_item_val}>7%</div>)
                                        || (activeIndex === 6 && <div className={css.rank_block_item_val}>8%</div>)
                                        || (activeIndex === 7 && <div className={css.rank_block_item_val}>9%</div>)
                                        || (activeIndex === 8 && <div className={css.rank_block_item_val}>10%</div>)
                                    }
                                </div>
                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("birthday gift")}</div>
                                    {
                                        (activeIndex === 0 && <div className={css.rank_block_item_val}>нет</div>)
                                        || (activeIndex === 1 && <div className={css.rank_block_item_val}>1 000 RUB</div>)
                                        || (activeIndex === 2 && <div className={css.rank_block_item_val}>2 000 RUB</div>)
                                        || (activeIndex === 3 && <div className={css.rank_block_item_val}>5 000 RUB</div>)
                                        || (activeIndex === 4 && <div className={css.rank_block_item_val}>8 000 RUB</div>)
                                        || (activeIndex === 5 && <div className={css.rank_block_item_val}>10 000 RUB</div>)
                                        || (activeIndex === 6 && <div className={css.rank_block_item_val}>15 000 RUB</div>)
                                        || (activeIndex === 7 && <div className={css.rank_block_item_val}>30 000 RUB</div>)
                                        || (activeIndex === 8 && <div className={css.rank_block_item_val}>50 000 RUB</div>)
                                    }
                                </div>
                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("Accelerated withdrawal")}</div>
                                    {
                                        (activeIndex < 6 && <div className={css.rank_block_item_val}>{t("No")}</div>)
                                        || (activeIndex > 5 && <div className={css.rank_block_item_val}>{t("Yes")}</div>)
                                    }
                                </div>

                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("support 24/7")}</div>
                                    <div className={css.rank_block_item_val}>{t("Yes")}</div>
                                </div>
                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("new year's gift")}</div>
                                    {
                                        (activeIndex < 4 && <div className={css.rank_block_item_val}>{t("No")}</div>)
                                        || (activeIndex === 4 && <div className={css.rank_block_item_val}>8 000 RUB</div>)
                                        || (activeIndex === 5 && <div className={css.rank_block_item_val}>10 000 RUB</div>)
                                        || (activeIndex === 6 && <div className={css.rank_block_item_val}>12 000 RUB</div>)
                                        || (activeIndex === 7 && <div className={css.rank_block_item_val}>15 000 RUB</div>)
                                        || (activeIndex === 8 && <div className={css.rank_block_item_val}>20 000 RUB</div>)
                                    }
                                </div>
                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("personal manager")}</div>
                                    {
                                        (activeIndex < 7 && <div className={css.rank_block_item_val}>{t("No")}</div>)
                                        || (activeIndex > 6 && <div className={css.rank_block_item_val}>{t("Yes")}</div>)
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={css.rank_block_info}>
                            <div className={css.rank_block_info_title}>{t("bonuses")}</div>
                            <div className={css.rank_block_items}>
                                <div className={classNames(css.rank_block_item, css.rank_block_item_big)}>
                                    <div className={css.rank_block_item_name}>{t("Weekly Bonus")}</div>
                                    <div className={css.rank_block_item_val}>{t("Yes")}</div>
                                </div>
                                <div className={classNames(css.rank_block_item, css.rank_block_item_big)}>
                                    <div className={css.rank_block_item_name}>{t("Additional bonus")}</div>
                                    {
                                        (activeIndex < 4 && <div className={css.rank_block_item_val}>{t("No")}</div>)
                                        || (activeIndex > 3 && <div className={css.rank_block_item_val}>{t("Yes")}</div>)
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={css.rank_block_info}>
                            <div className={css.rank_block_info_title}>{t("Withdrawal limits")}</div>
                            <div className={css.rank_block_items}>
                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("Withdrawal per day")}</div>
                                    {
                                        (activeIndex === 0 && <div className={css.rank_block_item_val}>{t("up to")} 20 000 RUB</div>)
                                        || (activeIndex === 1 && <div className={css.rank_block_item_val}>{t("up to")} 30 000 RUB</div>)
                                        || (activeIndex === 2 && <div className={css.rank_block_item_val}>{t("up to")} 50 000 RUB</div>)
                                        || (activeIndex === 3 && <div className={css.rank_block_item_val}>{t("up to")} 80 000 RUB</div>)
                                        || (activeIndex === 4 && <div className={css.rank_block_item_val}>{t("up to")} 150 000 RUB</div>)
                                        || (activeIndex === 5 && <div className={css.rank_block_item_val}>{t("up to")} 150 000 RUB</div>)
                                        || (activeIndex === 6 && <div className={css.rank_block_item_val}>{t("up to")} 350 000 RUB</div>)
                                        || (activeIndex === 7 && <div className={css.rank_block_item_val}>{t("up to")} 500 000 RUB</div>)
                                        || (activeIndex === 8 && <div className={css.rank_block_item_val}>{t("up to")} 1 000 000 RUB</div>)
                                    }
                                </div>
                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("Withdrawal per week")}</div>
                                    {
                                        (activeIndex === 0 && <div className={css.rank_block_item_val}>{t("up to")} 70 000 RUB</div>)
                                        || (activeIndex === 1 && <div className={css.rank_block_item_val}>{t("up to")} 100 000 RUB</div>)
                                        || (activeIndex === 2 && <div className={css.rank_block_item_val}>{t("up to")} 175 000 RUB</div>)
                                        || (activeIndex === 3 && <div className={css.rank_block_item_val}>{t("up to")} 280 000 RUB</div>)
                                        || (activeIndex === 4 && <div className={css.rank_block_item_val}>{t("up to")} 500 000 RUB</div>)
                                        || (activeIndex === 5 && <div className={css.rank_block_item_val}>{t("up to")} 500 000 RUB</div>)
                                        || (activeIndex === 6 && <div className={css.rank_block_item_val}>{t("up to")} 1 000 000 RUB</div>)
                                        || (activeIndex === 7 && <div className={css.rank_block_item_val}>{t("up to")} 1 500 000 RUB</div>)
                                        || (activeIndex === 8 && <div className={css.rank_block_item_val}>{t("up to")} 3 000 000 RUB</div>)
                                    }
                                </div>
                                <div className={css.rank_block_item}>
                                    <div className={css.rank_block_item_name}>{t("Withdrawal per month")}</div>
                                    {
                                        (activeIndex === 0 && <div className={css.rank_block_item_val}>{t("up to")} 245 000 RUB</div>)
                                        || (activeIndex === 1 && <div className={css.rank_block_item_val}>{t("up to")} 360 000 RUB</div>)
                                        || (activeIndex === 2 && <div className={css.rank_block_item_val}>{t("up to")} 610 000 RUB</div>)
                                        || (activeIndex === 3 && <div className={css.rank_block_item_val}>{t("up to")} 980 000 RUB</div>)
                                        || (activeIndex === 4 && <div className={css.rank_block_item_val}>{t("up to")} 1 500 000 RUB</div>)
                                        || (activeIndex === 5 && <div className={css.rank_block_item_val}>{t("up to")} 1 500 000 RUB</div>)
                                        || (activeIndex === 6 && <div className={css.rank_block_item_val}>{t("up to")} 3 000 000 RUB</div>)
                                        || (activeIndex === 7 && <div className={css.rank_block_item_val}>{t("up to")} 4 000 000 RUB</div>)
                                        || (activeIndex === 8 && <div className={css.rank_block_item_val}>{t("up to")} 7 000 000 RUB</div>)
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </ContentPane>
        </div>
    )
}