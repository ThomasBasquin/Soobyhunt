import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import RouteProvider from './Routes/RouteProvider';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './Services/store';
import UrlProvider from './Services/UrlProvider';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UrlProvider>
          <RouteProvider />
        </UrlProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
