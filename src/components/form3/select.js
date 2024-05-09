import classNames from "classnames";
import css from "./select.module.css";
import dropdownTriangle from "../../images/items/select-triangle.svg";
import clearTriangle from "../../images/items/close_search.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import Scrollbar from "../scrollbar/scrollbar";
import useOnClickOutside from "../../utils/click-outside";
import { useTranslation } from "react-i18next";

export default function Select({ ...properties }) {
  const {
    onChange,
    value,
    className,
    maxHeight,
    id,
    label,
    itemClass,
    activeItemClass,
    containerClass,
    error,
    placeholder = " ",
    options,
    variant,
    selectContainerClass = "",
    isClearable = false,
  } = properties;
  const isSearchable = useMemo(() => options && options.length > 7, [options]);
  const ref = useRef();
  const [searchMode, setSearchMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const optionList = useRef();
  const [search, setSearch] = useState("");
  const [height, setHeight] = useState(optionList.current?.offsetHeight);
  const input = useRef();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));

  const MenuWrapper = ({ children }) => {
    const containerWidth = ref.current?.offsetWidth;

    if (!maxHeight || options.length === 0) {
      return (
        <div
          className={classNames(
            css.select__container,
            css[variant],
            selectContainerClass,
            { [css.hidden]: !isOpen }
          )}
          style={{ width: containerWidth }}
        >
          {children}
        </div>
      );
    } else {
      return (
        <div
          className={classNames(
            css.select__container,
            css[variant],
            css.scrollable,
            selectContainerClass,
            { [css.hidden]: !isOpen }
          )}
          style={{
            height: height < maxHeight ? height + 96 : maxHeight,
            width: containerWidth,
          }}
        >
          {searchMode && (
            <div className={css.select__search}>
              <input
                ref={input}
                type="text"
                className={classNames(css.select__searchInput, itemClass)}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                autoFocus={true}
                placeholder={t("Search") + "..."}
              />
              {/*<img className={css.select__searchIcon} src={searchIcon} alt=""/>*/}
            </div>
          )}
          {search && list.length === 0 ? (
            <NoMatches />
          ) : (
            <Scrollbar autoHide={false}>{children}</Scrollbar>
          )}
        </div>
      );
    }
  };

  const filtered = (list) => {
    if (isSearchable && search) {
      const searchString = search.toLowerCase().trim();
      return list.filter((item) =>
        item.label.toLowerCase().trim().includes(searchString)
      );
    } else {
      return list;
    }
  };
  const list = options ? filtered(options) : [];

  function NoOptions() {
    return <div className={css.no_matches}>{t("No options")}</div>;
  }
  function NoMatches() {
    return <div className={css.no_matches}>{t("No matches")}</div>;
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

  useEffect(() => {
    if (!!value && variant === "search") {
      setSearchValue(true);
    } else {
      setSearchValue(false);
    }
  }, [value, variant]);

  function highlightSearchText(text, search) {
    if (!search) {
      return text;
    }

    const lowerCaseText = text.toLowerCase();
    const lowerCaseSearch = search.toLowerCase();
    const startIndex = lowerCaseText.indexOf(lowerCaseSearch);

    if (startIndex === -1) {
      return text;
    }

    const endIndex = startIndex + search.length;
    const beforeMatch = text.slice(0, startIndex);
    const match = text.slice(startIndex, endIndex);
    const afterMatch = text.slice(endIndex);

    return (
      <span>
        {beforeMatch}
        <span className={css.highlightedText}>{match}</span>
        {afterMatch}
      </span>
    );
  }

  return (
    <div
      className={classNames(css.box, className, css[variant], {
        [css.isSearchable]: isSearchable,
      })}
      ref={ref}
    >
      {label && <label className={css.label}>{label}</label>}
      <div
        className={classNames(css.wrapper, css.select, {
          [css.error]: !!error,
          [css.search]: searchMode,
        })}
        onClick={() => {
          if (!input.current || !input.current?.activeElement) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className={classNames(css.container, containerClass)}>
          <div
            className={classNames(css.slice, {
              [css.focus_visible]: isOpen,
            })}
          />
          <div
            className={classNames(css.item_select, itemClass ?? css.item, {
              [css.activeItem]:
                (variant === "search" && value?.length) || value?.value,
              [activeItemClass]:
                (variant === "search" && value?.length) || value?.value,
              [css.focus_visible]: isOpen,
              [css.active]: isClearable && value,
            })}
          >
            {value ? (
              variant === "search" ? (
                options.find((opt) => opt.value === value)?.label
              ) : (
                options.find((opt) => opt.value === value.value)?.label
              )
            ) : (
              <span className={"placeholder"}>{placeholder}</span>
            )}
          </div>
          {isClearable && value ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setTimeout(() => setIsOpen(true), 0);
              }}
              className={css.clear}
            >
              <img src={clearTriangle} alt="" />
            </div>
          ) : (
            <img
              className={classNames(css.select__toggler, {
                [css.opened]: isOpen,
              })}
              src={dropdownTriangle}
              alt=""
            />
          )}
        </div>
      </div>
      <MenuWrapper>
        <div ref={optionList} className={css.select__list}>
          {list.length > 0 ? (
            list.map((option) => (
              <div
                onClick={() => {
                  setIsOpen(false);
                  onChange(option);
                }}
                className={classNames(css.select__listOption, css[variant])}
                key={`option-2-${id}-${option.value}`}
              >
                {highlightSearchText(option.label, search)}
              </div>
            ))
          ) : (
            <NoMatches />
          )}
          {!options || options.length === 0 ? <NoOptions /> : null}
        </div>
      </MenuWrapper>
    </div>
  );
}
