// lib
import { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { LayerServiceByIdResponse, PostLayerServiceResponse } from "@/api/types";

export async function postAPILayerServiceUploadSHP(data: {
  File: {
    Filename: string;
    Extension: string;
    Base64: string;
  },
  FileType: number
}): Promise<AxiosResponse<PostLayerServiceResponse>> {
  try {
    const res = await fetch.post(`/LayerService/upload-shp`, data);
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

export async function getAPILayerServiceById(id: string): Promise<AxiosResponse<LayerServiceByIdResponse>> {
  try {
    const res = await fetch.get(`/LayerService/get/${id}`);
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
