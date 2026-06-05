// ============================================================
// FILE: src/lib/axios.ts
// ============================================================

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import API_CONFIG from "@/config/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Tambahkan token: config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API] ${config.method?.toUpperCase()} → ${config.url}`);
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message: string }>) => {
    const message =
      error.response?.data?.message || error.message || "Jaringan bermasalah";
    console.error("[API Error]", message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;