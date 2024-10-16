/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";

// BEGIN: WebService
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
  Group: {
    Id: number,
    CreateBy: string,
    CreateDate: string,
    Title: string,
    UpdateBy: string | null,
    UpdateDate: string | null
  }
}

export interface WebServiceAllResponse extends BaseResponse {
  Data: WebServiceModel[]
}

// export interface WebServiceResponse extends BaseResponse {
//   Data: WebServiceModel
// }
// END: WebService