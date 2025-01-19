import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useTokenStore } from "@/store/tokenStore";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axios = Axios.create({
  baseURL: "http://192.168.1.27:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

const axiosRefresh = Axios.create({
  baseURL: "http://192.168.1.27:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const notifySubscribers = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

axios.interceptors.request.use(
  async function (config) {
    const access = useTokenStore.getState().access;

    if (access) {
      config.headers["Authorization"] = `Bearer ${access}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest: CustomAxiosRequestConfig | undefined = error.config;
    const { refresh, setAllTokens, clearTokens } = useTokenStore.getState();

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refresh) {
        clearTokens();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axiosRefresh.post("v1/token/refresh/", { refresh });

          if (response.status === 200) {
            setAllTokens(response.data);
            notifySubscribers(response.data.access);
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            originalRequest._retry = false;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          if (
            refreshError instanceof AxiosError &&
            (refreshError.response?.status === 403 || refreshError.response?.status === 401)
          ) {
            clearTokens();
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          refreshSubscribers = [];
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axios(originalRequest));
        });
      });
    }

    if (originalRequest && originalRequest._retry) {
      clearTokens();
    }

    return Promise.reject(error);
  }
);

export default axios;
