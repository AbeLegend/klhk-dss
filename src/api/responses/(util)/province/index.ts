// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { ProvinceResponse, ProvinceAllResponse } from "@/api/types";


export async function getAPIProvinceAll(
): Promise<AxiosResponse<ProvinceAllResponse>> {
  try {
    const res = await fetch.get("/Province/all");
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
export async function getAPIProvince(id: string): Promise<AxiosResponse<ProvinceResponse>> {
  try {
    const res = await fetch.get(`/Province/get/${id}`);
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
