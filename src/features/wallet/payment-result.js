import {Redirect, useHistory, useLocation, useParams} from "react-router-dom";

export default function PaymentResultHandle () {
    const {/*method, */result} = useParams();

    if (/*method && */result) {
        // window.localStorage.setItem("method", method);
        window.localStorage.setItem("result", result);
    }

    return <Redirect to={{
        pathname: "/wallet",
        state: { from: "/wallet" }
    }}/>
}