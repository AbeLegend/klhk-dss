/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse, DynamicStringModel } from "@/api/types";

// BEGIN: WebService

export interface WebServiceGroupModel {
  Id: number,
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
    Properties: DynamicStringModel[]
  }[]
}
// END: WebServiceWithProperties
export interface WebServiceAllUriTitle extends BaseResponse {
  Data: {
    UriTitle: string
  }[]
}