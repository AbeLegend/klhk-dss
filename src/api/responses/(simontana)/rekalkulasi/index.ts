// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { RekalkulasiStatisticResponse } from "@/api/types";


export async function postAPIRekalkulasiStatistic(formData: {
  Tahun: string | null,
  IdProvince: string | null,
  IdCity: string | null,
  IdTutupanLahan: string | null,
}): Promise<AxiosResponse<RekalkulasiStatisticResponse>> {
  try {
    const res = await fetch.post(`/Simontana/get_rekalkulasi_statistic`, formData);
    return res;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const errorMessage = error.response.data.message || "An error occurred";
      throw new Error(errorMessage);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}