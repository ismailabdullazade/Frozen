import {useEffect, useState, useMemo} from "react";
import classNames from "classnames";
import styles from "./ricib.module.css"
import Input from "../form3/input";
import { useTranslation } from "react-i18next";

export default function Ricib({type = "text", errorClass, length, errorMsg = null, onComplete = () => {}, advInputClass = "", onChange = () => {}}){
    const [error, setError] = useState(errorMsg);
    const inputClassName = classNames({
            [styles.invalidInput]: error
        },
        styles.ricib,
        advInputClass
    );
    const [code, setCode] = useState(new Array(length).fill(""));
    const {t} = useTranslation();
      
    const handleInputChange = (value) => {
        let sanitizedValue = value.replace(/[^0-9]/g, "");
        if (sanitizedValue.length <= length) {
          setCode(sanitizedValue.split(""));
          onChange(sanitizedValue);
        }
      };

    useEffect(() => {
        setError(errorMsg);
    }, [errorMsg])

    useEffect(() => {
        if (code.join("").length === length) {
          onComplete(code.join(""));
        }
        onChange(code.join(""));
      }, [code]);

    return (
        <div className={inputClassName}>
            <Input
                type={type}
                autoFocus={true}
                className={styles.input}
                onChange={handleInputChange}
                placeholder={t("enter code")}
                maxLength={length}
                value={code.join("")}
            />
            {
                error && <div className={classNames(styles.errorMsg, errorClass)}>{error}</div>
            }
        </div>
    );
}