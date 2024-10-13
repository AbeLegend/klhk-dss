/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";

// BEGIN: Province
export interface ProvinceModel {
  Id: number,
  Code: string,
  IdReferenceSimontana: string,
  Lat: string,
  Lng: string,
  Name: string
}
export interface ProvinceType extends ProvinceModel { }

export interface ProvinceAllResponse extends BaseResponse {
  Data: ProvinceModel[]
}

export interface ProvinceResponse extends BaseResponse {
  Data: ProvinceModel
}
// END: Province