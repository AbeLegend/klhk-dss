// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { WebServiceReferenceAllResponse, WebServiceReferenceByIdResponse } from "@/api/types";

export async function getAPIWebServiceReferenceAll(): Promise<AxiosResponse<WebServiceReferenceAllResponse>> {
  try {
    const res = await fetch.get(`/WebServiceReference/all`);
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

export async function getAPIWebServiceReferenceById(id: string): Promise<AxiosResponse<WebServiceReferenceByIdResponse>> {
  try {
    const res = await fetch.get(`/WebServiceReference/get/${id}`);
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