import classNames from "classnames";
import css from "../payment-default.module.css";

export default function PaymentItem({ onClick = {}, icon, isActive }) {
  return (
    <div
      onClick={onClick}
      className={classNames(css.item, { [css.active]: isActive })}
    >
      {icon && <img src={icon} alt="" />}
    </div>
  );
}
