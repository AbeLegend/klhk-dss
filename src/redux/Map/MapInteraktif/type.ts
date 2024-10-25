// local
import { DynamicStringModel, WebServiceModel } from "@/api/types";

export interface ReduxLayerWebService extends WebServiceModel {
  isActive: boolean;
  isUsed: boolean;
}

export interface ReduxLayerItem {
  WebService: ReduxLayerWebService,
  Properties: DynamicStringModel[]
}

export interface ReduxLocation {
  latitude: number;
  longitude: number;
}

export interface ReduxMapInteraktifModel {
  layer: ReduxLayerItem[];
  location: ReduxLocation;
  isOpenModal: boolean;
  searchLocation: string;
}

