import axios from "axios";

// const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1`;
const BASE_URL = `http://${window.location.hostname}:4000/api/v1`;
// const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1`;




export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      config.headers["Authorization"] = `Bearer`;
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
    console.log(error.response.data.message);
    if (
      error.response &&
      error.response.status === 401 &&
      localStorage.getItem("accessToken")
    ) {
      if (
        error.response.data &&
        error.response.data.message === "Token expired"
      ) {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    }

    if (error.response.status === 403) {
      window.location.href = "/forbidden";
    }

    return Promise.reject(error);
  }
);

export const apiClientAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});
