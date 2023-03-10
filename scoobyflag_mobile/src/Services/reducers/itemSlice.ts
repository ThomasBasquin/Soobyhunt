import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IItem from "../../Constantes/interfaces/IItem";

const initialState:IItem[] = [];

export const itemSlice = createSlice({
    name: "item",
    initialState,
    reducers: {
        setItem: (state, action: PayloadAction<IItem[]>) => {
            return action.payload;
        },
    },
});

export const { setItem } = itemSlice.actions;

export default itemSlice.reducer;
