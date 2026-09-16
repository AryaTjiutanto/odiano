import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../libs/api";
import type { SuccessResponseData } from "@odiano/shared";
import { store } from "../../app/store";

export const getUnreadNotificationCount = createAsyncThunk<number, void, {rejectValue : string}>("notification/getUnreadNotificationCount", async (_, thunkApi)=> {
    try {
        if(!store.getState().auth.isAuthenticated) {
            return thunkApi.rejectWithValue("You are not authenticated");
        };

        const response = await api.get<SuccessResponseData<number>>("/notification/unread-count");

        return response.data.data || 0;
    } catch {
        return thunkApi.rejectWithValue("Failed tos get unread notification count");
    }
});