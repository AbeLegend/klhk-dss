// lib
import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
// local
import { decryptText } from "@/lib";

// Konfigurasi base URL dan versi API
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

// Membuat instance Axios dengan base URL
const fetch = axios.create({
  baseURL: `${apiUrl}/${apiVersion}`,
});

// Menambahkan interceptor request untuk menyertakan Bearer token
fetch.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Mengambil token dari cookies
    const token = Cookies.get("token");

    // Jika token ada, dekripsi dan tambahkan ke header Authorization
    if (token) {
      try {
        const decryptToken = decryptText(token);
        config.headers.Authorization = `Bearer ${decryptToken}`;
      } catch (error) {
        console.error("Token decryption failed:", error);
      }
    }

    return config;
  },
  (error) => {
    // Menangani error request
    return Promise.reject(error);
  }
);

// Menambahkan interceptor response untuk menangani respons API
fetch.interceptors.response.use(
  (response) => {
    // Respons sukses
    return response;
  },
  (error) => {
    // Menangani error respons
    console.error("Axios response error:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default fetch;
