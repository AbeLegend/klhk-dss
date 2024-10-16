"use client";
// lib
import { ReactNode } from "react";
// local
import { store } from "./store";
import { Provider } from "react-redux";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
