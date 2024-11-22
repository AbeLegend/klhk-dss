// lib
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// local
interface DataType {
  coordinate: {
    lat: number | null;
    long: number | null;
  };
  layers: {
    layerName: string;
    id: string[];
  }[];
}

interface LayerServiceModel {
  geom: string;
  data: DataType | null; // useless
  isShpMode: boolean;
  isHardcodeMode: boolean;
  IdLayerService: string;

}

const initialState: LayerServiceModel = {
  geom: "",
  data: null,
  isShpMode: false,
  IdLayerService: "",
  isHardcodeMode: false,
};

export const layerServiceSlice = createSlice({
  name: 'layerService',
  initialState,
  reducers: {
    SetGeom(state, action: PayloadAction<string>) {
      state.geom = action.payload;
    },
    SetLayerService(state, action: PayloadAction<DataType>) {
      if (state.data === null) {
        // Jika data masih null, langsung set data
        state.data = action.payload;
      } else {
        // Jika data sudah ada, update data
        state.data = {
          ...state.data,
          coordinate: {
            lat: action.payload.coordinate.lat ?? state.data.coordinate.lat,
            long: action.payload.coordinate.long ?? state.data.coordinate.long,
          }, // Perbarui coordinate hanya jika ada nilai baru
          layers: [
            ...state.data.layers,
            ...action.payload.layers.filter(
              newLayer => !state.data?.layers.some(existingLayer => existingLayer.layerName === newLayer.layerName)
            ),
          ], // Tambahkan layers baru tanpa menduplikasi
        };
      }
    },
    RemoveLayer(state, action: PayloadAction<string>) {
      // Periksa jika data ada
      if (state.data) {
        state.data.layers = state.data.layers.filter(
          (layer) => layer.layerName !== action.payload
        );
      }
    },
    UpdateCoordinate(
      state,
      action: PayloadAction<{ lat: number | null; long: number | null }>
    ) {
      if (state.data) {
        state.data.coordinate = {
          lat: action.payload.lat ?? state.data.coordinate.lat,
          long: action.payload.long ?? state.data.coordinate.long,
        };
      }
    },
    SetShpMode(state, action: PayloadAction<boolean>) {
      state.isShpMode = action.payload;
    },
    SetIdLayerService(state, action: PayloadAction<string>) {
      state.IdLayerService = action.payload;
    },
  },
});

export const {
  SetGeom,
  SetLayerService,
  RemoveLayer,
  UpdateCoordinate,
  SetShpMode,
  SetIdLayerService
} = layerServiceSlice.actions;

export default layerServiceSlice.reducer;
