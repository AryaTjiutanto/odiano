import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    routeHistory : string[],
}

const initialState : InitialState = {
    routeHistory : [],
}

const navigationHistorySlice = createSlice({
    name : "navigationHistory",
    initialState,
    reducers : {
        addRoute(state, action : PayloadAction<string>) {
            state.routeHistory.push(action.payload);
        },
        removeLatestRoute(state) {
            state.routeHistory.pop();
        },
        removeRouteFromBack(state, action : PayloadAction<number>) {
            const n = Math.min(action.payload, state.routeHistory.length);

            state.routeHistory.splice(-n, n);
        }
    }
});

export default navigationHistorySlice.reducer;
export const {addRoute, removeLatestRoute, removeRouteFromBack} = navigationHistorySlice.actions;