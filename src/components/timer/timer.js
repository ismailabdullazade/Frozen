import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {resetTimerByID, setTime, setTimer} from "./timer.slice";

export default function Timer({text, start_timer, timeIsOverString, timerClass, uid, timeoutCallback}) {
    // const [timerInner, setTimerInner] = useState(start_timer);
    const dispatch = useDispatch();
    const timer = useSelector(state => state.timers.find(timer => timer.id === uid));

    useEffect(() => {
        if(!timer) {
            dispatch(setTimer({uid, timer: start_timer}));
        } else {
            //if timer already exist, lets update it
            let delay;
            if (timer.timer > 0) {
                delay = setTimeout(() => {
                    dispatch(
                        setTime({
                            timer: timer.timer - 1,
                            uid
                        })
                    );
                }, 1000);
            } else {
                timeoutCallback(uid);
            }

            return () => clearTimeout(delay);
        }
    }, [timer, uid]);
    // useEffect(() => {
    //     let delay;
    //     if (timerInner > 0) {
    //         delay = setTimeout(() => {
    //             setTimerInner(timerInner - 1);
    //         }, 1000);
    //     }
    //
    //     return () => clearTimeout(delay);
    // }, [timerInner]);

    if (!timer || timer.timer !== 0) {
        const seconds = timer ? timer.timer : start_timer;

        return (
            <>
                <span>{text}</span>
                &nbsp;&nbsp;
                <span className={timerClass}>{new Date(seconds * 1000).toISOString().substr(14, 5)}</span>
            </>
        );
    } else {
        return timeIsOverString;
    }
}