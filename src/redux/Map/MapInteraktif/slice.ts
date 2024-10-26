// lib
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// local
import { ReduxLocation, ReduxMapInteraktifModel, UriTitleMapType } from './type';

const initialState: ReduxMapInteraktifModel = {
  layer: [],
  location: {
    latitude: 0,
    longitude: 0,
  },
  isOpenModal: false,
  searchLocation: "",
};


export const mapInteraktif = createSlice({
  name: 'mapInteraktif',
  initialState,
  reducers: {
    // layer[]
    setLayer(state, action: PayloadAction<UriTitleMapType[]>) {
      state.layer = action.payload;
    },
    toggleLayer(state, action: PayloadAction<{ title: string; layerData: UriTitleMapType }>) {
      const { title, layerData } = action.payload;
      const existingLayerIndex = state.layer.findIndex((item) => item.UriTitle === title);

      if (existingLayerIndex !== -1) {
        state.layer[existingLayerIndex].isActive = !state.layer[existingLayerIndex].isActive;
        if (state.layer[existingLayerIndex].isUsed) {
          state.layer[existingLayerIndex].isUsed = !state.layer[existingLayerIndex].isUsed;
        }
      } else {

        state.layer.push({
          ...layerData,
          isActive: true,
          isUsed: false,
        });
      }
    },
    updateLayer(state, action: PayloadAction<{ title: string; updatedData: Partial<UriTitleMapType> }>) {
      const { title, updatedData } = action.payload;
      const existingLayerIndex = state.layer.findIndex((item) => item.UriTitle === title);

      if (existingLayerIndex !== -1) {
        const { isActive, isUsed, ...restData } = updatedData;

        state.layer[existingLayerIndex] = {
          ...state.layer[existingLayerIndex],
          ...restData,
        };
      }
    },
    clearLayer(state) {
      state.layer = [];
    },
    // location
    setLocation(state, action: PayloadAction<ReduxLocation>) {
      state.location = action.payload;
    },
    setIsOpenModalMap(state, action: PayloadAction<boolean>) {
      state.isOpenModal = action.payload;
    },
    setSearchLocation(state, action: PayloadAction<string>) {
      state.searchLocation = action.payload;
    },
  },
});

export const {
  // layer[]
  setLayer, toggleLayer, updateLayer, clearLayer,
  // location
  setLocation,
  // modal
  setIsOpenModalMap,
  // search
  setSearchLocation
} = mapInteraktif.actions;
export default mapInteraktif.reducer;
