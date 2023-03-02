import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IVilain from "../../Constantes/interfaces/vilain";

const initialState: IVilain[] = [];

export const vilainSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setVilain: (state, action: PayloadAction<IVilain[]>) => {
            state = [{idMechant: 1, longitude: 7.735623243322919, latitude: 48.53043403291962}];
        },
    },
});

export const { setVilain } = vilainSlice.actions;

export default vilainSlice.reducer;
