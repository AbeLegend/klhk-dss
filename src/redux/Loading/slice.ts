// lib
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// local

interface LoadingModel {
  general: boolean,
}

const initialState: LoadingModel = {
  general: false
};

export const loading = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    // layer[]
    SetLoadingGeneral(state, action: PayloadAction<boolean>) {
      state.general = action.payload;
    },
  },
});

export const {
  // layer[]
  SetLoadingGeneral
} = loading.actions;
export default loading.reducer;
