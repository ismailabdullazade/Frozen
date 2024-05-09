import classNames from "classnames";
import css from "./inner-pane.module.css";

export default  function InnerPane({children, className = "", title, paneClass = ""}){
    return (
        <div className={classNames("content", className)}>
            { title && <div className="content-title">{title}</div> }

            <div className={classNames(css.content_pane, {[css.margin_top_0]: !title}, paneClass)}>{children}</div>
        </div>
    );
}