import {combineReducers} from "@reduxjs/toolkit";
import {authApi} from "./slices/auth/authApi.js";
import storage from "redux-persist/lib/storage"
import {persistReducer} from "redux-persist";
import authSlice from "./slices/auth/authSlice.js";
import {managementApi} from "./slices/management/managementApi.jsx";
import {onboardApi} from "./slices/onboard/onboardApi.js";
import {customerApi} from "./slices/customer/customerApi.js";
import {allocationApi} from "./slices/management/allocationApi.js";
import {workflowApi} from "./slices/workflow/workflowApi.js";
import {invoiceApi} from "./slices/invoice/invoiceApi.js";

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["user", "token", "role", "mgmt_id", "branch_id"]
}

export const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authSlice),
    [authApi.reducerPath]: authApi.reducer,
    [managementApi.reducerPath]: managementApi.reducer,
    [onboardApi.reducerPath]: onboardApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [allocationApi.reducerPath]: allocationApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
})
