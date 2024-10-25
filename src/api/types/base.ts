/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

export interface BaseResponse {
  Code: number,
  Succeeded: boolean,
  Message: string,
  Description: string
}

export interface DynamicStringModel {
  [key: string]: string;
}
