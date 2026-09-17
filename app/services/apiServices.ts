import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const base_url =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3006/personal-website/api/";

const axiosConfig: AxiosRequestConfig = {
  baseURL: base_url,
  timeout: 40000,
};

const apiServices = axios.create(axiosConfig);

apiServices.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiServices.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error?.response?.data || error);
  }
);

export default apiServices;
