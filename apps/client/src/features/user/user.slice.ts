import { createSlice } from "@reduxjs/toolkit";

type UserState = {

}

const initialState : UserState = {

}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {}
});

export default userSlice.reducer;