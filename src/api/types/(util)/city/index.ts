/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";

// BEGIN: City
export interface CityModel {
  Id: number,
  Code: string,
  IdProvince: number,
  IdProvinceReferenceSimontana: string,
  IdReferenceSimontana: string,
  Lat: string,
  Lng: string,
  Name: string
}

export interface CityAllResponse extends BaseResponse {
  Data: CityModel[]
}

export interface CityResponse extends BaseResponse {
  Data: CityModel
}
// END: City