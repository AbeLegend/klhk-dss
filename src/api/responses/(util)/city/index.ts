// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { CityResponse, CityAllResponse } from "@/api/types";


export async function getAPICityAll(idProvince: string): Promise<AxiosResponse<CityAllResponse>> {
  try {
    const res = await fetch.get(`/City/all/${idProvince}`);
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
export async function getAPICity(id: string): Promise<AxiosResponse<CityResponse>> {
  try {
    const res = await fetch.get(`/City/get/${id}`);
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
