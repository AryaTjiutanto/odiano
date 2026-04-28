import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import {store} from "../app/store";
import { type SignInResponse, type SuccessResponseData } from "@connect/shared";
import { logout, setAccessToken } from "../features/auth/auth.slice";

export const api : AxiosInstance = axios.create({
    url: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

api.interceptors.request.use(
    (config : InternalAxiosRequestConfig) => {
        const token = store.getState().auth.accessToken;

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (err : AxiosError) => {
        return Promise.reject(err);
    }
);

api.interceptors.response.use(
    (res) => res,
    async (error : AxiosError) => {
        const originalConfig = error.config;

        if(error.response?.status == 401 && !originalConfig?._retry && originalConfig?.url == "/auth/refresh") {
            try {
                originalConfig._retry = true;
                
                const response = await api.post<SuccessResponseData<SignInResponse>>("/auth/refresh");

                const newAccessToken = response.data.data?.access_token || null;

                if(newAccessToken) {
                    originalConfig.headers.Authorization = `Bearer ${newAccessToken}`
                    store.dispatch(setAccessToken(newAccessToken));
                }
            } catch {
                store.dispatch(logout());
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)