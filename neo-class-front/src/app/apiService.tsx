// src/app/service/apiService.ts

import axios, { AxiosResponse } from "axios";

export const httpClient = axios.create({
  baseURL: "http://localhost:8080", 
});

// INTERCEPTOR PARA ADICIONAR O TOKEN AUTOMATICAMENTE
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

class ApiService {
  apiurl: string;

  constructor(apiurl: string) {
    this.apiurl = apiurl;
  }

  get<T = any>(url: string): Promise<AxiosResponse<T>> {
    const requestUrl = this.apiurl + url;
    return httpClient.get<T>(requestUrl);
  }

  post<T = any>(url: string, objeto: any): Promise<AxiosResponse<T>> {
    const requestUrl = this.apiurl + url;
    return httpClient.post<T>(requestUrl, objeto);
  }

  put<T = any>(url: string, objeto: any): Promise<AxiosResponse<T>> {
    const requestUrl = this.apiurl + url;
    return httpClient.put<T>(requestUrl, objeto);
  }

  delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    const requestUrl = this.apiurl + url;
    return httpClient.delete<T>(requestUrl);
  }
}

export default ApiService;
