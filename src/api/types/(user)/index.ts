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

export interface UserModel {
  Id: string,
  Role: RoleModel[],
  Permissions: string[],
  Username: string,
  FullName: string,
  Mail: string
}

export interface UserLoginType {
  User: UserModel,
  ExpiredAt: string,
  RawToken: string,
  RefreshToken: string
}

export interface UserLoginResponse extends BaseResponse {
  Data: UserLoginType
}
// END: LOGIN