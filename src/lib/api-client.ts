import axios from "axios";
import { APP_CONFIG } from "@/config/app-config";

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors for request/response handling
apiClient.interceptors.request.use(
  (config) => {
    // You can add logic here to retrieve token from cookies or localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // const token = ...
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token logic
    }
    return Promise.reject(error);
  }
);
