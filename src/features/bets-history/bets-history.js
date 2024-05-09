import {useTranslation} from "react-i18next";
import css from "./bets-history.module.css";
import ContentPane from "../../components/content-pane/content-pane";
import classNames from "classnames";
import moment from "moment";
import example from "../../images/example.png";
import Select from "../../components/form2/select";
import React, {useState} from "react";
import {useGetProvidersQuery} from "../../app/api/games.api";
import Datepicker from "../../components/Datepicker/datepicker";

export default function BetsHistory() {
    const {t} = useTranslation();
    const history = [
        {
            date: "2022-08-25T17:17:34",
            amount: 10,
            id: 1,
            sign: "₽",
            param: "NeTent",
            name: "Divine \nFortune",
            img: example
        },
        {
            date: "2022-08-25T17:17:34",
            amount: -20,
            id: 2,
            param: "NeTent",
            sign: "₽",
            name: "Divine\n Fortune",
            img: example
        },
        {
            date: "2022-08-25T17:17:34",
            id: 3,
            amount: 100,
            param: "NeTent",
            sign: "₽",
            name: "Divine\n Fortune",
            img: example
        }
    ];
    const [selectedProvider, setSelectedProvider] = useState(null);
    const {data: providersSource, error: providersError } = useGetProvidersQuery();
    const providers = providersSource ? providersSource.map(item => ({label: item.title, value: item.external_id})) : [];

    return (
        <ContentPane className={css.bets_history} paneClass={css.pane}>
            <div className={css.filters}>
                <Datepicker id={"date-filter"} placeholder={t("Period")} className={css.datepicker} config={{range: true}}/>
                <Select
                    onChange={val => setSelectedProvider(val)}
                    value={selectedProvider}
                    placeholder={t("Provider")}
                    // className={css.select}
                    itemClass={css.select}
                    options={providers}
                />
            </div>
            <ContentPane className={css.tab_content} paneClass={css.subpane}>
                {
                    history.map(item => (
                        <ContentPane key={`bets-history-item-${item.id}`} className={css.content_pane} paneClass={css.content}>
                            <div className={css.date_block}>
                                <span className={css.date}>
                                    {
                                        moment(item.date).format("DD.MM.YYYY")
                                    }
                                </span>
                                <br/>
                                <span className={css.time}>
                                    {
                                        moment(item.date).format("HH:MM:SS")
                                    } GMT
                                </span>
                            </div>
                            <div
                                className={classNames(css.amount, {
                                    [css.withdrawal]: item.amount < 0,
                                    [css.deposit]: item.amount > 0
                                })}
                            >
                                {item.amount}.00 {item.sign}
                            </div>
                            <div className={css.text}>{item.param}</div>
                            <div className={css.game_info}>
                                <span className={css.title}>
                                    {item.name}
                                </span>
                                <img src={item.img}  className={css.img}/>
                            </div>
                        </ContentPane>
                    ))
                }
            </ContentPane>
        </ContentPane>
    )
}