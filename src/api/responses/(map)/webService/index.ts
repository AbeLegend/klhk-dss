// lib
import axios, { AxiosResponse, AxiosError } from "axios";
// local - api
import { fetch } from "@/api/services";
import { WebServiceAllByUriTitleResponse, WebServiceAllResponse, WebServiceAllUriTitleResponse, WebServiceGetPropertiesByGeomResponse, WebServiceGetPropertiesByGeomResponse2 } from "@/api/types";



export async function getAPIWebServiceAllUriTitle(): Promise<AxiosResponse<WebServiceAllUriTitleResponse>> {
  try {
    const res = await fetch.post(`/WebService/all_uri_title`, {

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

export async function getAPIWebServiceAllByUriTitle(UriTitle: string): Promise<AxiosResponse<WebServiceAllByUriTitleResponse>> {
  try {
    const res = await fetch.post(`/WebService/all_by_uri_title`, {
      UriTitle
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
export async function getAPIWebServiceGetPropertiesByGeom(params: {
  latitude: number,
  longitude: number,
  codeGroup: string,
  startYear?: number,
  endYear?: number,
  idGroupWebService?: number,
  idWebServiceReference?: number,

}): Promise<AxiosResponse<WebServiceGetPropertiesByGeomResponse>> {
  try {
    const res = await fetch.get(`/WebService/get_properties_by_geom`, {
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
export async function getAPIWebServiceByGeom(): Promise<AxiosResponse<WebServiceGetPropertiesByGeomResponse>> {
  try {
    const res = await axios.get("/json/sample-map.json")
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
export async function postAPIWebServiceIntersect(data: {
  IdLayerService?: string;
  IdWebService?: number[]
}): Promise<AxiosResponse<WebServiceGetPropertiesByGeomResponse2>> {
  try {
    const res = await fetch.post("/WebService/intersect", data)
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
