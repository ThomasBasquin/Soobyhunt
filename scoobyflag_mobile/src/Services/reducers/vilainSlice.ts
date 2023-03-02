import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVilain from "../../Constantes/interfaces/vilain";

const initialState:IVilain[] = [];

export const vilainSlice = createSlice({
    name: "vilain",
    initialState,
    reducers: {
        setVilains: (state, action: PayloadAction<IVilain[]>) => {
            return action.payload;
        },
    },
});

export const { setVilains } = vilainSlice.actions;

export default vilainSlice.reducer;
