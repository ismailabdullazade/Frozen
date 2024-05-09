import css from "./pane-horizntal-scroll.module.css";
import leftArrow from "../../images/bonuses/arrow-left.svg";
import classNames from "classnames";
import rightArrow from "../../images/bonuses/arrow-right.svg";
import React, {useState, useEffect} from "react";

export default function PaneHorizontalScroll({children, className}) {
    const [scroll, setScroll] = useState(-6);
    const [maxScroll, setMaxScroll] = useState(0);
    const handleScroll = event => {
        setScroll(event.target.scrollLeft)
        setMaxScroll(event.target.scrollWidth - event.target.clientWidth)
    };

    useEffect(() => {
        const handleWindowScroll = () => {
          setScroll(window.scrollX);
        };
    
        window.addEventListener("scroll", handleWindowScroll);
    
        return () => {
          window.removeEventListener("scroll", handleWindowScroll);
        };
      }, []);

    return <div className={classNames(css.menu, className)} onScroll={handleScroll}>
        <img src={leftArrow}
             className={classNames(css.scrollLeft, {[css.scrollLeft_end]: scroll <= 5})} alt=""/>
        {children}
        <img src={rightArrow}
             className={classNames(css.scrollRight, {[css.scrollRight_end]: scroll >= maxScroll - 5})} alt=""/>
    </div>
}