import React from 'react';
import {Provider} from 'react-redux';
import RouteProvider from './Routes/RouteProvider';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './Services/store';
import RNEventSource from 'react-native-event-source';

function App() {
  const uri = encodeURIComponent('https://example.com/users/dunglas');
  try {
    const eventSource = new RNEventSource(
      'http://82.165.109.36/.well-known/mercure?topic=' + uri,
    );
    eventSource.addEventListener('message', (event: any) => {
      console.log(event.type);
      console.log(event.data);
    });
  } catch (e) {
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouteProvider />
      </PersistGate>
    </Provider>
  );
}

export default App;
