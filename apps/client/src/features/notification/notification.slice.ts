import type { NotificationDTO } from "@connect/shared"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
    notifications : NotificationDTO[] | null,
    unreadCount : number,
}

const initialState : InitialState = {
    notifications : null,
    unreadCount : 0,
}

const notificationSlice = createSlice({
    name : "notification",
    initialState,
    reducers : {
        addNotification(state, action : PayloadAction<NotificationDTO>) {
            state.notifications?.push(action.payload);
            state.unreadCount++;
        },
        decreseUnreadCount (state, action : PayloadAction<number | null>) {
            state.unreadCount -= action.payload || 0;
        }
    }
})

export const {addNotification, decreseUnreadCount} = notificationSlice.actions;
export default notificationSlice.reducer;