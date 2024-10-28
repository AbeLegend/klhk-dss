// lib
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// local

const initialState = {

};

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // layer[]
    setLayer(state, action: PayloadAction<[]>) {
      // state.layer = action.payload;
    },

  },
});

export const {
  // layer[]
  setLayer
} = auth.actions;
export default auth.reducer;
