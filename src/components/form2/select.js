import classNames from "classnames";
import css from "./select.module.css";
import dropdownTriangle from "../../images/items/select-triangle.svg";
import searchIcon from "../../images/items/search.png";
import {useEffect, useMemo, useRef, useState} from "react";
import Scrollbar from "../scrollbar/scrollbar";
import useOnClickOutside from "../../utils/click-outside";
import {useTranslation} from "react-i18next";

export default function Select ({...properties}) {
    const {
        onChange,
        value,
        className,
        maxHeight,
        id,
        label,
        itemClass,
        error,
        placeholder = " ",
        options
    } = properties;
    const isSearchable = useMemo(() => options && options.length > 7, [options]);
    const ref = useRef();
    const [searchMode, setSearchMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const optionList = useRef();
    const [search, setSearch] = useState("");
    const [height, setHeight] = useState(optionList.current?.offsetHeight);
    const input = useRef();
    const {t} = useTranslation();

    useOnClickOutside(ref,() => setIsOpen(false));

    const MenuWrapper = ({children}) => {
        const containerWidth = ref.current?.offsetWidth;

        if (!maxHeight || options.length === 0) {
            return  (
                <div
                    className={classNames(css.select__container, {[css.hidden]: !isOpen})}
                    style={{width: containerWidth}}
                >
                    {children}
                </div>
            )
        } else {
            return (
                <div
                    className={classNames(css.select__container, css.scrollable, {[css.hidden]: !isOpen})}
                    style={{height: height < maxHeight ? (height - 17) : maxHeight, width: containerWidth}}
                >
                    {
                        searchMode &&
                        <div className={css.select__search}>
                            <input
                                ref={input}
                                type="text"
                                className={classNames(css.select__searchInput, itemClass)}
                                onChange={e => setSearch(e.target.value)}
                                value={search}
                                autoFocus={true}
                                placeholder={t("Search") + "..."}
                            />
                            {/*<img className={css.select__searchIcon} src={searchIcon} alt=""/>*/}
                        </div>
                    }
                    {
                        (search && list.length === 0) ? <NoMatches/> :
                            <Scrollbar autoHide={false}>
                                {children}
                            </Scrollbar>
                    }
                </div>
            );
        }
    };

    const filtered = list => {
        if (isSearchable && search) {
            const searchString = search.toLowerCase().trim();

            return list.filter(item => item.label.toLowerCase().trim().includes(searchString));
        } else  {
            return list;
        }
    };
    const list = options ? filtered(options) : [];

    function NoOptions() {
        return <div className={css.no_matches}>{t("No options")}</div>
    }
    function NoMatches() {
        return <div className={css.no_matches}>{t("No matches")}</div>
    }

    useEffect(() => {
        if (search && search.length > 0 && list.length === 0) {
            setHeight(150);
        } else {
            setHeight(optionList.current?.offsetHeight);
        }


    }, [optionList.current, search]);

    useEffect(() => {
        if (isSearchable) {
            setSearchMode(isOpen);
            setSearch("");
        }
    }, [isOpen]);

    return (
        <div className={(classNames(css.box, className, {[css.isSearchable]: isSearchable}))} ref={ref}>
            { label && <label className={css.label}>{label}</label> }
            <div
                className={classNames(css.wrapper, css.select, {[css.error]: !!error, [css.search]: searchMode})}
                onClick={() => {
                    if (!input.current || !input.current?.activeElement) {
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <div className={classNames(css.item, itemClass)}>
                    {value ? options.find(opt => opt.value === value.value)?.label : placeholder}
                </div>
                <img className={css.select__toggler} src={dropdownTriangle} alt=""/>
            </div>
            <MenuWrapper>
                <div ref={optionList} className={css.select__list}>
                    {
                        list.length > 0 && list.map(option =>
                            <div
                                onClick={() => {
                                    setIsOpen(false);
                                    onChange(option);
                                }}
                                className={css.select__listOption} key={`option-2-${id}-${option.value}`}
                            >
                                {option.label}
                            </div>
                        )
                    }
                    {
                        isSearchable && search && list.length === 0 && <NoMatches/>
                    }
                    {
                        !options || options.length === 0 && <NoOptions/>
                    }
                </div>
            </MenuWrapper>
        </div>

    );
}