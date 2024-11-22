// local
import { WebServiceModel } from "@/api/types";

export interface PropertiesModel {
  Key: string,
  Value: string,
  Index: number
}

export interface DataWebserviceByGeom {
  WebService: WebServiceModel
  Properties: PropertiesModel[]
}
export interface DataWebserviceByGeom2 {
  WebService: WebServiceModel
  Properties: PropertiesModel[][]
}
export interface UriTitleMapType {
  isActive: boolean;
  isUsed: boolean;
  UriTitle: string;
  data?: DataWebserviceByGeom[]
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

