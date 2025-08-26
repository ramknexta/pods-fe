import './App.css'
import {AppRoutes} from "./routes/index.jsx";
import {Provider} from "react-redux";
import store, {persistor} from "./store/store.js";
import {PersistGate} from "redux-persist/integration/react";

function App() {
  return (
    <>
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <AppRoutes />
            </PersistGate>
        </Provider>
    </>
  )
}

export default App
