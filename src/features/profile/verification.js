import classNames from "classnames";
import ContentPane from "../../components/content-pane/content-pane";
import css from "./profile.module.css";
import SumsubWebSdk from '@sumsub/websdk-react'
import Modal from "../../components/modal/modal";
import Button from "../../components/button/button";
import Input from "../../components/form3/input";
import Tooltip from "../../components/tooltip/tooltip";
import { useMediaQuery } from "beautiful-react-hooks";
import { useMemo, useState } from "react";
// import notVerified from "../../images/profile/fail_verification.svg"
import notVerified from "../../images/profile/fail_verification.png"
// import verified from "../../images/profile/good_verification.svg"
import verified from "../../images/profile/succeed_verification.png"
import info from "../../images/items/info.svg";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../services/auth";
import { useGetVerificationTokenMutation } from "../../app/api/user.api";

export default function Verification () {
    const {t} = useTranslation();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const auth = useAuth();
    const [tooltipIsOpen, setIsOpen] = useState();
    const [getToken, {data: verificationToken, isLoading, error: verificationError, reset}] = useGetVerificationTokenMutation();
    const [verificationInProgress, setVerificationInProgress] = useState(auth.user.auth_level === 1);

    const status = useMemo(() => {
        if (auth.user.auth_level === 1 || verificationInProgress) {
            return "Verification in progress";
        }
        if (auth.user.auth_level === 3 /*&& auth.user.verified*/) {
            return "passed";
        }
        if (auth.user.auth_level === 0 /*&& !auth.user.verified*/) {
            return "not passed";
        }
        if (auth.user.auth_level === 2 /*&& !auth.user.verified*/) {
            return "Rejected";
        }
        /*
        1. смотри, чел зарегался, у него по умолчанию статус 0 - не проходил
        2. начал проходить - 1 - в ожидании
        3. Прошел не успешно - 2 - отказано
        4. Прошел успешно - 3 - верифицирован
        * */
    }, [auth, verificationInProgress]);

    const statusElements = {
        "not passed": (
          <Button 
            onClick={() => getToken()}
            variant={"gold_revert"}
          >
            {t("begin")}
          </Button>
        ),
        "Rejected": <img src={notVerified} alt="" />,
        "passed": <img src={verified} alt="" />,
    };
    const elementToDisplay = statusElements[status];


    return (
        <div className={css.block}>
            <ContentPane 
                className={classNames(css.pane, css.pane_padding, css.pane_verification, {[css.half_height]: !isMobile})} 
                paneClass={classNames(css.without_shadow, css.full_height, css.pane__content, css.pane__content_padding)}
            >
                <div
                    className={
                        classNames(
                            css.title,
                            css.verification,
                            {
                                [css.notVerified]: status === "not passed" || status === "Verification in progress"
                            }
                        )
                    }
                >
                    <div className={css.verification_block}>
                        <div
                            className={
                                classNames(
                                    css.central_block,
                                    css.padding_top,
                                    {
                                        [css.notVerified]: status === "not passed" || status === "Verification in progress"
                                    }
                                )
                            }
                        >
                            <Input
                                value={t(status)}
                                disabled={true}
                                label={t("verification")}
                                variant="profile"
                            />
                        </div>
                    </div>
                </div>
                <div className={css.verification_status}>
                    {elementToDisplay}
                </div>
                <Modal
                    modalTitle={t("verification")}
                    isOpen={verificationToken}
                    overlayClassName={css.modal_verification__overlay}
                    closeModal={reset}
                    theme={"light_flex"}
                    modalClassName={css.modal_verification}
                >
                    {verificationToken && <SumsubWebSdk
                        accessToken={verificationToken.data}
                        expirationHandler={() => {}}
                        config={{}}
                        options={{}}
                        onMessage={(type, payload) => {
                            if (type.includes("onApplicantResubmitted") || type.includes("onApplicantSubmitted")) {
                                setVerificationInProgress(true);
                            }
                            console.log("onMessage", type, payload)
                        }}
                        onError={() => {}}
                    />}
                </Modal>
            </ContentPane>
        </div>

    )
}