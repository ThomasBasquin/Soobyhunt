import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state = action.payload;
    },
  },
});

export const {setUser} = authSlice.actions;

export default authSlice.reducer;
