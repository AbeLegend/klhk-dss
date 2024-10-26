// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { TutupanLahanResponse, TutupanLahanAllResponse } from "@/api/types";


export async function getAPITutupanLahanAll(
): Promise<AxiosResponse<TutupanLahanAllResponse>> {
  try {
    const res = await fetch.get("/TutupanLahan/all");
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
export async function getAPITutupanLahan(id: string): Promise<AxiosResponse<TutupanLahanResponse>> {
  try {
    const res = await fetch.get(`/TutupanLahan/get/${id}`);
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
