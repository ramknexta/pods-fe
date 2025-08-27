import {combineReducers} from "@reduxjs/toolkit";
import {authApi} from "./slices/auth/authApi.js";
import storage from "redux-persist/lib/storage"
import {persistReducer} from "redux-persist";
import authSlice from "./slices/auth/authSlice.js";
import {managementApi} from "./slices/management/managementApi.jsx";

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["user", "token", "role"]
}

export const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authSlice),
    [authApi.reducerPath]: authApi.reducer,
    [managementApi.reducerPath]: managementApi.reducer,
})
