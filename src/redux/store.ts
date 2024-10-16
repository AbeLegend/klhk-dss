// lib
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
// local
import mapInteraktifReducer from './Map/MapInteraktif/slice'


export const store = configureStore({
  reducer: {
    mapInteraktif: mapInteraktifReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector