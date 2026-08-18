import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { getUnreadNotificationCount } from "./notification.thunk";

type NotificationState = {
    unreadCount: number,
}

const initialState : NotificationState = {
    unreadCount: 0,
}

const notificationSlice = createSlice({
    name : "notification",
    initialState,
    reducers: {
        setUnreadCount(state, action : PayloadAction<number>) {
            state.unreadCount = action.payload;
        },
        incrementUnreadCount(state) {
            state.unreadCount++;
        },
        decrementUnreadCount(state) {
            state.unreadCount--;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUnreadNotificationCount.fulfilled, (state, action : PayloadAction<number>) => {
            state.unreadCount = action.payload;
        })
    }
})

export const { incrementUnreadCount, decrementUnreadCount } = notificationSlice.actions;    
export default notificationSlice.reducer;