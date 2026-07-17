import axios from "axios";

// =====================================
// AXIOS INSTANCE
// =====================================

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,
});

// =====================================
// REQUEST INTERCEPTOR
// ATTACH JWT TOKEN
// =====================================

API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// =====================================
// RESPONSE INTERCEPTOR
// REFRESH TOKEN
// =====================================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const refreshToken = user?.refreshToken;

        if (!refreshToken) {
          throw new Error("Refresh token missing");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,

          {
            refreshToken,
          },
        );

        const newToken = response.data.accessToken;

        user.accessToken = newToken;

        localStorage.setItem(
          "user",

          JSON.stringify(user),
        );

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");

        window.location.replace("/login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
