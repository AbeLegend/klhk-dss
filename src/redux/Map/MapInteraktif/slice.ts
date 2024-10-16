// lib
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// local
import { WebServiceModel } from '@/api/types';

interface LayerItem extends WebServiceModel {
  isActive: boolean;
  isUsed: boolean;
}

interface MapInteraktifModel {
  layer: LayerItem[];
}

const initialState: MapInteraktifModel = {
  layer: [],
};

export const mapInteraktif = createSlice({
  name: 'mapInteraktif',
  initialState,
  reducers: {
    setLayer(state, action: PayloadAction<LayerItem[]>) {
      state.layer = action.payload;
    },
    toggleLayer(state, action: PayloadAction<{ id: number; layerData: WebServiceModel }>) {
      const { id, layerData } = action.payload;
      const existingLayerIndex = state.layer.findIndex((item) => item.Id === id);

      if (existingLayerIndex !== -1) {
        state.layer[existingLayerIndex].isActive = !state.layer[existingLayerIndex].isActive;
        if (state.layer[existingLayerIndex].isUsed) state.layer[existingLayerIndex].isUsed = !state.layer[existingLayerIndex].isUsed;
      } else {
        state.layer.push({
          ...layerData,
          isActive: true,
          isUsed: false,
        });
      }
    },
    updateLayer(state, action: PayloadAction<{ id: number; updatedData: Partial<LayerItem> }>) {
      const { id, updatedData } = action.payload;
      const existingLayerIndex = state.layer.findIndex((item) => item.Id === id);

      if (existingLayerIndex !== -1) {
        state.layer[existingLayerIndex] = {
          ...state.layer[existingLayerIndex],
          ...updatedData,
        };
      }
    },
    clearLayer(state) {
      state.layer = [];
    },
  },
});

export const { setLayer, toggleLayer, updateLayer, clearLayer } = mapInteraktif.actions;
export default mapInteraktif.reducer;
