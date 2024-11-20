/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";

// BEGIN: LayerService
export interface Layers {
  Id: string,
  CreateBy: string,
  CreateDate: string,
  UpdateBy: null | string,
  UpdateDate: null | string,
  Attributes: {
    Key: string,
    Value: string,
    Index: number
  }[],
  Geom: string,
}
export interface Repository {
  Id: string,
  Code: string,
  CreateBy: string,
  CreateDate: string,
  Description: string,
  Extension: string,
  FileName: string,
  IsPublic: true,
  MimeType: string,
  Module: string
}
export interface LayerServiceModel {
  Id: string,
  Name: string,
  CreateBy: string,
  CreateDate: string,
  UpdateBy: null | string,
  UpdateDate: null | string,
  Repository: Repository,
  Layers: Layers[],
  CreateByWithUserNameOnly: null,
  UpdateByWithUserNameOnly: null
}

// END: LayerService

export interface LayerServiceByIdResponse extends BaseResponse {
  Data: LayerServiceModel
}
export interface PostLayerServiceResponse extends BaseResponse {
  Data: string
}