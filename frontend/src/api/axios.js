import axios from "axios";

// =====================================
// AXIOS INSTANCE
// =====================================

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================
// REQUEST INTERCEPTOR
// Attach Access Token
// =====================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// =====================================
// RESPONSE INTERCEPTOR
// Refresh Token System
// =====================================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // network/server down

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Refresh token missing");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,

          {
            refreshToken,
          },

          {
            withCredentials: true,
          },
        );

        const newAccessToken = response.data.accessToken;

        localStorage.setItem(
          "accessToken",

          newAccessToken,
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");

        localStorage.removeItem("refreshToken");

        localStorage.removeItem("user");

        window.location.replace("/login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
