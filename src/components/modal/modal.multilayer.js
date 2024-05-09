import css from "./modal.multilayer.module.css";
import classNames from "classnames";

export default function ModalPane ({refModal, children}) {
    return (
        <div className={css.container}>
            <div className={css.container__gradient}>
                <div className={classNames(css.container__lighting, css.pink)}/>
                <div className={classNames(css.container__lighting, css.blond)}/>
                <div className={css.container__border}>
                    <div className={css.container__shadow}>
                        <div className={css.content} ref={refModal}>
                            {children}
                        </div>
                    </div>
                </div>
                <div className={classNames(css.container__lighting, css.yellow)}/>
            </div>
        </div>
    );
}