import { createSlice } from "@reduxjs/toolkit";

type UserState = {
    isUserDataLoading : boolean,
}

const initialState : UserState = {
    isUserDataLoading : true,
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {}
});

export default userSlice.reducer;