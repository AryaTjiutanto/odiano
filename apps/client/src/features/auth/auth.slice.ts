import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { logout, refreshAccessToken } from "./auth.thunk";

type AuthState = {
    isAuthLoading: boolean,
    accessToken: string | null,
    isAuthenticated: boolean,
}

const initialState: AuthState = {
    isAuthLoading: true,
    accessToken: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
            state.isAuthLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshAccessToken.pending, (state) => {
                state.isAuthLoading = true;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<string>) => {
                state.accessToken = action.payload;
                state.isAuthenticated = true;
                state.isAuthLoading = false;
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.accessToken = null;
                state.isAuthenticated = false;
                state.isAuthLoading = false;
            })
            .addCase(logout.pending, (state) => {
                state.isAuthLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthLoading = false;
                state.accessToken = null;
                state.isAuthenticated = false;
            })
    }
})

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer; 