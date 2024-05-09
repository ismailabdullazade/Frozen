import css from "./bonus-card.module.css";
import classNames from "classnames";

export default function BonusCard (props) {
    const {title, details, index, onClick, isSelected, image, useIndexOnly} = props;

    const handleCardClick = () => {
        if (useIndexOnly) {
            onClick(index);
        } else {
            onClick(props);
        }
    };

    return (
        <div className={classNames(css.card, {[css.active]: isSelected})} onClick={handleCardClick}>
            <img
                src={image}
                className={css.card_img} 
                alt="" 
            />
            <div className={css.card_title}>{title}</div>
            <div className={css.card_details}>{details}</div>
        </div>
    )
}