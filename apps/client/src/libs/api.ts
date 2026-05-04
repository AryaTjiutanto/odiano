import axios, { AxiosError, AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { store } from "../app/store";
import { refreshAccessToken } from "../features/auth/auth.thunk";

let refreshPromise : Promise<string> | null = null;

export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = store.getState().auth.accessToken;

        if (token) {
            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }

            config.headers.set("Authorization", `Bearer ${token}`);
        }

        return config;
    },
    (err: AxiosError) => {
        return Promise.reject(err);
    }
);

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalConfig = error.config;

        if (!originalConfig) {
            return Promise.reject(error);
        }

        if (error.response?.status == 401 && !originalConfig?._retry && !originalConfig?.url?.includes("/auth/refresh")) {
            try {
                originalConfig._retry = true;

                if(!refreshPromise) {
                    refreshPromise = store.dispatch(refreshAccessToken()).unwrap()
                        .finally(() => {
                            refreshPromise = null;
                        })
                }

                const newAccessToken = await refreshPromise;

                if (newAccessToken) {
                    if (!originalConfig.headers) {
                        originalConfig.headers = new AxiosHeaders();
                    }

                    originalConfig.headers.set("Authorization", `Bearer ${newAccessToken}`);
                }

                return api(originalConfig);
            } catch {
                store.dispatch({ type: "auth/logout/fulfilled" });
            }
        }

        return Promise.reject(error);
    }
)