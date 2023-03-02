import React from 'react';
import { Provider } from 'react-redux';
import RouteProvider from './Routes/RouteProvider';
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./Services/store";

function App() {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouteProvider />
      </PersistGate>
      </Provider>
  );
}

export default App;
