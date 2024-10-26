/*
Rules Create Type
[ ] For Response = Response
[ ] For Use In Response = Type
[ ] For Input Form Use = Form
[ ] For Object = Model
*/

import { BaseResponse } from "@/api/types";

// BEGIN: Rekalkulasi
export interface RekalkulasiStatisticType {
  Info: {
    TipeGrafik: {
      Id: number,
      Type: string
    },
    Legend: {
      Tutupan: string,
      Value: string
    }[]
  }
}

export interface RekalkulasiStatisticResponse extends BaseResponse {
  Data: RekalkulasiStatisticType
}
// END: Rekalkulasi