import ContentPane from "../content-pane/content-pane";
import React from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";

export default function Information() {
    const {t} = useTranslation();
    const params = useParams();

    return <ContentPane title={t(params?.id)}>
        {t("coming soon")}
    </ContentPane>;
}