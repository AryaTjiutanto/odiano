import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../libs/api";
import type { CurrentUserDTO, SignInResponse, SuccessResponseData } from "@connect/shared";

export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async (_, thunkApi) => {
    try {
        const response = await api.post<SuccessResponseData<SignInResponse>>("/auth/refresh");
        const newAccessToken = response.data.data?.access_token || null;

        if(!newAccessToken) {
            return thunkApi.rejectWithValue("No access token returned")
        }

        return newAccessToken;
    } catch {
        return thunkApi.rejectWithValue("Failed to get access token");
    }
});

export const logout = createAsyncThunk("auth/logout", async() => {
    await api.post("/auth/logout");
    return true;
})

export const intitializeAuth = createAsyncThunk("auth/initializeAuth", async (_, thunkAPi) => {
    try {
        const response = await api.get<SuccessResponseData<CurrentUserDTO>>("/auth/me");
        
        const user = response.data.data;

        if(!user) {
            return thunkAPi.rejectWithValue("No user data");
        }
        
        return response.data.data;
    } catch {
        return thunkAPi.rejectWithValue("Failed to get user data");
    }
})