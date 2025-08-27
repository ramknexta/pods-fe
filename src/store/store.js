import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./rootReducer.js";
import {authApi} from "./slices/auth/authApi.js";
import {persistStore} from "redux-persist";
import {managementApi} from "./slices/management/managementApi.jsx";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(
            authApi.middleware,
            managementApi.middleware,
        ),
})

export const persistor = persistStore(store)
export default store