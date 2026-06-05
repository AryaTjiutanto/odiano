import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import userReducer from "../features/user/user.slice";
import navigationHistoryReducer from "../features/navigationHistory/navigationHistory.slice";

export const store = configureStore({
    reducer : {
        auth : authReducer,
        user : userReducer,
        navigationHistory: navigationHistoryReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;