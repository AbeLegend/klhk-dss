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
    updateLayer(
      state,
      action: PayloadAction<{ title: string; updatedData: Partial<UriTitleMapType> }>
    ) {
      const { title, updatedData } = action.payload;
      const existingLayerIndex = state.layer.findIndex((item) => item.UriTitle === title);

      if (existingLayerIndex !== -1) {
        const existingLayer = state.layer[existingLayerIndex];

        if (updatedData.data && updatedData.data.length > 0) {
          const updatedDataItems = updatedData.data.map((newItem) => {
            // Temukan item data yang ada berdasarkan WebService.Id
            const existingDataItem = existingLayer.data?.find(
              (item) => item.WebService.Id === newItem.WebService.Id
            );

            // Jika item data sudah ada, perbarui hanya Properties-nya
            if (existingDataItem) {
              return {
                ...existingDataItem,
                Properties: newItem.Properties || existingDataItem.Properties,
              };
            }

            // Jika tidak ada item data yang cocok, tambahkan item baru
            return newItem;
          });

          // Perbarui data yang ada dengan item yang diperbarui
          state.layer[existingLayerIndex].data = updatedDataItems;
        } else {
          // Jika tidak ada data khusus yang dikirim, perbarui seluruh layer
          state.layer[existingLayerIndex] = {
            ...existingLayer,
            ...updatedData,
          };
        }
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
  setSearchLocation,
} = mapInteraktif.actions;
export default mapInteraktif.reducer;
