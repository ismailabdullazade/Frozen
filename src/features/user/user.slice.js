import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    balance: null,
    notification: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setBalance(state, action) {
            state.balance = {
                balance: action.payload.balance,
                bonus_balance: action.payload.bonus_balance
            }
        }
    }
});

export const {setBalance} = userSlice.actions;

export default userSlice.reducer;