// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { RoleTypeResponse } from "@/api/types";


export async function getAPIRoleGetById(
  id: string
): Promise<AxiosResponse<RoleTypeResponse>> {
  try {
    const res = await fetch.get(`Role/get/${id}`);
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