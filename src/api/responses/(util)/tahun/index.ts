// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { TahunResponse, TahunAllResponse } from "@/api/types";


export async function getAPITahunAll(params: {
  tahunType: string
}): Promise<AxiosResponse<TahunAllResponse>> {
  try {
    const res = await fetch.get("/Tahun/all", {
      params
    });
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
export async function getAPITahun(id: string): Promise<AxiosResponse<TahunResponse>> {
  try {
    const res = await fetch.get(`/Tahun/get/${id}`);
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
