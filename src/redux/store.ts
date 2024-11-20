// lib
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
// local
import loadingReducer from './Loading/slice'
import layerReducer from './Map/LayerService/slice'
import mapInteraktifReducer from './Map/MapInteraktif/slice'


export const store = configureStore({
  reducer: {
    mapInteraktif: mapInteraktifReducer,
    loading: loadingReducer,
    layer: layerReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector