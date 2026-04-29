import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../libs/api";
import type { SignInResponse, SuccessResponseData } from "@connect/shared";

export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async (_, thunkApi) => {
    try {
        const response = await api.post<SuccessResponseData<SignInResponse>>("/auth/refresh");
        const newAccessToken = response.data.data?.access_token || null;

        if(!newAccessToken) {
            return thunkApi.rejectWithValue("No access token returned")
        }

        return newAccessToken;
    } catch (err) {
        return thunkApi.rejectWithValue("Failed to refresh token");
    }
});

export const logout = createAsyncThunk("auth/logout", async(_, thunkApi) => {
    await api.post("/auth/logout");
    return true;
})