/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";

// BEGIN: Tahun
export interface TahunModel {
  Id: number,
  CreateBy: string,
  CreateDate: string,
  Revision: number,
  UpdateBy: string | null,
  UpdateDate: string | null,
  Year: number,
  YearType: string
}

export interface TahunAllResponse extends BaseResponse {
  Data: TahunModel[]
}

export interface TahunResponse extends BaseResponse {
  Data: TahunModel
}
// END: Tahun