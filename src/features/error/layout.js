import css from "./error.module.css";
import {useLayoutEffect} from "react";

export default function ErrorLayout({children}) {
    useLayoutEffect(() => {
        window.closeSplash();
    });


    return (
        <div className={css.layout}>
            {children}
        </div>
    );
}