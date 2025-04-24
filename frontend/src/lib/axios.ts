import axios, { AxiosError } from "axios";
import { getToken, setToken, removeTokens } from "./storage";
import { useAuthStore } from "../store/authStore";
import { Platform } from "react-native";

const BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:3000/api" : "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?.url?.includes("auth/refresh-token")) {
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const refreshToken = await getToken("refreshToken");
          const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken, user } = data;
          await setToken(accessToken);
          await setToken(newRefreshToken, "refreshToken");
        
          useAuthStore.getState().setTokens({ 
            accessToken, 
            refreshToken: newRefreshToken 
          });

          useAuthStore.getState().setUser(user);

          if (originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (error) {
        await removeTokens();
        useAuthStore.getState().logout();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
); 