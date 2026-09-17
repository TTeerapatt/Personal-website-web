import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { resolveBackendBaseUrl } from "@/app/lib/apiConfig";

const axiosConfig: AxiosRequestConfig = {
  baseURL: resolveBackendBaseUrl(),
  timeout: 20000,
};

const apiServices = axios.create(axiosConfig);

apiServices.interceptors.request.use(
  (config) => {
    config.headers = Object.assign({}, config.headers, {
      "Content-Type": "application/json",
      Accept: "application/json",
    });
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
    // Log a one-line summary. Printing the Axios error itself dumps the whole
    // request object, which floods the server log on every failed render.
    const { method, baseURL, url } = error?.config ?? {};
    const target = `${(method ?? "get").toUpperCase()} ${baseURL ?? ""}${url ?? ""}`;
    const status = error?.response?.status ?? error?.code ?? "no response";
    const reason = error?.response?.data?.message ?? error?.message;

    console.error(`API Error: ${target} -> ${status}${reason ? ` (${reason})` : ""}`);
    return Promise.reject(error?.response?.data || error);
  }
);

export default apiServices;
