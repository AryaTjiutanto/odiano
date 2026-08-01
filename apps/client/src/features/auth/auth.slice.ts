import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { intitializeAuth, logout, refreshAccessToken } from "./auth.thunk";
import type { CurrentUserDTO } from "@odiano/shared";
import type { UploadedImageData } from "../../types/file.type";

type AuthState = {
    isAuthLoading: boolean,
    isAuthenticated: boolean,
    isInitialized : boolean,
    accessToken: string | null,
    user : CurrentUserDTO | null,
}

const initialState: AuthState = {
    isAuthLoading: true,
    accessToken: null,
    isAuthenticated: false,
    isInitialized : false,
    user : null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
            state.isAuthLoading = false;
        },
        setCurrentUserProfile(state, action : PayloadAction<UploadedImageData>) {
            if(!state.user) return;

            state.user.profileImage = {
                publicId : action.payload.publicId,
                url : action.payload.url,
            };
        },
        setEmailVerified(state, action : PayloadAction<boolean>) {
            if(!state.user) return;

            state.user.isEmailVerified = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Refresh access token
            .addCase(refreshAccessToken.pending, (state) => {
                state.isAuthLoading = true;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<string>) => {
                state.accessToken = action.payload;
                state.isAuthLoading = false;
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.accessToken = null;
                state.isAuthenticated = false;
                state.isAuthLoading = false;
            })

            // initialize auth
            .addCase(intitializeAuth.pending, (state) => {
                state.isAuthLoading = true;
            })
            .addCase(intitializeAuth.fulfilled, (state, action : PayloadAction<CurrentUserDTO | null>) => {
                state.user = action.payload;
                state.isAuthLoading = false;
                state.isAuthenticated = !!action.payload;
                state.isInitialized = true;
            })
            .addCase(intitializeAuth.rejected, (state) => {
                state.isAuthLoading = false;
                state.isInitialized = true;
                state.isAuthenticated = false;
            })

            // logout
            .addCase(logout.pending, (state) => {
                state.isAuthLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthLoading = false;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.user = null;
            })
    }
})

export const { setAccessToken, setCurrentUserProfile, setEmailVerified } = authSlice.actions;
export default authSlice.reducer; 