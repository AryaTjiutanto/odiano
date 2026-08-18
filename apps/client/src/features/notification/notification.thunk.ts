import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../libs/api";
import type { SuccessResponseData } from "@odiano/shared";

export const getUnreadNotificationCount = createAsyncThunk<number, void, {rejectValue : string}>("notification/getUnreadNotificationCount", async (_, thunkApi)=> {
    try {
        const response = await api.get<SuccessResponseData<number>>("/notification/unread-count");

        return response.data.data || 0;
    } catch {
        return thunkApi.rejectWithValue("Failed to get unread notification count");
    }
});