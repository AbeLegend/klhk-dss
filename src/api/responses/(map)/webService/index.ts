// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { WebServiceAllResponse } from "@/api/types";


export async function getAPIWebServiceAll(): Promise<AxiosResponse<WebServiceAllResponse>> {
  try {
    const res = await fetch.get(`/WebService/all`);
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
