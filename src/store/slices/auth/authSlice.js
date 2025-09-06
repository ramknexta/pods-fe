import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null,
    role: null,
    token: null,
    mgmt_id: null,
    branch_id: null,
    loading: false,
    error: null,
    title: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginCredentials: (state, action) => {
            const {user, role, token, mgmt_id, branch_id} = action.payload;
            state.user = user;
            state.role = role;
            state.token = token;
            state.mgmt_id = mgmt_id;
            state.branch_id = branch_id;
        },
        setUserType: (state, action) => {
            state.userType = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.token = null;
            state.mgmt_id = null;
        },
        handleTitleChange: (state, action) => {
            state.title = action.payload;
        },
    },
    extraReducers: (builder) => {
    }
})

export const { setLoginCredentials, setUserType, logout, handleTitleChange } = authSlice.actions;
export default authSlice.reducer;