/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";

// BEGIN: TutupanLahan
export interface TutupanLahanModel {
  Id: number,
  Base64: string | null,
  Catatan: string | null,
  Code: string,
  Description: string | null,
  IdReferenceSimontana: string,
  IsDefault: boolean,
  Name: string,
  Pattern: string | null,
  Toponimi: string,
  Url: string,
  Warna: string
}

export interface TutupanLahanAllResponse extends BaseResponse {
  Data: TutupanLahanModel[]
}

export interface TutupanLahanResponse extends BaseResponse {
  Data: TutupanLahanModel
}
// END: TutupanLahan