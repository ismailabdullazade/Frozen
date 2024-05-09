import Select from "../../../components/form3/select";
import React from "react";
import css from "./category-selector.module.css"

export default function CategorySelector({options, placeholder, onChange, value, noOptionsMessage}) {
  return <Select
    options={options}
    isClearable={true}
    placeholder={placeholder}
    value={value}
    className={css.categorySelector}
    onChange={onChange}
    containerClass={css.containerClass}
    noOptionsMessage={noOptionsMessage}
    variant="search"
    itemClass={css.item}
  />
}