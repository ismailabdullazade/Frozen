import {Carousel} from "react-responsive-carousel";
import Bonus1 from "../../../../images/bonuses/bonus-1.svg";
import Bonus2 from "../../../../images/bonuses/bonus-1.svg";
import Bonus3 from "../../../../images/bonuses/bonus-1.svg";
import withoutBonus from "../../../../images/bonuses/without-bonus.svg";
import css from "./bonus-carousel.module.css";
import classNames from "classnames";
import arrowLeft from "../../../../images/bonuses/arrow-left.svg";
import arrowRight from "../../../../images/bonuses/arrow-right.svg";
import React from "react";
import "./bonus-carousel.css";

export default function BonusCarouselNotUsed() {
    return <div className={css.container}>
        <Carousel
            renderArrowNext={
                (clickHandler, hasPrev, label) => <div onClick={clickHandler} className={classNames(css.arrow, css.right)}>
                   <img src={arrowRight} alt=""/>
                </div>
            }
            renderArrowPrev={
                (clickHandler) => <div onClick={clickHandler} className={classNames(css.arrow, css.left)}>
                    <img src={arrowLeft} alt=""/>
                </div>
            }
            centerMode={true}
            // centerSlidePercentage={42}
            swipeable={true}
            showThumbs={false}
            className={css.carousel}
            width={"80%"}
            showStatus={false}
            showIndicators={false}
            renderItem ={(item, options, isSelected) => {
                // item.className = css.slide
                const Item = React.cloneElement(item, {className: item.props.className + " " + css.selected})
console.log(options, isSelected, item.props.className)
                return Item;
            }}
        >
            <div className={css.bonus}>
                <div className={css.bonus_content}>
                    <img src={Bonus1} className={css.bonus_slide} alt=""/>
                </div>
            </div>
            <div className={css.bonus}>
                <div className={css.bonus_content}>
                    <img src={Bonus2} className={css.bonus_slide} alt=""/>
                </div>
            </div>
            <div className={css.bonus}>
                <div className={css.bonus_content}>
                    <img src={Bonus3} className={css.bonus_slide} alt=""/>
                </div>
            </div>
            <div className={css.bonus}>
                <div className={css.bonus_content}>
                    <img src={withoutBonus} className={css.bonus_slide} alt=""/>
                </div>
            </div>
        </Carousel>
    </div>
}
