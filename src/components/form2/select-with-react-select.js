import classNames from "classnames";
import css from "./style.module.css";
import ReactSelect  from 'react-select';
import dropdownTriangle from "../../images/items/select-triangle.svg";
import {useRef} from "react";
import Scrollbar from "../scrollbar/scrollbar";

export default function Select (properties) {
    const {onChange, value, className, label, error, placeholder, options} = properties;
    const ref = useRef();
    const CustomOption = (props) => {
        const { innerProps, isDisabled, label } = props;

        return  !isDisabled ? (
            <div {...innerProps} className={css.option}>{label}</div>
        ) : null;
    }
    const Menu = props => {
        const {children} = props;

        return <div className={css.menu}><Scrollbar>{children}</Scrollbar></div>
    };
    const MenuList = ({ children, innerProps, innerRef, maxHeight = "100px"  }) => {


        return <div
            // maxHeight={maxHeight}
            // innerRef={innerRef}
            className={css.menu_list}
        >

            {children}
        </div>
    }
    const SelectContainer = props => {

        const {children} = props;

        return <div className={classNames(css.item, css.select_container)}>{children}</div>
    }
    const SingleValue = props => {
      return <div className={css.single_value}>{props.children}</div>
    };
    const Placeholder = props => {
        return <div className={css.select_placeholder}>{props.children}</div>
    }
    const IndicatorSeparator = () => null;
    const DropdownIndicator = props => {
        const {isFocused} = props;

      return <img src={dropdownTriangle} className={classNames(css.dropdown_indicator, {[css.dropdown_focused]: isFocused})}/>
    }
    const customStyles = {
        ///.....
        menuPortal: provided => ({ ...provided, zIndex: 9999 }),
        menu: provided => ({ ...provided, zIndex: 9999, backgroundColor: "transparent" })
        ///.....
    }

    return (
        <div className={(classNames(css.box, className))} ref={ref}>
            { label && <label className={css.label}>{label}</label> }
            <div className={classNames(css.wrapper, {[css.error]: !!error})}>
                <ReactSelect
                    {...properties}
                    placeholder={placeholder}
                    menuPortalTarget={document.body}
                    // menuPosition={'absolute'}
                     styles={customStyles}
                    components={{
                        Option: CustomOption,
                        MenuList,
                        SelectContainer,
                         SingleValue,
                        Menu,
                        Placeholder,
                        IndicatorSeparator,
                        DropdownIndicator
                    }}
                    // captureMenuScroll={false}
                    // closeMenuOnScroll={true}
                    // closeMenuOnSelect={false}
                    value={value}
                    onChange={val => {
                        console.log(val);
                        onChange({value: val.value, label:  val.label})
                    }}
                    options={options}
                />
            </div>

        </div>

    );
}