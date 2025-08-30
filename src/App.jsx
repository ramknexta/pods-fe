import './App.css'
import {AppRoutes} from "./routes/index.jsx";
import {Provider} from "react-redux";
import store, {persistor} from "./store/store.js";
import {PersistGate} from "redux-persist/integration/react";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <>
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <AppRoutes />
                <Toaster position="top-right" reverseOrder={false} gutter={8} toastOptions={{duration: 2000}} />
            </PersistGate>
        </Provider>
    </>
  )
}

export default App
