/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";

// BEGIN: WebServiceReference
export interface WebServiceReferenceType {
  Id: number,
  Category: string,
  CreateBy: string,
  CreateDate: string,
  IdGroupWebService: number,
  Title: string,
  UpdateBy: null | string,
  UpdateDate: null | string
}

export interface WebServiceReferenceAllResponse extends BaseResponse {
  Data: WebServiceReferenceType[]
}
export interface WebServiceReferenceByIdResponse extends BaseResponse {
  Data: WebServiceReferenceType
}
// END: WebServiceReference
