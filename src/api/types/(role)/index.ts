/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";


// BEGIN: LOGIN
export interface RoleModel {
  Id: string,
  Nama: string
}

export interface RoleType {
  Name: string,
  Permissions: string[],
  Id: string,
  CreateDate: string,
  UpdateDate: string,
  CreateBy: string,
  UpdateBy: string,
  CreateByWithUserNameOnly: string,
  UpdateByWithUserNameOnly: string
}

export interface RoleTypeResponse extends BaseResponse {
  Data: RoleType
}