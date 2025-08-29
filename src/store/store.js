import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./rootReducer.js";
import {authApi} from "./slices/auth/authApi.js";
import {persistStore} from "redux-persist";
import {managementApi} from "./slices/management/managementApi.jsx";
import {onboardApi} from "./slices/onboard/onboardApi.js";
import {customerApi} from "./slices/customer/customerApi.js";
import {allocationApi} from "./slices/management/allocationApi.js";
import {workflowApi} from "./slices/workflow/workflowApi.js";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(
            authApi.middleware,
            managementApi.middleware,
            onboardApi.middleware,
            customerApi.middleware,
            allocationApi.middleware,
            workflowApi.middleware,
        ),
})

export const persistor = persistStore(store)
export default store