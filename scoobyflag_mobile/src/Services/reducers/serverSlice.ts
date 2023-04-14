import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IServer from "../../Constantes/interfaces/IServer";

const initialState:IServer = {};

export const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setServer: (state, action: PayloadAction<IServer>) => {
            return action.payload;
        },
    },
});

export const { setServer } = serverSlice.actions;

export default serverSlice.reducer;
