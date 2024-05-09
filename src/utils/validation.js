import i18n from "i18next";

export function validateEmail(email = "") {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function validatePhoneNumbers(phone = "") {
    return phone.match(/^[\d+]+$/);
}

export function validatePhoneNumbersLength(phone = "") {
    return phone.length > 7 && phone.length < 14
}

export function checkLogin (value = "") {
    let err = {};

    if (!value.length) {
        return err;
    }

    if (validatePhoneNumbers(value)) {
        if (validatePhoneNumbersLength(value)) {
            err = {"login": null};
            // Format input acc to phone no
        } else {
            err = {"login": i18n.t("could be Phone Number")};
        }
    } else {
        if (validateEmail(value)) {
            // Format input acc to Email
            err = {"login": null};
        } else {
            err = {"login": i18n.t("could be Email")};
        }
    }

    return err;
}

export const digitsValue = (val) => {
    // Remove all non-digit characters and add spaces after every fourth digit
    const digitsOnly = val.replace(/\D/g, '');
    const formattedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
  
    return formattedValue;
  }

export const normalizeNumericAmountToString = amount => {
    return typeof amount === "string"
        ? amount.replace(/\s/g, "")
        : amount?.toString().replace(/\s/g, "");
}

export const toCurrencyString = (val, toFixed = 2) => {
    if (!val) {
        return  "";
    }
    let result = val;

    if (typeof val === "number") {
        result = val.toFixed(toFixed);
    }
    const float = parseFloat(result);

    return  Number.isNaN(float) ? result : float.toLocaleString("us", { minimumFractionDigits: toFixed}).replace(',', '.');
}

export function isEmptyFilters (filters) {
    if (!filters) {
        return true
    }

    if (!filters.title && !filters.section && !filters.producer) {
        return true
    }

    return false
}