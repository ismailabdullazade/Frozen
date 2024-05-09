import css from "./vip-club.module.css";

export default function VipClubCard(props) {
    const { image, title, text } = props;

    return (
        <div className={css.card}>
            <img src={image} className={css.card_img} alt="" />
            <span className={css.card_title}>{title}</span>
            <span className={css.card_text}>{text}</span>
        </div>
    )
}