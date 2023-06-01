import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {};

export const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setServer: (state, action) => {
            return action.payload;
        },
    },
});

export const { setServer } = serverSlice.actions;

export default serverSlice.reducer;
