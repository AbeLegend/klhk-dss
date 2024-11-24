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
  IsSummary: boolean;
  IsShowOverlay: boolean;
  IsLoadingOverlay: boolean;
  IdLayerService: string;
  IdLayerServices: string[];
  IdWebServices: number[];
  IsTriggerIntersect: boolean;
  IsTriggerGetPropertiesByGeom: boolean;

}

const initialState: LayerServiceModel = {
  geom: "",
  data: null,
  IsSummary: true,
  IsShowOverlay: false,
  IsLoadingOverlay: false,
  IdLayerService: "",
  IdLayerServices: [],
  IdWebServices: [],
  IsTriggerIntersect: false,
  IsTriggerGetPropertiesByGeom: false

};

export const layerServiceSlice = createSlice({
  name: 'layerService',
  initialState,
  reducers: {
    SetGeom(state, action: PayloadAction<string>) {
      state.geom = action.payload;
    },
    SetIsSummary(state, action: PayloadAction<boolean>) {
      state.IsSummary = action.payload;
    },
    SetIsShowOverlay(state, action: PayloadAction<boolean>) {
      state.IsShowOverlay = action.payload;
    },
    SetIsLoadingOverlay(state, action: PayloadAction<boolean>) {
      state.IsLoadingOverlay = action.payload;
    },
    SetIdLayerService(state, action: PayloadAction<string>) {
      state.IdLayerService = action.payload;
    },
    SetIdLayerServices(state, action: PayloadAction<string[]>) {
      state.IdLayerServices = action.payload;
    },
    SetIdWebServices(state, action: PayloadAction<number[]>) {
      state.IdWebServices = action.payload;
    },
    SetTriggerIntersect(state, action: PayloadAction<boolean>) {
      state.IsTriggerIntersect = action.payload;
    },
    SetTriggerGetPropertiesByGeom(state, action: PayloadAction<boolean>) {
      state.IsTriggerGetPropertiesByGeom = action.payload;
    },

  },
});

export const {
  SetGeom,
  SetIsSummary,
  SetIsShowOverlay,
  SetIsLoadingOverlay,
  SetIdLayerService,
  SetIdLayerServices,
  SetIdWebServices,
  // 
  SetTriggerIntersect,
  SetTriggerGetPropertiesByGeom
} = layerServiceSlice.actions;

export default layerServiceSlice.reducer;
