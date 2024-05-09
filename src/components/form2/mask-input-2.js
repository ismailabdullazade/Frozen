import React, {useEffect, useState} from "react";

import Input from "./input";
import {toCurrencyString} from "../../utils/validation";

export default function MaskInput(props) {
    let {value, onChange, currencySubunits = 2} = props;

    return <Input
        {...props}
        value={value}
        onChange={val => {
            const parts = val.split(".");
            // if (parts[1]?.length > currencySubunits) {
            //     return null;
            // }
            // console.log(val, typeof val)
            onChange(Math.round(val));
        }}
    />
}