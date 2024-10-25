// lib
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// local
import { WebServiceModel } from '@/api/types';
import { ReduxLayerItem, ReduxLayerWebService, ReduxLocation, ReduxMapInteraktifModel } from './type';

const initialState: ReduxMapInteraktifModel = {
  layer: [],
  location: {
    latitude: 0,
    longitude: 0,
  },
  isOpenModal: false,
  searchLocation: ""
};


export const mapInteraktif = createSlice({
  name: 'mapInteraktif',
  initialState,
  reducers: {
    // layer[]
    setLayer(state, action: PayloadAction<ReduxLayerItem[]>) {
      state.layer = action.payload;
    },
    toggleLayer(state, action: PayloadAction<{ id: number; layerData: WebServiceModel }>) {
      const { id, layerData } = action.payload;
      const existingLayerIndex = state.layer.findIndex((item) => item.WebService.Id === id);

      if (existingLayerIndex !== -1) {
        state.layer[existingLayerIndex].WebService.isActive = !state.layer[existingLayerIndex].WebService.isActive;
        if (state.layer[existingLayerIndex].WebService.isUsed) {
          state.layer[existingLayerIndex].WebService.isUsed = !state.layer[existingLayerIndex].WebService.isUsed;
        }
      } else {
        state.layer.push({
          WebService: {
            ...layerData,
            isActive: true,
            isUsed: false,
          },
          Properties: [],
        });
      }
    },
    updateLayer(state, action: PayloadAction<{ id: number; updatedData: Partial<ReduxLayerWebService> }>) {
      const { id, updatedData } = action.payload;
      const existingLayerIndex = state.layer.findIndex((item) => item.WebService.Id === id);

      if (existingLayerIndex !== -1) {
        state.layer[existingLayerIndex].WebService = {
          ...state.layer[existingLayerIndex].WebService,
          ...updatedData,
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
