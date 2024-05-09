import { createSlice } from '@reduxjs/toolkit';

const initialState = [];


export const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        resetAllTimers: state => {
            state = initialState;
        },
        resetTimerByID: (state, action) => {
            if (action.payload) {
                state = state.filter(timer => timer.id !== action.payload);
            }
        },
        setTimer: (state, action) => {
            state.push({
                id: action.payload.uid,
                timer: action.payload.timer
            });
        },
        setTime: (state, action) => {

            state = state.map(timer => {
                if (timer.id === action.payload.uid) {
                    timer.timer = action.payload.timer;
                }

                return timer;
            });

        }
    }
});

export const { resetAllTimers, resetTimerByID, setTimer, setTime} = timerSlice.actions;

export default timerSlice.reducer;