import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import IUser from '../../Constantes/interfaces/user';

const initialState:IUser = {lastname:"test",firstname:"test",email:"test"};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state = action.payload;
    },
  },
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;
