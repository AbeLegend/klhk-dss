/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse, RoleModel } from "@/api/types";


// BEGIN: LOGIN

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
// BEGIN: GET BY ID
export interface UserGetByIdType {
  Id: string,
  Username: string,
  FullName: string,
  Mail: string
  Token: string
  PhoneNumber: string
  Status: string
  AccessFailedCount: number
  Roles: RoleModel[],
  LastSynchronize: string,
  CreateBy: string,
  CreateDate: string,
  UpdateBy: string,
  UpdateDate: string
}

export interface UserGetByIdTypeResponse extends BaseResponse {
  Data: UserGetByIdType
}

// END: GET BY ID