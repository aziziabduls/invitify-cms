import axios from "axios";
import { toast } from "sonner";
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
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        toast.error("Unauthorized. Please login again.");

        // Use window.location to ensure a full refresh and redirect
        // to the login page
        window.location.href = "/auth/v2/login";
      }
    }
    return Promise.reject(error);
  }
);
