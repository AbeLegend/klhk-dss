// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { UserLoginResponse } from "@/api/types";


export async function postAPIUserLogin(
  data: { Username: string, Password: string, CaptchaToken: string }
): Promise<AxiosResponse<UserLoginResponse>> {
  try {
    const res = await fetch.post("/User/login", data);
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
