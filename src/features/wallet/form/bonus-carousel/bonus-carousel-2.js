import withoutBonus from "../../../../images/bonuses/without-bonus.svg";
import {isFreeDepBonus, splitTitle} from "../../../../utils/bonus-helpers";
import modalBg from "../../../../images/bonuses/modal-bg.png";
import cross from "../../../../images/cross-white.svg";
import css from "./bonus-carousel.module.css";
import {useGetBonusSlotQuery} from "../../../../app/api/bonus.api";
import classNames from "classnames";
import arrowLeft from "../../../../images/bonuses/arrow-left.svg";
import arrowRight from "../../../../images/bonuses/arrow-right.svg";
import {useEffect, useMemo, useRef, useState} from "react";
import info from "../../../../images/items/info.svg";
import Modal from "../../../../components/modal/modal";
import {useTranslation} from "react-i18next";
import {loadBaseUrl} from "../../../../app/api/api.config";
import {useAuth} from "../../../../services/auth";
import useMediaQuery from "beautiful-react-hooks/useMediaQuery";
import large from "./large.module.css";
import {useHistory, useLocation} from "react-router-dom";
import {searchParams} from "../../../../utils/search-params";

const themes = {large};

export default function BonusCarousel({
                                          list: souceList,
                                          selectBonus,
                                          defaultSelected,
                                          variant,
                                          showWithoutBonus = true,
                                          defaultMinLength = 2,
                                          onlyDepositBonuses = true
}) {
    const {t} = useTranslation();
    const isSafari = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
    const location = useLocation();
    const history = useHistory();
    const auth = useAuth();
    // eslint-disable-next-line 
    const {data, bonusLoading} = useGetBonusSlotQuery();
    // eslint-disable-next-line 
    const [selectedId, selectId] = useState(null);
    const bonus = data?.find(item => item.id === selectedId);
    const searchParameters = searchParams(location.search);

    useEffect(() => {
        if (data && data.length) {
            if (isMobile) {
                //если моб устройство выделим первый бонус при загрузке бонусов
                selectId(data[0].id);
            } else {
                if (data.length % 2 === 0) {
                    //если бонусов ченое число
                    selectId(data[data.length / 2 - 1].id);
                } else {
                    //если бонусов не четное количество - выделим средний
                    selectId(data[Math.floor(data.length / 2)].id);
                }
            }
        }
    }, [data]);


    if (searchParameters.b) {
        history.push(location.pathname)
    }
    const list = useMemo(() =>
      onlyDepositBonuses ? souceList.filter(bonus => !isFreeDepBonus(bonus)) : souceList,
      [onlyDepositBonuses, souceList]);
    const slides = useMemo(() => {
        const host = loadBaseUrl().split("/")[0];

        return list.map(item => ({
            id: `${item.id}`,
            img: `https://${host}/uploads/${item.image}`,
            body: splitTitle({className: css.bonus__text, bonus: item}),
            title: item.title,
            description: item.description,
            details: item.details,
            bonus: (new Intl.NumberFormat('ru-RU').format(item.bonus_amount/100)),
            slot_id: item.bonus_slot_type_id
        })).concat(showWithoutBonus ? [
            {
                id: "without-bonus",
                img: withoutBonus,
                body: <div className={classNames(css.bonus__text, css.inverse)}>
                    <div>{t("Without")}</div>
                    <div>{t("Bonus (without bonus)")}</div>
                </div>,
                bonus: <div>{t("Bonus")}</div>
            },

        ] : [])
    }, list);
    const defaultSelectedIndex = list.findIndex(item => item.id === defaultSelected);
    const [selected, setSelected] = useState(defaultSelectedIndex > 0 ? defaultSelectedIndex : 0);
    const carousel = useRef();
    const moveCarousel = (idx) => {
        const id = list[idx]?.id;

       if (!withoutAnimation) {
           const itemWidth = carousel.current.childNodes[idx]?.offsetWidth + 16;
           const diff = itemWidth * idx - carousel.current.scrollLeft;
           carousel.current.scrollTo({
               top: 0,
               left: carousel.current.scrollLeft + diff,
               behavior: 'smooth'
           });
       }
        setSelected(idx);
        selectBonus(id === "without-bonus" ? null : id)
    };
    const [modal, setModal] = useState();
    const isMobile = useMediaQuery('(max-width: 919px)');
    const withoutAnimation = useMemo(() => list?.length < defaultMinLength && !isMobile, [list, isMobile]);
    const bonusTitle = useMemo(() => {
        if (modal) {
            return splitTitle({className: css.bonus_modal__bodyTitle, bonus: modal});
        } else return null;
    }, [modal]);

    useEffect(() => {
        if (defaultSelected && list){
            const index = list.findIndex(item => item.id === defaultSelected)
            setSelected(index > 0 ? index : 0);
            moveCarousel(index > 0 ? index : 0);
        }
    }, [defaultSelected])

    return <div className={classNames(css.container, themes[variant]?.container)}>
        <Modal
            customBody={
                <div className={css.bonus_modal}>
                    <img src={modalBg} className={css.bonus_modal__bg} alt=""/>
                    <div
                        className={css.bonus_modal__close}
                        onClick={() => setModal(null)}
                    >
                        <img src={cross} alt=""/>
                    </div>
                    <div className={css.bonus_modal__img}>
                        <img src={modal?.img} alt=""/>
                    </div>
                    <div className={css.bonus_modal__body}>
                        {bonusTitle}
                        <div>{modal?.description}</div>
                        {/* <div>{bonus?.bonus_slot_type_id  }</div> */}
                    </div>
                    <div className={css.bonus_modal__list}>{modal?.details}</div>
                    {
                        modal?.slot_id === 4 &&<div className={css.bonus_modal__list}>
                            {modal?.slot_id === 4? modal?.bonus : ""} 
                            {auth.user.currency?.sign}
                        </div>
                    }
                    
                    
                    {/*<ul className={css.bonus_modal__list}>*/}
                    {/*    <li>Минимальная сумма депозита - 1 500 RUB;</li>*/}
                    {/*    <li>Максимальная сумма бонуса - 30 000 RUB;</li>*/}
                    {/*    {modal?.wager && <li>Вейджер - x {modal?.wager};</li>}*/}
                    {/*    <li>30 фриспинов для игры Sun of Egypt;</li>*/}
                    {/*    { modal?.wager_period && <li>Время на отыгрыш - {modal?.wager_period} дней</li> }*/}
                    {/*</ul>*/}
                    {/*<div className={css.bonus_modal__bottom}>{modal?.details_bottom}*/}
                    {/*    Следующий доступный бонус:*/}
                    {/*    WELCOME на второй депозит*/}
                    {/*</div>*/}
                </div>
            }
            isOpen={modal}
            overlayClassName={css.overlay}
            closeModal={() => setModal(null)}
        />
        <div className={classNames(css.arrow,  themes[variant]?.arrow, css.left, themes[variant]?.left, {[css.hidden]: withoutAnimation})}>
            <img src={arrowLeft} alt="" onClick={() => selected > 0 && moveCarousel(selected - 1)}/>
        </div>
        <div
            className={classNames(
                css.carousel,
                themes[variant]?.carousel,
                    {
                        [css.static]: withoutAnimation,
                        [themes[variant]?.static]: withoutAnimation,
                        [css.safari]: isSafari && isMobile
                    }
                )}
             ref={carousel}
        >
            {
                slides.map((bonus, i) => <div
                    onClick={() => {
                        if (selected === i && bonus.id !== "without-bonus") {
                            setModal(bonus);
                        } else {
                            moveCarousel(i);
                        }
                    }}
                    className={classNames(css.bonus, themes[variant]?.bonus, {
                        [css.selected]: i === selected,
                        [themes[variant]?.selected]: i === selected,
                        [css.without]: bonus.id === "without-bonus"
                    })}
                    key={`bonus-${bonus.id}`}
                >
                    {
                        i < slides.length && <div
                            className={css.info}
                            onClick={e => {
                                e.stopPropagation();
                                setModal(bonus);
                            }}
                        >
                            <img src={info} alt=""/>
                        </div>
                    }
                    <div className={css.bonus_content}>
                        <img src={bonus.img} className={css.bonus__slide} alt=""/>
                    </div>
                    {bonus.body}
                    {
                        bonus?.slot_id === 4 && <div className={css.bonus__cashback}>
                            {"Сashback"} : 
                            {" " + bonus.bonus}
                            {" " + auth.user.currency?.sign}
                        </div>
                    }
                </div>)
            }
        </div>
        <div className={classNames(css.arrow, themes[variant]?.arrow, css.right, themes[variant]?.right, {[css.hidden]: withoutAnimation})}>
            <img src={arrowRight} alt="" onClick={() => (selected + 1) < slides.length && moveCarousel(selected + 1)}/>
        </div>
    </div>
}
