import {useState} from "react";
import {ForgotPasswordModal} from "../../features/user/password-recovery/forgot-password-modal";
import {ConfirmCodeModal} from "../../features/user/password-recovery/confirm-code-modal";
import {ResetPasswordModal} from "../../features/user/password-recovery/reset-password-modal";

const components = {
    ForgotPasswordModal,
    ConfirmCodeModal,
    ResetPasswordModal
};

export function PasswordRecoveryContainer() {
    const timer = localStorage.getItem("__respass");
    const [mode, setMode] = useState(timer ? "ConfirmCodeModal" : "ForgotPasswordModal");
    const [type, setType] = useState(localStorage.getItem("__respass_type"));
    const [target, setTarget] = useState(localStorage.getItem("__respass_target"));
    const [code, setCode] = useState();
    const Component = components[mode];

    return <Component
        setMode={setMode}
        type={type}
        setType={setType}
        code={code}
        setCode={setCode}
        timer={timer}
        target={target}
        setTarget={setTarget}
    />;
}