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
            return action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
