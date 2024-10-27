// local
import { DynamicStringModel, WebServiceModel } from "@/api/types";


export interface DataWebserviceByGeom {
  WebService: WebServiceModel
  Properties: DynamicStringModel[]
}
export interface UriTitleMapType {
  isActive: boolean;
  isUsed: boolean;
  UriTitle: string;
  data?: DataWebserviceByGeom[]
}

export interface ReduxLocation {
  latitude: number | null;
  longitude: number | null;
}

export interface ReduxMapInteraktifModel {
  layer: UriTitleMapType[],
  location: ReduxLocation;
  isOpenModal: boolean;
  searchLocation: string;
}

