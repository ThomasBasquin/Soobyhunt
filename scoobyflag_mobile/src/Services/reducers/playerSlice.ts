import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IItem from "../../Constantes/interfaces/IItem";
import IPlayer from "../../Constantes/interfaces/player";

const initialState:IPlayer[] = [];

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setPlayer: (state, action: PayloadAction<IPlayer[]>) => {
            return action.payload;
        },
    },
});

export const { setPlayer } = playerSlice.actions;

export default playerSlice.reducer;
