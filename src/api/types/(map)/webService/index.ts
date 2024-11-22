/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";
import { PropertiesModel } from "@/redux/Map/MapInteraktif";

// BEGIN: WebService

export interface WebServiceGroupModel {
  Id: number,
  Code: string,
  CreateBy: string,
  CreateDate: string,
  Title: string,
  UpdateBy: string | null,
  UpdateDate: string | null
}

export interface WebServiceModel {
  Id: number,
  CoverImage: string | null,
  CreateBy: string,
  CreateDate: string,
  IdReferenceSimontana: string,
  Title: string,
  UpdateBy: string | null,
  UpdateDate: string | null,
  UriTitle: string,
  Url: string,
  Category: string,
  GroupCategory: string,
  TimeSeries: number,
  Group: WebServiceGroupModel
}

export interface WebServiceAllResponse extends BaseResponse {
  Data: WebServiceModel[]
}
// END: WebService

// BEGIN: WebServiceWithProperties

export interface WebServiceGetPropertiesByGeomResponse extends BaseResponse {
  Data: {
    WebService: WebServiceModel
    Properties: PropertiesModel[]
  }[]
}
export interface WebServiceGetPropertiesByGeomResponse2 extends BaseResponse {
  Data: {
    WebService: WebServiceModel
    Properties: PropertiesModel[][]
  }[]
}
// END: WebServiceWithProperties
export interface WebServiceAllUriTitleResponse extends BaseResponse {
  Data: {
    UriTitle: string
  }[]
}
export interface WebServiceAllByUriTitleResponse extends BaseResponse {
  Data: WebServiceModel[]
}