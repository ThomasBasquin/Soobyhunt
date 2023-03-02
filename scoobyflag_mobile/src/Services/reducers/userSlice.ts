import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../../Constantes/interfaces/user";

const initialState: IUser = {
  username:"",
  team:"",
  latitude:0,
  longitude:0
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.username = action.payload.username;
            state.team = action.payload.team;
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
