// local
import { WebServiceModel } from "@/api/types";

export interface UriTitleMapType {
  isActive: boolean;
  isUsed: boolean;
  UriTitle: string;
  data?: WebServiceModel[]
}

export interface ReduxLocation {
  latitude: number;
  longitude: number;
}

export interface ReduxMapInteraktifModel {
  layer: UriTitleMapType[],
  location: ReduxLocation;
  isOpenModal: boolean;
  searchLocation: string;
}

