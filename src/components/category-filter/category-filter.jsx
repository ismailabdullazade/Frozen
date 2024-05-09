import css from "./category-filter.module.css";
import dropdownTriangle from "../../images/items/select-triangle.svg";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {setProvidersOpenedSlice, setShowCategoryBlockSlice} from "../../features/games/game.slice";
import {useDispatch} from "react-redux";
export default function NewCategorySelector( ) {
    const { t } = useTranslation();
    const [showCategoryBlock, setShowCategoryBlock] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (showCategoryBlock) {
            dispatch(setShowCategoryBlockSlice(true));
        } else {
            dispatch(setShowCategoryBlockSlice(false));
        }
        // eslint-disable-next-line
    }, [showCategoryBlock]);
     return (
         <div className={css.select}  onClick={() => {
             setShowCategoryBlock(!showCategoryBlock);
         }}>
             <p> {t("categories")}</p>
             <img
                 src={dropdownTriangle}
                 className={showCategoryBlock ? css.rotated : ""}
                 alt=""/>
         </div>
     )
}
