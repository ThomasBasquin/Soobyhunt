import React from 'react';
import { Provider } from 'react-redux';
import RouteProvider from './Routes/RouteProvider';
import { store } from './Services/store';

function App() {
  return (
    <Provider store={store}>
      <RouteProvider />
    </Provider>
  );
}

export default App;
