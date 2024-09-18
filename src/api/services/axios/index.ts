import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION
const fetch = axios.create({
  baseURL: `${apiUrl}/${apiVersion}`,
});

interface InterceptorConfig extends InternalAxiosRequestConfig<any> {
  withAuthToken?: boolean;
}

// Add a request interceptor
fetch.interceptors.request.use(
  function ({ withAuthToken = true, ...config }: InterceptorConfig) {
    // Get the token from cookies
    const token = Cookies.get("token");

    // If token exists, add it to the headers
    if (token && withAuthToken) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
fetch.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default fetch;
