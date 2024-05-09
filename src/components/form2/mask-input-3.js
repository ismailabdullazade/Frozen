import React, {useEffect, useState} from "react";

import Input from "./input";
import {toCurrencyString} from "../../utils/validation";

export default function MaskInput(props) {
    let {value, onChange, currencySubunits = 2} = props;
    const getNumberValue = val => {
      if (typeof val === "number") {
        return parseFloat(val).toFixed(currencySubunits);
      }
      // Удаление всех нецифровых символов, кроме точки
      const cleanedValue = val.toString().replace(/[^\d.]/g, '').replace(/^([^.]*\.)|\./g, '$1');

      // Разбиение числа на целую и дробную части
      const [integerPart, decimalPart] = cleanedValue.split('.');

      // Добавление пробелов после каждых трех цифр до точки
      let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

      // Добавление точки и дробной части
      let formattedValue = formattedIntegerPart;
      if (decimalPart !== undefined /*&& decimalPart !== ''*/) {
        formattedValue += `.${decimalPart.slice(0, currencySubunits)}`;
      }

      return formattedValue;
    };

    return <Input
        {...props}
        value={getNumberValue(value)}
        onChange={val => {
          const floatValue = val.toString().replace(/\s/g, "");
          onChange(floatValue);
        }}
    />
}