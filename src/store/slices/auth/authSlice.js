import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null,
    role: null,
    token: null,
    loading: false,
    error: null,
    title: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginCredentials: (state, action) => {
            const {user, role, token} = action.payload;
            state.user = user;
            state.role = role;
            state.token = token;
        },
        setUserType: (state, action) => {
            state.userType = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.token = null;
        },
        handleTitleChange: (state, action) => {
            console.log(action.payload)
            state.title = action.payload;
        },
    },
    extraReducers: (builder) => {
    }
})

export const { setLoginCredentials, setUserType, logout, handleTitleChange } = authSlice.actions;
export default authSlice.reducer;