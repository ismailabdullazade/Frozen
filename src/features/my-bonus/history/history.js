import {useTranslation} from "react-i18next";
import css from "./history.module.css";
import {Link, useLocation} from "react-router-dom";
import ContentPane from "../../../components/content-pane/content-pane";
import classNames from "classnames";
import moment from "moment";
import Select from "../../../components/form3/select";
import React, {useEffect, useMemo, useState} from "react";
import Datepicker from "../../../components/Datepicker/datepicker";
import {useGetHistoryMutation} from "../../../app/api/bonus.api";
import Loader from "../../../components/loader/Loader";
import Button from "../../../components/button/button";
import Pagination from "../../../components/pagination/pagination";
import {searchParams} from "../../../utils/search-params";
import HistoryItems from "./history-items";
import gift from "../../../images/gift.svg";

export default function History() {
    const {t} = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState({label: t("All status"), value: ""});
    const status = [
        {label: t("All status"), value: ""},
        // {label: t("Initial"), value: "initial"},
        // {label: t("Activated"), value: "in_progress"},
        // {label: t("Canceled"), value: "cancel"},
        {label: t("Canceled"), value: "lose"},
        {label: t("Played"), value: "win"}
    ];
    const location = useLocation();
    const searchParameters = searchParams(location.search);
    const [page, setPage] = useState(parseInt(searchParameters.page ? searchParameters.page : 1));
    const [accepted_at, setAcceptedDate] = useState(null);
    const [fetchHistory, {data: history, isLoading, isFetching, error, isUninitialized, reset}] = useGetHistoryMutation();
    const historyItems = useMemo(() => !isFetching && !isLoading && history?.data?.length > 0 && history.data, [history, error]);
    const filterApplied = useMemo(() => !!accepted_at || !!selectedStatus?.value, [accepted_at, selectedStatus]);
    const datepickerParams = {
        id:"date-filter",
        placeholder:  t("Period"),
        className: css.datepicker,
        config:{
            range: false,
            maxDate: new Date(),
            // focusDate: new Date(),
            // viewDate: new Date()
        },
        nullable: true,
        onChange: val => {
            setAcceptedDate(val.date ? moment(val.date).format("YYYY-MM-DD") : val.date);

        }
    }

    useEffect(() => {
        if (!isLoading && !history) {
            fetchHistory({
                status: selectedStatus.value,
                accepted_at,
                page
            });
        }
        // eslint-disable-next-line
    }, [history]);
    useEffect(() => {
        if (history && !isLoading) {
            fetchHistory({
                status: selectedStatus.value,
                accepted_at,
                page
            });
        }
        // eslint-disable-next-line
    }, [page]);

    useEffect(() => {
        if (history && !isLoading) {
            setPage(1);
            fetchHistory({
                status: selectedStatus.value,
                accepted_at,
                page
            });
        }
        // eslint-disable-next-line
    }, [accepted_at, selectedStatus]);

    useEffect(() => {
        if (location.pathname) {
            reset();
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    if (accepted_at) {
        datepickerParams.value = moment(accepted_at).format(t("date format"))
    }
    console.log("historyItems", history)

    return (
        <ContentPane className={css.history} paneClass={css.pane}>
            <div className={css.gift}>
                <img src={gift} alt="Gift"/>
                {t("bonus history")}</div>
            <div className={css.filters}>
                <Datepicker
                    {...datepickerParams}
                />
                <Select
                    onChange={val => setSelectedStatus(val)}
                    value={selectedStatus}
                    placeholder={t("Status")}
                    className={css.selectWrapper}
                    itemClass={css.select}
                    options={status}
                    variant="top"
                    activeItemClass={css.selectedStatus}
                />
            </div>
            <HistoryItems historyItems={historyItems}/>
            {
                !isUninitialized && !historyItems && history && !filterApplied &&
                <div className={classNames(css.info_container, css.direction_column)}>
                    <span className={css.no_bonus_text}>{t("You have not activated the bonus yet")}</span>
                    <Link to={"/wallet"}><Button>{t("Select bonus")}</Button></Link>
                </div>
            }
            {
                filterApplied && !historyItems && !isLoading && !isFetching &&
                <div className={classNames(css.info_container, css.direction_column)}>
                    <span className={css.no_bonus_text}>{t("Nothing found")}</span>
                </div>
            }
            {
                (isLoading || isFetching) && <div className={css.info_container}><Loader/></div>
            }
            {
                historyItems && <Pagination
                    className={css.pagination}
                    setPage={setPage}
                    lastPage={history ? history.last_page : 1}
                    page={page}
                />
            }
        </ContentPane>
    )
}
