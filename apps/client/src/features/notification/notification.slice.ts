import type { NotificationDTO } from "@connect/shared"
import { createSlice } from "@reduxjs/toolkit"

type InitialState = {
    notifications : NotificationDTO[] | null,
    unreadCount : number,
}

const initialState : InitialState = {
    notifications : null,
    unreadCount : 0
}

const notificationSlice = createSlice({
    name : "notification",
    initialState,
    reducers : {
        
    }
})

export default notificationSlice.reducer;